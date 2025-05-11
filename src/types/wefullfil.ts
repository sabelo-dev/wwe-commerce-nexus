
export interface WeFulFilProduct {
  id: string;
  title: string;
  sku: string;
  description?: string;
  price: number;
  images: string[];
  variants?: WeFulFilVariant[];
  inventory_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface WeFulFilVariant {
  id: string;
  title: string;
  sku: string;
  price: number;
  inventory_quantity: number;
  option1?: string;
  option2?: string;
  option3?: string;
}

export interface WeFulFilResponse {
  data: WeFulFilProduct[];
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    }
  }
}

export interface WeFulFilError {
  message: string;
  status: number;
}
