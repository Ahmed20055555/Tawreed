import { ClearanceListing, ClearanceFormData } from '@/types/clearance';
import { StoreLocation } from '@/types/store';
import { PriceTier, TierProduct, PricingMerchant } from '@/types/pricing';
import { LinkedClient } from '@/types/clients';
import { SupplierUpdate } from '@/types/updates';
import { INITIAL_CLEARANCE_LISTINGS } from '@/data/clearance-mock';
import { INITIAL_STORES } from '@/data/stores-mock';
import {
  DEFAULT_PRICE_TIERS,
  INITIAL_TIER_PRODUCTS,
  INITIAL_PRICING_MERCHANTS,
} from '@/data/pricing-mock';
import { INITIAL_LINKED_CLIENTS } from '@/data/clients-mock';
import { INITIAL_SUPPLIER_UPDATES } from '@/data/updates-mock';

/**
 * دالات Mock API قابلة للاستبدال بسهولة لاحقاً بروابط Backend حقيقية
 */

// ==========================================
// 1. سوق التصفية (Clearance Market)
// ==========================================

// TODO(backend): replace with real API call (GET /api/supplier/clearance)
export function getClearanceListings(): ClearanceListing[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tawreed_clearance_listings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse clearance listings from localStorage', e);
      }
    }
  }
  return INITIAL_CLEARANCE_LISTINGS;
}

// TODO(backend): replace with real API call (POST /api/supplier/clearance)
export function saveClearanceListing(
  listingOrForm: ClearanceListing | ClearanceFormData,
  currentListings?: ClearanceListing[]
): ClearanceListing[] {
  const existing = currentListings || getClearanceListings();
  let newListing: ClearanceListing;

  if ('id' in listingOrForm) {
    newListing = listingOrForm;
  } else {
    const discount = Math.round(
      ((listingOrForm.originalPrice - listingOrForm.clearancePrice) / listingOrForm.originalPrice) * 100
    );
    newListing = {
      id: 'clr-' + Date.now(),
      productName: listingOrForm.productName,
      brand: listingOrForm.brand || 'عام',
      category: listingOrForm.category || 'مواد غذائية',
      originalPrice: listingOrForm.originalPrice,
      clearancePrice: listingOrForm.clearancePrice,
      discountPercentage: discount,
      totalCartons: listingOrForm.totalCartons,
      soldCartons: 0,
      availableCartons: listingOrForm.totalCartons,
      minOrderQuantity: listingOrForm.minOrderQuantity,
      expiryDate: listingOrForm.expiryDate,
      deliveryAreas: listingOrForm.deliveryAreas,
      status: 'active',
      notes: listingOrForm.notes,
      createdAt: new Date().toISOString().split('T')[0],
    };
  }

  const updated = [newListing, ...existing.filter((l) => l.id !== newListing.id)];
  if (typeof window !== 'undefined') {
    localStorage.setItem('tawreed_clearance_listings', JSON.stringify(updated));
  }
  console.log('Saved clearance listing locally:', newListing);
  return updated;
}

// ==========================================
// 2. رادار المحلات (Store Radar)
// ==========================================

// TODO(backend): replace with real API call (GET /api/supplier/radar)
export function getStoresRadar(): StoreLocation[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tawreed_radar_stores');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse radar stores from localStorage', e);
      }
    }
  }
  return INITIAL_STORES;
}

// TODO(backend): replace with real API call (POST /api/stores/:id/invite)
export function markStoreAsInvited(storeId: string, currentStores?: StoreLocation[]): StoreLocation[] {
  const existing = currentStores || getStoresRadar();
  const updated = existing.map((s) => (s.id === storeId ? { ...s, invited: true } : s));
  if (typeof window !== 'undefined') {
    localStorage.setItem('tawreed_radar_stores', JSON.stringify(updated));
  }
  console.log('Store marked as invited:', storeId);
  return updated;
}

// ==========================================
// 3. شرائح الأسعار (Price Tiers)
// ==========================================

// TODO(backend): replace with real API call (GET /api/supplier/price-tiers)
export function getPriceTiers(): PriceTier[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tawreed_price_tiers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse price tiers from localStorage', e);
      }
    }
  }
  return DEFAULT_PRICE_TIERS;
}

// TODO(backend): replace with real API call (POST/PUT /api/supplier/price-tiers)
export function savePriceTier(tier: PriceTier, currentTiers?: PriceTier[]): PriceTier[] {
  const existing = currentTiers || getPriceTiers();
  const index = existing.findIndex((t) => t.id === tier.id);
  let updated: PriceTier[];
  if (index >= 0) {
    updated = existing.map((t) => (t.id === tier.id ? tier : t));
  } else {
    updated = [...existing, tier];
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem('tawreed_price_tiers', JSON.stringify(updated));
  }
  console.log('Saved price tier locally:', tier);
  return updated;
}

