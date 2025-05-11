
import { WeFulFilResponse, WeFulFilProduct, WeFulFilError } from "@/types/wefullfil";
import { AdminProduct } from "@/types/admin";

const API_BASE_URL = "https://wefullfill.com";
const API_TOKEN = "FKfz13Vd5RtRibx4cLi6i2JufklLqfrczdby146anMeVHwITYex1Ke7IhnLS";

export async function fetchWeFulFilProducts(search?: string): Promise<WeFulFilResponse> {
  try {
    const searchParams = new URLSearchParams();
    if (search) {
      searchParams.append("search", search);
    }
    
    const url = `${API_BASE_URL}/api/products${search ? `?${searchParams.toString()}` : ""}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorData: WeFulFilError = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching WeFulFil products:", error);
    throw error;
  }
}

export async function importWeFulFilProductToAdmin(product: WeFulFilProduct): Promise<AdminProduct> {
  // In a real app, you'd call your backend API to import the product
  // This is a mock implementation for demonstration
  
  // Convert WeFulFil product to AdminProduct format
  const adminProduct: AdminProduct = {
    id: product.id,
    name: product.title,
    vendorName: "WeFulFil",
    price: product.price,
    status: "pending",
    category: "Imported",
    dateAdded: new Date().toISOString().split('T')[0],
    storeId: "wefullfil"
  };
  
  // In a real implementation, you would save this to your database
  
  return adminProduct;
}
