
export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  description?: string;
  logoUrl?: string;
  status: "pending" | "approved" | "rejected";
  approvalDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorDocument {
  id: string;
  vendorId: string;
  documentType: string;
  documentUrl: string;
  status: "pending" | "approved" | "rejected";
  uploadedAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;
  vendorId: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  shippingPolicy?: string;
  returnPolicy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  quantity: number;
  category: string;
  subcategory?: string;
  status: "pending" | "approved" | "active" | "inactive" | "rejected";
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariation {
  id: string;
  productId: string;
  attributes: Record<string, any>;
  price: number;
  quantity: number;
  sku?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
  total: number;
  shippingAddress: Record<string, any>;
  shippingMethod?: string;
  paymentMethod?: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  trackingNumber?: string;
  trackingUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  storeId: string;
  variationId?: string;
  quantity: number;
  price: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
  vendorStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Payout {
  id: string;
  vendorId: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  payoutDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorNotification {
  id: string;
  vendorId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: string;
}
