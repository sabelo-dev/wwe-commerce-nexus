
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
  tags?: string[];
  vendor?: string;
  categories?: string[];
  weight?: number;
  weight_unit?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
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
  image?: string;
  weight?: number;
  weight_unit?: string;
}

export interface WeFulFilPagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

export interface WeFulFilResponse {
  data: WeFulFilProduct[];
  meta: {
    pagination: WeFulFilPagination;
  }
}

export interface WeFulFilError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface WeFulFilProductFilter {
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: 'title' | 'price' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}
