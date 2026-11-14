export interface OverviewMetrics {
  companiesCount: number;
  merchantsCount: number;
  newRegistrationsToday: number;
  newRegistrationsWeek: number;
  ordersCount: number;
  connectionsCount: number;
  totalRevenue: number;
}

export type RegistrationStatus = 'pending' | 'approved' | 'rejected';

export interface Registration {
  id: string;
  companyName: string;
  ownerName: string;
  phone: string;
  email: string;
  governorate: string;
  category: string;
  taxId?: string;
  commercialRegister?: string;
  status: RegistrationStatus;
  requestedAt: string;
  notes?: string;
}

export interface AdminCompany {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  governorate: string;
  category: string;
  taxId: string;
  commercialRegister: string;
  merchantsLinked: number;
  productsCount: number;
  ordersCount: number;
  totalRevenue: number;
  joinedAt: string;
  active: boolean;
  logo?: string;
}

export interface AdminMerchant {
  id: string;
  name: string;
  type: string; // سوبرماركت / هايبر / محل بقالة
  phone: string;
  governorate: string;
  area: string;
  linkedCompanies: number;
  ordersCount: number;
  totalSpent: number;
  joinedAt: string;
  active: boolean;
}

export interface Complaint {
  id: string;
  from: 'merchant' | 'company';
  fromName: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  reply?: string;
}

export interface PlatformSettings {
  categories: string[];
  regions: string[];
}

export interface SalesMember {
  id: string;
  name: string;
  phone: string;
  companiesContacted: number;
  companiesRegistered: number;
  companiesInterested: number;
  target: number;
  status: string;
}
