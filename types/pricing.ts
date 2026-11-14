export type TierColor = 'blue' | 'purple' | 'emerald' | 'amber' | 'rose' | 'indigo';

export interface PriceTier {
  id: string;
  name: string;             // جملة، نص جملة، مفرق، هايبر ماركت
  colorTag: TierColor;
  minOrderValue?: number;   // الحد الأدنى للطلب بالجنيه
  description?: string;
  merchantsCount?: number;
  isDefault?: boolean;
  createdAt: string;
}

export interface TierProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;             // كرتونة 24 قطعة، صندوق 12 لتر، إلخ
  basePrice: number;        // السعر الأساسي (سعر القائمة)
  tierPrices: Record<string, number | null>; // tierId -> price (null = غير محدد)
  imagePlaceholder?: string;
}

export interface PricingMerchant {
  id: string;
  name: string;
  ownerName: string;
  area: string;
  city: string;
  phone: string;
  tierId: string | null;    // null = بدون شريحة (orange badge)
  specialPrices?: Record<string, number>; // productId -> override custom price
  joinedDate?: string;
}

export interface BulkDiscountConfig {
  tierId: string;
  discountPercentage: number; // e.g. 10%
  roundingMode?: 'none' | 'round_pound';
}
