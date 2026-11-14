export type ClearanceStatus = 'active' | 'expired' | 'sold_out';

export interface ClearanceListing {
  id: string;
  productName: string;
  brand: string;
  category: string;
  imagePlaceholder?: string;
  originalPrice: number;     // سعر الجملة الأصلي
  clearancePrice: number;    // سعر التصفية المخفض
  discountPercentage: number; // نسبة الخصم %
  totalCartons: number;      // إجمالي الكمية المعروضة
  soldCartons: number;       // الكمية المباعة
  availableCartons: number;  // الكمية المتبقية
  minOrderQuantity: number;  // أقل كمية للطلب
  expiryDate: string;        // تاريخ انتهاء الصلاحية (YYYY-MM-DD)
  deliveryAreas: string[];   // محافظات ومناطق التوصيل المتاحة
  status: ClearanceStatus;
  notes?: string;
  createdAt: string;
}

export interface ClearanceFormData {
  productName: string;
  brand: string;
  category: string;
  originalPrice: number;
  clearancePrice: number;
  totalCartons: number;
  minOrderQuantity: number;
  expiryDate: string;
  deliveryAreas: string[];
  notes?: string;
}
