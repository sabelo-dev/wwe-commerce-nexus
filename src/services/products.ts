import { supabase } from "@/integrations/supabase/client";
import { Product, Category } from "@/types";
import { fetchWeFulFilProducts, mapWeFulFilToAdminProduct } from "./wefullfil";

/**
 * Converts database product to frontend Product type
 */
const mapDatabaseProduct = (dbProduct: any, images: any[] = []): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    description: dbProduct.description || "",
    price: Number(dbProduct.price),
    compareAtPrice: dbProduct.compare_at_price ? Number(dbProduct.compare_at_price) : undefined,
    images: images.map(img => img.image_url),
    category: dbProduct.category,
    subcategory: dbProduct.subcategory,
    rating: Number(dbProduct.rating) || 0,
    reviewCount: dbProduct.review_count || 0,
    inStock: dbProduct.quantity > 0,
    vendorId: dbProduct.store_id,
    vendorName: "Store", // We'll enhance this later with store names
    createdAt: dbProduct.created_at,
  };
};

/**
 * Fetches products from the database
 */
export const fetchDatabaseProducts = async (): Promise<Product[]> => {
  try {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        product_images (
          image_url,
          position
        )
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (productsError) {
      console.error('Error fetching database products:', productsError);
      return [];
    }

    return (products || []).map(product => 
      mapDatabaseProduct(product, product.product_images || [])
    );
  } catch (error) {
    console.error('Error fetching database products:', error);
    return [];
  }
};

/**
 * Converts WeFulFil product to frontend Product type
 */
const mapWeFulFilProduct = (wfProduct: any): Product => {
  return {
    id: `wf-${wfProduct.id}`,
    name: wfProduct.title,
    slug: wfProduct.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
    description: wfProduct.description || "",
    price: Number(wfProduct.price),
    images: Array.isArray(wfProduct.images) ? wfProduct.images : [],
    category: wfProduct.categories?.[0] || "General",
    subcategory: wfProduct.categories?.[1],
    rating: 0,
    reviewCount: 0,
    inStock: wfProduct.inventory_quantity > 0,
    vendorId: "wefullfil",
    vendorName: wfProduct.vendor || "WeFulFil",
    createdAt: wfProduct.created_at || new Date().toISOString(),
  };
};

/**
 * Fetches products from WeFulFil
 */
export const fetchWeFulFilProductsForFrontend = async (limit: number = 20): Promise<Product[]> => {
  try {
    const response = await fetchWeFulFilProducts({
      per_page: limit,
      page: 1
    });

    return response.data.map(mapWeFulFilProduct);
  } catch (error) {
    console.error('Error fetching WeFulFil products:', error);
    return [];
  }
};

/**
 * Fetches all products from both database and WeFulFil
 */
export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    // Always fetch database products first
    const dbProducts = await fetchDatabaseProducts();
    
    // Try to fetch WeFulFil products but don't fail if it errors
    let wfProducts: Product[] = [];
    try {
      wfProducts = await fetchWeFulFilProductsForFrontend(50);
    } catch (error) {
      console.warn('WeFulFil products unavailable:', error);
      // Continue with just database products
    }

    return [...dbProducts, ...wfProducts];
  } catch (error) {
    console.error('Error fetching all products:', error);
    // As fallback, try to return just database products
    try {
      return await fetchDatabaseProducts();
    } catch (dbError) {
      console.error('Error fetching database products:', dbError);
      return [];
    }
  }
};