// TODO(backend): replace with real API call (DELETE /api/supplier/price-tiers/:id)
export function deletePriceTier(tierId: string, currentTiers?: PriceTier[]): PriceTier[] {
  const existing = currentTiers || getPriceTiers();
  const updated = existing.filter((t) => t.id !== tierId);
  if (typeof window !== 'undefined') {
    localStorage.setItem('tawreed_price_tiers', JSON.stringify(updated));
  }
  console.log('Deleted price tier locally:', tierId);
  return updated;
}

// TODO(backend): replace with real API call (GET /api/supplier/products/tier-prices)
export function getTierProducts(): TierProduct[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tawreed_tier_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse tier products from localStorage', e);
      }
    }
  }
  return INITIAL_TIER_PRODUCTS;
}

// TODO(backend): replace with real API call (PUT /api/supplier/products/tier-prices)
export function saveTierProducts(products: TierProduct[]): TierProduct[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tawreed_tier_products', JSON.stringify(products));
  }
  console.log('Saved tier products locally:', products.length);
  return products;
}

// TODO(backend): replace with real API call (GET /api/supplier/merchants/pricing)
export function getPricingMerchants(): PricingMerchant[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tawreed_pricing_merchants');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse pricing merchants from localStorage', e);
      }
    }
  }
  return INITIAL_PRICING_MERCHANTS;
}

// TODO(backend): replace with real API call (PUT /api/supplier/merchants/:id/tier)
export function updateMerchantTier(
  merchantId: string,
  tierId: string | null,
  currentMerchants?: PricingMerchant[]
): PricingMerchant[] {
  const existing = currentMerchants || getPricingMerchants();
  const updated = existing.map((m) => (m.id === merchantId ? { ...m, tierId } : m));
  if (typeof window !== 'undefined') {
    localStorage.setItem('tawreed_pricing_merchants', JSON.stringify(updated));
  }
  console.log('Updated merchant tier:', { merchantId, tierId });
  return updated;
}

// TODO(backend): replace with real API call (PUT /api/supplier/merchants/bulk-tier)
export function bulkAssignMerchantsToTier(
  merchantIds: string[],
  tierId: string | null,
  currentMerchants?: PricingMerchant[]
): PricingMerchant[] {
  const existing = currentMerchants || getPricingMerchants();
  const setIds = new Set(merchantIds);
  const updated = existing.map((m) => (setIds.has(m.id) ? { ...m, tierId } : m));
  if (typeof window !== 'undefined') {
    localStorage.setItem('tawreed_pricing_merchants', JSON.stringify(updated));
  }
  console.log('Bulk assigned merchants to tier:', { count: merchantIds.length, tierId });
  return updated;
}

// TODO(backend): replace with real API call (PUT /api/supplier/merchants/:id/special-prices)
export function updateMerchantSpecialPrice(
  merchantId: string,
  productId: string,
  price: number | null,
  currentMerchants?: PricingMerchant[]
): PricingMerchant[] {
  const existing = currentMerchants || getPricingMerchants();
  const updated = existing.map((m) => {
    if (m.id !== merchantId) return m;
    const special = { ...(m.specialPrices || {}) };
    if (price === null || price <= 0) {
      delete special[productId];
    } else {
      special[productId] = price;
    }
    return { ...m, specialPrices: special };
  });
  if (typeof window !== 'undefined') {
    localStorage.setItem('tawreed_pricing_merchants', JSON.stringify(updated));
  }
  console.log('Updated special price:', { merchantId, productId, price });
  return updated;
}

// Mock current logged-in merchant session for /merchant/catalog/[supplierId]
export function getCurrentMerchantSession(): PricingMerchant {
  // Mock default: "سوبر ماركت الفيروز الحديث" which is on "شريحة نص جملة"
  return (
    INITIAL_PRICING_MERCHANTS.find((m) => m.id === 'mer_3') || INITIAL_PRICING_MERCHANTS[0]
  );
}

// ==========================================
// 4. عملائي (Linked Clients)
// ==========================================

// TODO(backend): replace with real API call (GET /api/supplier/clients)
export function getClients(): LinkedClient[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tawreed_linked_clients');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse linked clients from localStorage', e);
      }
    }
  }
  return INITIAL_LINKED_CLIENTS;
}

// TODO(backend): replace with real API call (POST /api/supplier/clients)
export function saveClient(client: LinkedClient, currentClients?: LinkedClient[]): LinkedClient[] {
  const existing = currentClients || getClients();
  const updated = [client, ...existing.filter((c) => c.id !== client.id)];
  if (typeof window !== 'undefined') {
    localStorage.setItem('tawreed_linked_clients', JSON.stringify(updated));
  }
  console.log('Saved linked client locally:', client);
  return updated;
}

