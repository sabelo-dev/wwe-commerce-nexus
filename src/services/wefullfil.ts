
import { WeFulFilResponse, WeFulFilProduct, WeFulFilError, WeFulFilProductFilter } from "@/types/wefullfil";
import { AdminProduct } from "@/types/admin";

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
    
    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
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
 * Imports a WeFulFil product to the admin system
 */
export async function importWeFulFilProductToAdmin(product: WeFulFilProduct): Promise<AdminProduct> {
  // In a real app, you'd call your backend API to import the product
  // This is a mock implementation for demonstration
  
  const adminProduct = mapWeFulFilToAdminProduct(product);
  
  // Simulate an API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return adminProduct;
}

/**
 * Imports multiple WeFulFil products to the admin system
 */
export async function importMultipleWeFulFilProducts(
  products: WeFulFilProduct[]
): Promise<AdminProduct[]> {
  // In a real app, you'd use a bulk import API
  const importedProducts: AdminProduct[] = [];
  
  for (const product of products) {
    try {
      const imported = await importWeFulFilProductToAdmin(product);
      importedProducts.push(imported);
    } catch (error) {
      console.error(`Error importing product ${product.id}:`, error);
      // Continue with other products even if one fails
    }
  }
  
  return importedProducts;
}
