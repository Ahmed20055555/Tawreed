'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  MerchantProfile,
  Supplier,
  SupplierProduct,
  FeedUpdate,
  CartItem,
  MerchantOrder,
  MerchantStats,
} from '@/types/merchant';
import {
  getMerchantProfile,
  saveMerchantProfile,
  getSuppliers,
  linkSupplier,
  unlinkSupplier,
  getFeed,
  markUpdateAsRead,
  markAllUpdatesAsRead,
  getMerchantOrders,
  placeMerchantOrder,
} from '@/lib/mock-api';

interface MerchantContextType {
  profile: MerchantProfile;
  updateProfile: (profile: MerchantProfile) => void;
  suppliers: Supplier[];
  linkedSuppliers: Supplier[];
  isLinked: (supplierIdOrSlug: string) => boolean;
  link: (supplierId: string) => void;
  unlink: (supplierId: string) => void;
  feed: FeedUpdate[];
  markRead: (updateId: string) => void;
  markAllRead: () => void;
  unreadCount: number;
  cart: CartItem[];
  addToCart: (product: SupplierProduct, supplier: Supplier, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCartForSupplier: (supplierId: string) => void;
  cartCount: number;
  orders: MerchantOrder[];
  submitOrder: (supplierId: string, notes?: string) => Promise<MerchantOrder | null>;
  reorder: (order: MerchantOrder) => void;
  stats: MerchantStats;
  toast: string | null;
  showToast: (msg: string) => void;
}

const MerchantContext = createContext<MerchantContextType | undefined>(undefined);

export function MerchantProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<MerchantProfile>(getMerchantProfile());
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [feed, setFeed] = useState<FeedUpdate[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<MerchantOrder[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // Initialize from storage or mock
  useEffect(() => {
    setProfileState(getMerchantProfile());
    setSuppliers(getSuppliers());
    setFeed(getFeed());
    setOrders(getMerchantOrders());

    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('tawreed_merchant_cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Sync cart to storage
  const syncCart = (newCart: CartItem[]) => {
    setCart(newCart);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tawreed_merchant_cart', JSON.stringify(newCart));
    }
  };

  // Profile
  const updateProfile = (newProfile: MerchantProfile) => {
    setProfileState(newProfile);
    saveMerchantProfile(newProfile);
    showToast('تم حفظ بيانات الحساب بنجاح');
  };

  // Link/Unlink
  const isLinked = (supplierIdOrSlug: string) => {
    const s = suppliers.find((x) => x.id === supplierIdOrSlug || x.slug === supplierIdOrSlug);
    return s?.isLinked ?? false;
  };

  const link = (supplierId: string) => {
    const updated = linkSupplier(supplierId, suppliers);
    setSuppliers(updated);
    const target = updated.find((s) => s.id === supplierId || s.slug === supplierId);
    showToast(`تم الربط مع ${target?.name || 'الشركة'} بنجاح!`);
  };

  const unlink = (supplierId: string) => {
    const target = suppliers.find((s) => s.id === supplierId || s.slug === supplierId);
    const updated = unlinkSupplier(supplierId, suppliers);
    setSuppliers(updated);
    showToast(`تم إلغاء الربط مع ${target?.name || 'الشركة'}`);
  };

  const linkedSuppliers = useMemo(() => {
    return suppliers.filter((s) => s.isLinked);
  }, [suppliers]);

  // Feed Updates
  const markRead = (updateId: string) => {
    const updated = markUpdateAsRead(updateId, feed);
    setFeed(updated);
  };

  const markAllRead = () => {
    const updated = markAllUpdatesAsRead(feed);
    setFeed(updated);
    showToast('تم تحديد جميع التحديثات كمقروءة');
  };

  const unreadCount = useMemo(() => {
    // only count unread updates from linked suppliers
    const linkedIds = new Set(linkedSuppliers.map((s) => s.id));
    return feed.filter((u) => !u.isRead && linkedIds.has(u.supplierId)).length;
  }, [feed, linkedSuppliers]);

  // Cart
  const addToCart = (product: SupplierProduct, supplier: Supplier, quantity = 1) => {
    const qtyToAdd = Math.max(product.minOrder, quantity);
    const existingIndex = cart.findIndex((item) => item.productId === product.id);

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += qtyToAdd;
    } else {
      updatedCart = [
        ...cart,
        {
          productId: product.id,
          supplierId: supplier.id,
          supplierName: supplier.name,
          name: product.name,
          unit: product.unit,
          price: product.price,
          quantity: qtyToAdd,
          minOrder: product.minOrder,
        },
      ];
    }
    syncCart(updatedCart);
    showToast(`تمت إضافة "${product.name}" إلى سلة الطلب`);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updatedCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    syncCart(updatedCart);
  };

  const removeFromCart = (productId: string) => {
    const target = cart.find((i) => i.productId === productId);
    const updatedCart = cart.filter((item) => item.productId !== productId);
    syncCart(updatedCart);
    if (target) {
      showToast(`تم حذف "${target.name}" من السلة`);
    }
  };

  const clearCartForSupplier = (supplierId: string) => {
    const updatedCart = cart.filter((item) => item.supplierId !== supplierId);
    syncCart(updatedCart);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Orders
  const submitOrder = async (supplierId: string, notes?: string): Promise<MerchantOrder | null> => {
    const supplierItems = cart.filter((item) => item.supplierId === supplierId);
    if (supplierItems.length === 0) return null;

    const targetSupplier = suppliers.find((s) => s.id === supplierId);
    const subtotal = supplierItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const newOrder = placeMerchantOrder(
      {
        supplierId,
        supplierName: targetSupplier?.name || supplierItems[0].supplierName,
        supplierLogo: targetSupplier?.logo || 'شركة',
        total: subtotal,
        status: 'pending',
        deliveryArea: `${profile.area}، ${profile.governorate}`,
        deliveryAddress: profile.address,
        notes: notes || '',
        items: supplierItems.map((i) => ({
          productId: i.productId,
          name: i.name,
          unit: i.unit,
          price: i.price,
          quantity: i.quantity,
        })),
      },
      orders
    );

    // update state
    setOrders([newOrder, ...orders]);
    clearCartForSupplier(supplierId);
    showToast(`تم إرسال الطلب بنجاح برقم ${newOrder.orderNumber}`);
    return newOrder;
  };

  const reorder = (order: MerchantOrder) => {
    const targetSupplier = suppliers.find((s) => s.id === order.supplierId);
    if (!targetSupplier) {
      showToast('الشركة غير متاحة حالياً');
      return;
    }

    let updatedCart = [...cart];
    order.items.forEach((item) => {
      const existing = updatedCart.find((c) => c.productId === item.productId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        updatedCart.push({
          productId: item.productId,
          supplierId: order.supplierId,
          supplierName: order.supplierName,
          name: item.name,
          unit: item.unit,
          price: item.price,
          quantity: item.quantity,
          minOrder: 1,
        });
      }
    });

    syncCart(updatedCart);
    showToast(`تمت إضافة منتجات الطلب (${order.orderNumber}) إلى السلة`);
  };

  // Stats
  const stats: MerchantStats = useMemo(() => {
    const activeOffers = feed.filter((u) => u.type === 'offer' && isLinked(u.supplierId)).length;
    const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'shipping').length;

    return {
      linkedSuppliersCount: linkedSuppliers.length,
      unreadUpdatesCount: unreadCount,
      activeOffersCount: activeOffers,
      pendingOrdersCount: pendingOrders,
    };
  }, [linkedSuppliers, unreadCount, feed, orders]);

  return (
    <MerchantContext.Provider
      value={{
        profile,
        updateProfile,
        suppliers,
        linkedSuppliers,
        isLinked,
        link,
        unlink,
        feed,
        markRead,
        markAllRead,
        unreadCount,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCartForSupplier,
        cartCount,
        orders,
        submitOrder,
        reorder,
        stats,
        toast,
        showToast,
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
}

export function useMerchant() {
  const context = useContext(MerchantContext);
  if (!context) {
    throw new Error('useMerchant must be used within a MerchantProvider');
  }
  return context;
}