// ==========================================
// 5. النشر للعملاء (Supplier Updates)
// ==========================================

// TODO(backend): replace with real API call (GET /api/supplier/updates)
export function getUpdates(): SupplierUpdate[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tawreed_supplier_updates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse supplier updates from localStorage', e);
      }
    }
  }
  return INITIAL_SUPPLIER_UPDATES;
}

// TODO(backend): replace with real API call (POST /api/supplier/updates)
export function publishUpdate(
  update: SupplierUpdate,
  currentUpdates?: SupplierUpdate[]
): SupplierUpdate[] {
  const existing = currentUpdates || getUpdates();
  const index = existing.findIndex((u) => u.id === update.id);
  let updated: SupplierUpdate[];
  if (index >= 0) {
    updated = existing.map((u) => (u.id === update.id ? update : u));
  } else {
    updated = [update, ...existing];
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem('tawreed_supplier_updates', JSON.stringify(updated));
  }
  console.log('Published update locally:', update);
  return updated;
}

// TODO(backend): replace with real API call (DELETE /api/supplier/updates/:id)
export function deleteUpdate(id: string, currentUpdates?: SupplierUpdate[]): SupplierUpdate[] {
  const existing = currentUpdates || getUpdates();
  const updated = existing.filter((u) => u.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem('tawreed_supplier_updates', JSON.stringify(updated));
  }
  console.log('Deleted update locally:', id);
  return updated;
}

// TODO(backend): replace with real API call (POST /api/supplier/updates/:id/resend)
export function resendUpdate(id: string, currentUpdates?: SupplierUpdate[]): SupplierUpdate[] {
  const existing = currentUpdates || getUpdates();
  const updated = existing.map((u) => {
    if (u.id === id) {
      return {
        ...u,
        publishedAt: new Date().toISOString(),
        reachCount: u.reachCount + 1,
      };
    }
    return u;
  });
  if (typeof window !== 'undefined') {
    localStorage.setItem('tawreed_supplier_updates', JSON.stringify(updated));
  }
  console.log('Resent update locally:', id);
  return updated;
}

// ==========================================
// 9. Admin Owner Dashboard (Frontend Only)
// ==========================================
import {
  OverviewMetrics as AdminOverview,
  Registration,
  AdminCompany,
  AdminMerchant,
  Complaint as AdminComplaint,
  PlatformSettings,
  SalesMember,
} from '@/types/admin-dashboard';
import {
  mockOverview as adminOverview,
  mockRegistrations as adminRegistrations,
  mockCompanies as adminCompanies,
  mockMerchants as adminMerchantsList,
  mockComplaints as adminComplaints,
  mockSettings as adminSettings,
  mockSalesTeam as adminSalesTeam,
} from '@/data/admin-dashboard-mock';

// TODO(backend): replace with real API calls
export const getAdminOverview = (): AdminOverview => adminOverview;
export const getAdminRegistrations = (): Registration[] => adminRegistrations;
export const getAdminCompanies = (): AdminCompany[] => adminCompanies;
export const getAdminMerchants = (): AdminMerchant[] => adminMerchantsList;
export const getAdminComplaints = (): AdminComplaint[] => adminComplaints;
export const getAdminSettings = (): PlatformSettings => adminSettings;
export const getAdminSalesTeam = (): SalesMember[] => adminSalesTeam;


// ==========================================
// 10. Merchant Side (Frontend Only)
// ==========================================
import {
  Supplier,
  SupplierProduct,
  FeedUpdate,
  MerchantProfile,
  MerchantOrder,
} from '@/types/merchant';
import {
  INITIAL_MERCHANT_PROFILE,
  INITIAL_SUPPLIERS,
  INITIAL_PRODUCTS,
  INITIAL_FEED_UPDATES,
  INITIAL_ORDERS,
} from '@/data/merchant-mock';

// TODO(backend): replace with real API call (GET /api/merchant/suppliers)
export function getSuppliers(): Supplier[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tawreed_merchant_suppliers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse merchant suppliers from localStorage', e);
      }
    }
  }
  return INITIAL_SUPPLIERS;
}

// TODO(backend): replace with real API call (GET /api/merchant/suppliers/linked)
export function getLinkedSuppliers(): Supplier[] {
  const all = getSuppliers();
  return all.filter((s) => s.isLinked);
}

// TODO(backend): replace with real API call (GET /api/merchant/suppliers/:id)
export function getSupplierById(idOrSlug: string): Supplier | undefined {
  const all = getSuppliers();
  return all.find((s) => s.id === idOrSlug || s.slug === idOrSlug);
}

