
import { WeFulFilResponse, WeFulFilProduct, WeFulFilError, WeFulFilProductFilter, WeFulFilImportJob, WeFulFilStoredProduct } from "@/types/wefullfil";
import { AdminProduct } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";

const API_BASE_URL = "https://wefullfill.com";
const API_TOKEN = "FKfz13Vd5RtRibx4cLi6i2JufklLqfrczdby146anMeVHwITYex1Ke7IhnLS";

/**
 * Creates headers with authentication for WeFulFil API requests
 */
const createHeaders = () => {
  return {
    "Authorization": `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
};

/**
 * Handles error responses from the WeFulFil API
 */
const handleApiError = async (response: Response) => {
  try {
    const errorData: WeFulFilError = await response.json();
    throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error: ${response.status} - ${response.statusText}`);
  }
};

/**
 * Fetches products from WeFulFil with optional filtering
 */
export async function fetchWeFulFilProducts(filters: WeFulFilProductFilter = {}): Promise<WeFulFilResponse> {
  try {
    const searchParams = new URLSearchParams();
    
    if (filters.search) {
      searchParams.append("search", filters.search);
    }
    
    if (filters.page) {
      searchParams.append("page", filters.page.toString());
    }
    
    if (filters.per_page) {
      searchParams.append("per_page", filters.per_page.toString());
    }
    
    if (filters.sort_by) {
      searchParams.append("sort_by", filters.sort_by);
      searchParams.append("sort_order", filters.sort_order || "asc");
    }
    
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/api/products${queryString ? `?${queryString}` : ""}`;
    
    // Add API token to URL
    const apiUrl = url + (queryString ? '&' : '?') + `api_token=${API_TOKEN}`;
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching WeFulFil products:", error);
    throw error;
  }
}

/**
 * Fetches a single product from WeFulFil by ID
 */
export async function fetchWeFulFilProductById(productId: string): Promise<WeFulFilProduct> {
  try {
    const url = `${API_BASE_URL}/api/products/${productId}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
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
 * Stores a WeFulFil product in the database
 */
export async function storeWeFulFilProduct(product: WeFulFilProduct): Promise<WeFulFilStoredProduct> {
  try {
    const { data, error } = await supabase
      .from('wefullfil_products')
      .upsert({
        external_id: product.id,
        title: product.title,
        sku: product.sku,
        description: product.description,
        price: product.price,
        images: product.images,
        inventory_quantity: product.inventory_quantity,
        tags: product.tags,
        vendor: product.vendor,
        categories: product.categories,
        weight: product.weight,
        weight_unit: product.weight_unit,
        dimensions: product.dimensions,
        import_status: 'pending',
        imported_at: new Date().toISOString()
      }, {
        onConflict: 'external_id'
      })
      .select()
      .single();

    if (error) {
      console.error("Error storing WeFulFil product:", error);
      throw error;
    }

    // Process response to ensure it matches our type
    const storedProduct: WeFulFilStoredProduct = {
      ...data,
      images: Array.isArray(data.images) ? data.images : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      categories: Array.isArray(data.categories) ? data.categories : [],
      // Ensure import_status is cast to the correct union type
      import_status: data.import_status as "pending" | "imported" | "failed"
    };

    // Store variants if they exist
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        await storeWeFulFilVariant(data.id, variant);
      }
    }

    return storedProduct;
  } catch (error) {
    console.error("Error storing WeFulFil product:", error);
    throw error;
  }
}

/**
 * Stores a WeFulFil variant in the database
 */
export async function storeWeFulFilVariant(productId: string, variant: any): Promise<void> {
  try {
    const { error } = await supabase
      .from('wefullfil_product_variants')
      .upsert({
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
      }, {
        onConflict: 'product_id,external_id'
      });

    if (error) {
      console.error("Error storing WeFulFil variant:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error storing WeFulFil variant:", error);
    throw error;
  }
}

/**
 * Fetches stored WeFulFil products from the database
 */
export async function fetchStoredWeFulFilProducts(page: number = 1, perPage: number = 10, search?: string): Promise<{ data: WeFulFilStoredProduct[], count: number }> {
  try {
    let query = supabase
      .from('wefullfil_products')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`title.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (error) {
      console.error("Error fetching stored WeFulFil products:", error);
      throw error;
    }

    // Process the data to ensure it matches our type
    const processedData: WeFulFilStoredProduct[] = data?.map(item => ({
      ...item,
      images: Array.isArray(item.images) ? item.images : [],
      tags: Array.isArray(item.tags) ? item.tags : [],
      categories: Array.isArray(item.categories) ? item.categories : [],
      // Ensure import_status is cast to the correct union type
      import_status: item.import_status as "pending" | "imported" | "failed"
    })) || [];

    return { data: processedData, count: count || 0 };
  } catch (error) {
    console.error("Error fetching stored WeFulFil products:", error);
    throw error;
  }
}

/**
 * Imports a WeFulFil product to the admin system and stores it in Supabase
 */
export async function importWeFulFilProductToAdmin(product: WeFulFilProduct): Promise<AdminProduct> {
  try {
    // First, store the product in the wefullfil_products table
    const storedProduct = await storeWeFulFilProduct(product);
    
    // Convert to admin product format
    const adminProduct = mapWeFulFilToAdminProduct(product);
    
    // Insert into products table
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: adminProduct.name,
        slug: adminProduct.name.toLowerCase().replace(/[^\w-]+/g, '-'),
        price: adminProduct.price,
        status: adminProduct.status,
        category: adminProduct.category,
        quantity: adminProduct.inventoryQuantity || 0,
        store_id: adminProduct.storeId,
        external_id: adminProduct.externalId,
        external_source: adminProduct.externalSource,
        sku: adminProduct.sku
      })
      .select()
      .single();

    if (error) {
      console.error("Error importing product to admin:", error);
      throw error;
    }

    // Update the wefullfil_product with the mapped product ID
    await supabase
      .from('wefullfil_products')
      .update({
        mapped_product_id: data.id,
        import_status: 'imported'
      })
      .eq('id', storedProduct.id);

    // Add product images
    if (product.images && product.images.length > 0) {
      const imageInserts = product.images.map((imageUrl, index) => ({
        product_id: data.id,
        image_url: imageUrl,
        position: index
      }));

      await supabase.from('product_images').insert(imageInserts);
    }

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
  try {
    // Create an import job
    const job = await createImportJob('wefullfil', products.length);
    
    // Store all products first
    const importedProducts: AdminProduct[] = [];
    let processedCount = 0;
    let successCount = 0;
    let failedCount = 0;
    
    // Import products one by one
    for (const product of products) {
      try {
        const imported = await importWeFulFilProductToAdmin(product);
        importedProducts.push(imported);
        processedCount++;
        successCount++;
        
        // Update job progress periodically
        if (processedCount % 5 === 0 || processedCount === products.length) {
          await updateImportJob(
            job.id, 
            processedCount === products.length ? 'completed' : 'processing',
            processedCount,
            successCount,
            failedCount
          );
        }
      } catch (error) {
        console.error(`Error importing product ${product.id}:`, error);
        processedCount++;
        failedCount++;
        
        // Continue with other products even if one fails
      }
    }
    
    // Ensure job is marked as completed
    if (processedCount === products.length && job.status !== 'completed') {
      await updateImportJob(
        job.id,
        'completed',
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
