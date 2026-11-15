import { LucideIcon } from 'lucide-react';

export interface CommodityPrice {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentAvgPrice: number;
  lastWeekPrice: number;
  changePercent: number;
  trend: 'down' | 'up' | 'stable';
  bestPrice: number;
  bestSupplierName: string;
  bestSupplierId: string;
  advice: string;
  updatedAt: string;
}

export interface RestockPreset {
  id: string;
  title: string;
  description: string;
  estimatedTotal: number;
  itemsCount: number;
  badge: string;
  items: {
    productId: string;
    productName: string;
    supplierId: string;
    supplierName: string;
    unit: string;
    price: number;
    recommendedQty: number;
  }[];
}

export interface CouponItem {
  id: string;
  code: string;
  supplierName: string;
  supplierLogo: string;
  discountValue: string;
  minOrder: number;
  expiresIn: string;
  isUsed: boolean;
}

export interface WalletTransaction {
  id: string;
  type: 'earn' | 'redeem';
  amount: number;
  orderNumber?: string;
  description: string;
  date: string;
}