// TODO(backend): replace with real API call (GET /api/merchant/suppliers/:id/products)
export function getSupplierProducts(supplierId: string): SupplierProduct[] {
  return INITIAL_PRODUCTS.filter((p) => p.supplierId === supplierId);
}

// TODO(backend): replace with real API call (GET /api/merchant/feed)
export function getFeed(): FeedUpdate[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tawreed_merchant_feed');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse merchant feed from localStorage', e);
      }
    }
  }
  return INITIAL_FEED_UPDATES;
}

// TODO(backend): replace with real API call (POST /api/merchant/suppliers/:id/link)
export function linkSupplier(supplierId: string, currentSuppliers?: Supplier[]): Supplier[] {
  const list = currentSuppliers || getSuppliers();
  const updated = list.map((s) =>
    s.id === supplierId || s.slug === supplierId
      ? {
          ...s,
          isLinked: true,
          linkedAt: new Date().toISOString().split('T')[0],
          linkedMerchantsCount: s.linkedMerchantsCount + 1,
        }
      : s
  );
  if (typeof window !== 'undefined') {
    localStorage.setItem('tawreed_merchant_suppliers', JSON.stringify(updated));
  }
  console.log('[MockAPI] Linked supplier locally:', supplierId);
  return updated;
}

// TODO(backend): replace with real API call (DELETE /api/merchant/suppliers/:id/link)
export function unlinkSupplier(supplierId: string, currentSuppliers?: Supplier[]): Supplier[] {
  const list = currentSuppliers || getSuppliers();
  const updated = list.map((s) =>
    s.id === supplierId || s.slug === supplierId
      ? {
          ...s,
          isLinked: false,
          linkedAt: undefined,
          linkedMerchantsCount: Math.max(0, s.linkedMerchantsCount - 1),
        }
      : s
  );
  if (typeof window !== 'undefined') {
    localStorage.setItem('tawreed_merchant_suppliers', JSON.stringify(updated));
  }
  console.log('[MockAPI] Unlinked supplier locally:', supplierId);
  return updated;
}

// TODO(backend): replace with real API call (PUT /api/merchant/feed/:id/read)
export function markUpdateAsRead(updateId: string, currentFeed?: FeedUpdate[]): FeedUpdate[] {
  const list = currentFeed || getFeed();
  const updated = list.map((u) => (u.id === updateId ? { ...u, isRead: true } : u));
  if (typeof window !== 'undefined') {
    localStorage.setItem('tawreed_merchant_feed', JSON.stringify(updated));
  }
  return updated;
}

// TODO(backend): replace with real API call (PUT /api/merchant/feed/read-all)
export function markAllUpdatesAsRead(currentFeed?: FeedUpdate[]): FeedUpdate[] {
  const list = currentFeed || getFeed();
  const updated = list.map((u) => ({ ...u, isRead: true }));
  if (typeof window !== 'undefined') {
    localStorage.setItem('tawreed_merchant_feed', JSON.stringify(updated));
  }
  return updated;
}

// TODO(backend): replace with real API call (GET /api/merchant/orders)
export function getMerchantOrders(): MerchantOrder[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tawreed_merchant_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse merchant orders from localStorage', e);
      }
    }
  }
  return INITIAL_ORDERS;
}

// TODO(backend): replace with real API call (POST /api/merchant/orders)
export function placeMerchantOrder(
  order: Omit<MerchantOrder, 'id' | 'orderNumber' | 'date'>,
  currentOrders?: MerchantOrder[]
): MerchantOrder {
  const existing = currentOrders || getMerchantOrders();
  const newOrder: MerchantOrder = {
    ...order,
    id: 'ord-' + Date.now(),
    orderNumber: `TWR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
  };

  const updated = [newOrder, ...existing];
  if (typeof window !== 'undefined') {
    localStorage.setItem('tawreed_merchant_orders', JSON.stringify(updated));
  }
  console.log('[MockAPI] Placed merchant order locally:', newOrder);
  return newOrder;
}

// TODO(backend): replace with real API call (GET /api/merchant/profile)
export function getMerchantProfile(): MerchantProfile {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tawreed_merchant_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse merchant profile from localStorage', e);
      }
    }
  }
  return INITIAL_MERCHANT_PROFILE;
}

// TODO(backend): replace with real API call (PUT /api/merchant/profile)
export function saveMerchantProfile(profile: MerchantProfile): MerchantProfile {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tawreed_merchant_profile', JSON.stringify(profile));
  }
  console.log('[MockAPI] Saved merchant profile locally:', profile);
  return profile;
}
