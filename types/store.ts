export type StoreType = 'سوبر ماركت' | 'هايبر ماركت' | 'ميني ماركت' | 'محل بقالة';

export type StoreRegistrationStatus = 'registered' | 'unregistered';

export interface StoreLocation {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  type: StoreType;
  area: string;
  city: string;
  lat: number;
  lng: number;
  distanceKm: number;
  status: StoreRegistrationStatus;
  invited?: boolean;
  ordersCount?: number;
  joinedDate?: string;
  addressDetails: string;
}

export interface StoreFilterState {
  type: string;
  area: string;
  status: string;
  maxDistance: number;
  searchQuery: string;
}
