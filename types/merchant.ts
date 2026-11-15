export type StoreType = 'سوبر ماركت' | 'هايبر ماركت' | 'محل بقالة' | 'ميني ماركت' | 'كشك';

export interface MerchantProfile {
  storeName: string;
  ownerName: string;
  phone: string;
  storeType: StoreType;
  governorate: string;
  area: string;
  address: string;
  avatar?: string;
}

export interface SupplierProduct {
  id: string;
  supplierId: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  originalPrice?: number;
  minOrder?: number;
  inStock: boolean;
  image?: string;
  sku?: string;
  description?: string;
  supplierName?: string;
}

export interface Supplier {
  id: string;
  slug: string;
  name: string;
  category: string;
  logo: string;
  description: string;
  deliveryAreas: string[];
  phone: string;
  minOrderValue: number;
  productsCount: number;
  linkedMerchantsCount: number;
  isLinked: boolean;
  linkedAt?: string;
  rating?: number;
  ordersCompleted?: number;
}

export type FeedUpdateType = 'new_product' | 'offer' | 'price_change' | 'announcement';

export interface FeedUpdate {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierLogo: string;
  type: FeedUpdateType;
  title: string;
  description: string;
  publishedAt: string;
  isRead: boolean;
  // Type-specific payloads
  productDetails?: {
    productId?: string;
    productName: string;
    price: number;
    unit: string;
  };
  offerDetails?: {
    discountPercentage: number;
    validUntil: string;
    badgeText?: string;
  };
  priceChangeDetails?: {
    productId?: string;
    productName: string;
    oldPrice: number;
    newPrice: number;
    percentChange: number; // e.g. -12% or +5%
  };
}

export interface CartItem {
  productId: string;
  supplierId: string;
  supplierName: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  minOrder: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';

export interface OrderTimelineStep {
  title: string;
  timestamp: string;
  completed: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
}

export interface MerchantOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  supplierLogo: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  notes?: string;
  deliveryArea: string;
  deliveryAddress: string;
}

export interface MerchantStats {
  linkedSuppliersCount: number;
  unreadUpdatesCount: number;
  activeOffersCount: number;
  pendingOrdersCount: number;
}