/**
 * Fetches categories from products
 */
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const products = await fetchAllProducts();
    const categoryMap = new Map<string, Category>();

    products.forEach(product => {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, {
          id: product.category.toLowerCase().replace(/\s+/g, '-'),
          name: product.category,
          slug: product.category.toLowerCase().replace(/\s+/g, '-'),
          image: `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`,
          subcategories: [],
        });
      }

      const category = categoryMap.get(product.category)!;
      if (product.subcategory && !category.subcategories?.some(sub => sub.name === product.subcategory)) {
        category.subcategories = category.subcategories || [];
        category.subcategories.push({
          id: `${product.category.toLowerCase()}-${product.subcategory.toLowerCase()}`.replace(/\s+/g, '-'),
          name: product.subcategory,
          slug: product.subcategory.toLowerCase().replace(/\s+/g, '-'),
        });
      }
    });

    return Array.from(categoryMap.values());
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

/**
 * Fetches featured products (mix of database and WeFulFil)
 */
export const fetchFeaturedProducts = async (limit: number = 4): Promise<Product[]> => {
  try {
    const allProducts = await fetchAllProducts();
    
    // Get top-rated and in-stock products
    const featuredProducts = allProducts
      .filter(product => product.inStock)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);

    return featuredProducts;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

/**
 * Fetches new arrivals
 */
export const fetchNewArrivals = async (limit: number = 4): Promise<Product[]> => {
  try {
    const allProducts = await fetchAllProducts();
    
    // Get newest products
    const newArrivals = allProducts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return newArrivals;
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
};

/**
 * Fetches popular products
 */
export const fetchPopularProducts = async (limit: number = 4): Promise<Product[]> => {
  try {
    const allProducts = await fetchAllProducts();
    
    // Get products with highest review count and rating
    const popularProducts = allProducts
      .filter(product => product.reviewCount > 0 || product.rating > 0)
      .sort((a, b) => (b.reviewCount * b.rating) - (a.reviewCount * a.rating))
      .slice(0, limit);

    return popularProducts.length > 0 ? popularProducts : allProducts.slice(0, limit);
  } catch (error) {
    console.error('Error fetching popular products:', error);
    return [];
  }
};

/**
 * Fetches products by category
 */
export const fetchProductsByCategory = async (categoryName: string): Promise<Product[]> => {
  try {
    const allProducts = await fetchAllProducts();
    return allProducts.filter(product => product.category.toLowerCase() === categoryName.toLowerCase());
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

/**
 * Fetches products by subcategory
 */
export const fetchProductsBySubcategory = async (category: string, subcategory: string): Promise<Product[]> => {
  try {
    const allProducts = await fetchAllProducts();
    return allProducts.filter(
      product => 
        product.category.toLowerCase() === category.toLowerCase() && 
        product.subcategory?.toLowerCase().includes(subcategory.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching products by subcategory:', error);
    return [];
  }
};

/**
 * Fetches best selling products (high rating and review count)
 */
export const fetchBestSellers = async (limit: number = 20): Promise<Product[]> => {
  try {
    const allProducts = await fetchAllProducts();
    return allProducts
      .filter(product => product.rating >= 4.0 && product.reviewCount >= 10)
      .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return [];
  }
};

/**
 * Fetches products on sale (with compare at price)
 */
export const fetchDealsProducts = async (limit: number = 20): Promise<Product[]> => {
  try {
    const allProducts = await fetchAllProducts();
    return allProducts
      .filter(product => product.compareAtPrice && product.compareAtPrice > product.price)
      .sort((a, b) => {
        const aDiscount = ((a.compareAtPrice! - a.price) / a.compareAtPrice!) * 100;
        const bDiscount = ((b.compareAtPrice! - b.price) / b.compareAtPrice!) * 100;
        return bDiscount - aDiscount; // Sort by highest discount percentage
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching deals products:', error);
    return [];
  }
};

/**
 * Fetches a single product by slug
 */
export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const allProducts = await fetchAllProducts();
    return allProducts.find(product => product.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
};

/**
 * Fetches related products (same category, excluding current product)
 */
export const fetchRelatedProducts = async (productId: string, category: string, limit: number = 4): Promise<Product[]> => {
  try {
    const allProducts = await fetchAllProducts();
    return allProducts
      .filter(product => product.id !== productId && product.category === category)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
};