import { WeFulFilResponse, WeFulFilProduct, WeFulFilError, WeFulFilProductFilter, WeFulFilImportJob, WeFulFilStoredProduct } from "@/types/wefullfil";
import { AdminProduct } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";

// Cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Makes secure API requests through the edge function proxy
 */
const makeSecureApiRequest = async <T>(
  endpoint: string,
  options: {
    method?: string;
    filters?: Record<string, any>;
    productId?: string;
  } = {}
): Promise<T> => {
  const { data, error } = await supabase.functions.invoke('wefullfil-proxy', {
    body: {
      endpoint,
      method: options.method || 'GET',
      filters: options.filters,
      productId: options.productId,
    },
  });

  if (error) {
    console.error('WeFulFil proxy error:', error);
    throw new Error(`WeFulFil API Error: ${error.message}`);
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};

/**
 * Cache utility functions
 */
const getCachedData = (key: string) => {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  apiCache.delete(key);
  return null;
};

const setCachedData = (key: string, data: any, ttl: number = CACHE_TTL) => {
  apiCache.set(key, { data, timestamp: Date.now(), ttl });
};

/**
 * Optimized function to fetch products from WeFulFil with caching and better error handling
 */
export async function fetchWeFulFilProducts(filters: WeFulFilProductFilter = {}): Promise<WeFulFilResponse> {
  try {
    const cacheKey = `products_${JSON.stringify(filters)}`;
    
    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const data = await makeSecureApiRequest<WeFulFilResponse>('/api/products', {
      filters
    });
    
    // Cache successful responses
    setCachedData(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error("Error fetching WeFulFil products:", error);
    throw error;
  }
}

/**
 * Optimized function to fetch a single product from WeFulFil by ID
 */
export async function fetchWeFulFilProductById(productId: string): Promise<WeFulFilProduct> {
  try {
    const cacheKey = `product_${productId}`;
    
    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData.data;
    }

    const data = await makeSecureApiRequest<{ data: WeFulFilProduct }>('/api/products', {
      productId
    });
    
    // Cache successful responses
    setCachedData(cacheKey, data);
    
    return data.data;
  } catch (error) {
    console.error(`Error fetching WeFulFil product ${productId}:`, error);
    throw error;
  }
}

/**
 * Converts a WeFulFil product to the admin product format
 */
export function mapWeFulFilToAdminProduct(product: WeFulFilProduct): AdminProduct {
  return {
    id: product.id,
    name: product.title,
    vendorName: product.vendor || "WeFulFil",
    price: product.price,
    status: "pending",
    category: product.categories?.[0] || "Imported",
    dateAdded: new Date().toISOString().split('T')[0],
    storeId: "wefullfil",
    externalId: product.id,
    externalSource: "wefullfil",
    inventoryQuantity: product.inventory_quantity,
    sku: product.sku
  };
}

/**
 * Optimized function to store a WeFulFil product in the database with better error handling
 */
export async function storeWeFulFilProduct(product: WeFulFilProduct): Promise<WeFulFilStoredProduct> {
  try {
    const productData = {
      external_id: product.id,
      title: product.title,
      sku: product.sku,
      description: product.description,
      price: product.price,
      images: product.images || [],
      inventory_quantity: product.inventory_quantity,
      tags: product.tags || [],
      vendor: product.vendor,
      categories: product.categories || [],
      weight: product.weight,
      weight_unit: product.weight_unit,
      dimensions: product.dimensions,
      import_status: 'pending' as const,
      imported_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('wefullfil_products')
      .upsert(productData, {
        onConflict: 'external_id'
      })
      .select()
      .single();

    if (error) {
      console.error("Error storing WeFulFil product:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    const storedProduct: WeFulFilStoredProduct = {
      ...data,
      images: Array.isArray(data.images) ? data.images : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      categories: Array.isArray(data.categories) ? data.categories : [],
      import_status: data.import_status as "pending" | "imported" | "failed"
    };

    // Store variants in parallel if they exist
    if (product.variants && product.variants.length > 0) {
      await Promise.all(
        product.variants.map(variant => storeWeFulFilVariant(data.id, variant))
      );
    }

    return storedProduct;
  } catch (error) {
    console.error("Error storing WeFulFil product:", error);
    throw error;
  }
}

/**
 * Optimized function to store a WeFulFil variant in the database
 */
export async function storeWeFulFilVariant(productId: string, variant: any): Promise<void> {
  try {
    const variantData = {
      product_id: productId,
      external_id: variant.id,
      title: variant.title,
      sku: variant.sku,
      price: variant.price,
      inventory_quantity: variant.inventory_quantity,
      option1: variant.option1,
      option2: variant.option2,
      option3: variant.option3,
      image: variant.image,
      weight: variant.weight,
      weight_unit: variant.weight_unit
    };

    const { error } = await supabase
      .from('wefullfil_product_variants')
      .upsert(variantData, {
        onConflict: 'product_id,external_id'
      });

    if (error) {
      console.error("Error storing WeFulFil variant:", error);
      throw new Error(`Variant storage error: ${error.message}`);
    }
  } catch (error) {
    console.error("Error storing WeFulFil variant:", error);
    throw error;
  }
}

/**
 * Optimized function to fetch stored WeFulFil products from the database with better query optimization
 */
export async function fetchStoredWeFulFilProducts(
  page: number = 1, 
  perPage: number = 10, 
  search?: string
): Promise<{ data: WeFulFilStoredProduct[], count: number }> {
  try {
    let query = supabase
      .from('wefullfil_products')
      .select('*', { count: 'exact' });

    if (search && search.trim()) {
      query = query.or(`title.ilike.%${search.trim()}%,sku.ilike.%${search.trim()}%,vendor.ilike.%${search.trim()}%`);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (error) {
      console.error("Error fetching stored WeFulFil products:", error);
      throw new Error(`Database query error: ${error.message}`);
    }

    const processedData: WeFulFilStoredProduct[] = (data || []).map(item => ({
      ...item,
      images: Array.isArray(item.images) ? item.images : [],
      tags: Array.isArray(item.tags) ? item.tags : [],
      categories: Array.isArray(item.categories) ? item.categories : [],
      import_status: item.import_status as "pending" | "imported" | "failed"
    }));

    return { data: processedData, count: count || 0 };
  } catch (error) {
    console.error("Error fetching stored WeFulFil products:", error);
    throw error;
  }
}

/**
 * Optimized function to import a WeFulFil product to the admin system
 */
export async function importWeFulFilProductToAdmin(product: WeFulFilProduct): Promise<AdminProduct> {
  try {
    // Start transaction-like operations
    const storedProduct = await storeWeFulFilProduct(product);
    const adminProduct = mapWeFulFilToAdminProduct(product);
    
    // Create slug more efficiently
    const slug = adminProduct.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const productData = {
      name: adminProduct.name,
      slug,
      price: adminProduct.price,
      status: adminProduct.status,
      category: adminProduct.category,
      quantity: adminProduct.inventoryQuantity || 0,
      store_id: adminProduct.storeId,
      external_id: adminProduct.externalId,
      external_source: adminProduct.externalSource,
      sku: adminProduct.sku
    };

    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error("Error importing product to admin:", error);
      throw new Error(`Product import error: ${error.message}`);
    }

    // Update the wefullfil_product and add images in parallel
    const updatePromise = supabase
      .from('wefullfil_products')
      .update({
        mapped_product_id: data.id,
        import_status: 'imported'
      })
      .eq('id', storedProduct.id);

    const imagePromise = product.images && product.images.length > 0 ? 
      supabase.from('product_images').insert(
        product.images.map((imageUrl, index) => ({
          product_id: data.id,
          image_url: imageUrl,
          position: index
        }))
      ) : Promise.resolve();

    await Promise.all([updatePromise, imagePromise]);

    return { ...adminProduct, id: data.id };
  } catch (error) {
    console.error("Error importing WeFulFil product:", error);
    throw error;
  }
}

/**
 * Creates a new import job in the database
 */
export async function createImportJob(source: string, totalItems: number): Promise<WeFulFilImportJob> {
  try {
    const { data, error } = await supabase
      .from('import_jobs')
      .insert({
        source,
        total_items: totalItems,
        // Fix the type by casting explicitly
        status: 'processing' as const,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating import job:", error);
      throw error;
    }

    return {
      id: data.id,
      status: data.status as "pending" | "processing" | "completed" | "failed",
      totalItems: data.total_items,
      processedItems: data.processed_items,
      successfulItems: data.successful_items,
      failedItems: data.failed_items,
      startedAt: data.started_at,
      completedAt: data.completed_at,
      errorMessage: data.error_message
    };
  } catch (error) {
    console.error("Error creating import job:", error);
    throw error;
  }
}

/**
 * Updates an import job status in the database
 */
export async function updateImportJob(
  jobId: string, 
  status: 'pending' | 'processing' | 'completed' | 'failed',
  processedItems: number,
  successfulItems: number,
  failedItems: number,
  errorMessage?: string
): Promise<void> {
  try {
    const updates: any = {
      status,
      processed_items: processedItems,
      successful_items: successfulItems,
      failed_items: failedItems
    };

    if (status === 'completed' || status === 'failed') {
      updates.completed_at = new Date().toISOString();
    }

    if (errorMessage) {
      updates.error_message = errorMessage;
    }

    const { error } = await supabase
      .from('import_jobs')
      .update(updates)
      .eq('id', jobId);

    if (error) {
      console.error("Error updating import job:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error updating import job:", error);
    throw error;
  }
}

/**
 * Imports multiple WeFulFil products to the admin system using a background job
 */
export async function importMultipleWeFulFilProducts(
  products: WeFulFilProduct[]
): Promise<AdminProduct[]> {
  if (!products || products.length === 0) {
    throw new Error("No products provided for import");
  }

  try {
    const job = await createImportJob('wefullfil', products.length);
    const importedProducts: AdminProduct[] = [];
    let processedCount = 0;
    let successCount = 0;
    let failedCount = 0;
    
    // Process in smaller batches to avoid overwhelming the system
    const batchSize = 5;
    const batches = [];
    
    for (let i = 0; i < products.length; i += batchSize) {
      batches.push(products.slice(i, i + batchSize));
    }
    
    for (const batch of batches) {
      const batchPromises = batch.map(async (product) => {
        try {
          const imported = await importWeFulFilProductToAdmin(product);
          importedProducts.push(imported);
          successCount++;
          return { success: true, product: imported };
        } catch (error) {
          console.error(`Error importing product ${product.id}:`, error);
          failedCount++;
          return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
      });
      
      await Promise.allSettled(batchPromises);
      processedCount += batch.length;
      
      // Update job progress after each batch
      await updateImportJob(
        job.id,
        processedCount === products.length ? 'completed' : 'processing',
        processedCount,
        successCount,
        failedCount
      );
    }
    
    return importedProducts;
  } catch (error) {
    console.error("Error in bulk import process:", error);
    throw error;
  }
}

/**
 * Clear API cache - useful for forcing fresh data
 */
export function clearWeFulFilCache(): void {
  apiCache.clear();
}

/**
 * Get cache statistics for debugging
 */
export function getCacheStats(): { size: number; entries: string[] } {
  return {
    size: apiCache.size,
    entries: Array.from(apiCache.keys())
  };
}
