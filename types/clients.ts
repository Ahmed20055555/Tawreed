export type ClientMerchantType = 'سوبر ماركت' | 'هايبر ماركت' | 'ميني ماركت' | 'محل بقالة';

export interface LinkedClient {
  id: string;
  name: string;
  ownerName: string;
  type: ClientMerchantType;
  area: string;
  city: string;
  phone: string;
  linkedAt: string;          // ISO date or YYYY-MM-DD
  ordersCount: number;
  totalSpend: number;        // إجمالي المسحوبات بالجنيه
  lastOrderDate?: string;
  avatarUrl?: string;
  addressDetails?: string;
  notes?: string;
}

export interface ClientFilterState {
  searchQuery: string;
  area: string;
  type: string;
  orderStatus: 'all' | 'ordered' | 'never_ordered';
  sortBy: 'newest' | 'orders' | 'spend';
}
