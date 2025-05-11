
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

export interface WeFulFilImportJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalItems: number;
  processedItems: number;
  successfulItems: number;
  failedItems: number;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface WeFulFilStoredProduct {
  id: string;
  external_id: string;
  title: string;
  sku: string;
  description?: string;
  price: number;
  images: string[];
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
  import_status: 'pending' | 'imported' | 'failed';
  imported_at: string;
  mapped_product_id?: string;
}

export interface WeFulFilStoredVariant {
  id: string;
  product_id: string;
  external_id: string;
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
  created_at: string;
  updated_at: string;
}
