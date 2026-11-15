'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Building2,
  Link2,
  ShoppingCart,
  Package,
  Settings,
  Store,
  MapPin,
  ChevronLeft,
  X,
  Flame,
  TrendingDown,
  Zap,
  Award,
} from 'lucide-react';
import { useMerchant } from '@/context/MerchantContext';

interface SidebarNavProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobileDrawer?: boolean;
}

export function SidebarNav({ isOpen, onClose, isMobileDrawer = false }: SidebarNavProps) {
  const pathname = usePathname();
  const { profile, linkedSuppliers, cartCount, stats } = useMerchant();

  const mainFeatures = [
    {
      label: 'الرئيسية',
      href: '/merchant',
      icon: Home,
      exact: true,
      badge: stats.unreadUpdatesCount > 0 ? stats.unreadUpdatesCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      label: 'بورصة الأسعار',
      href: '/merchant/market-prices',
      icon: TrendingDown,
      exact: true,
      badge: 'مؤشر',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      label: 'النواقص السريعة',
      href: '/merchant/smart-restock',
      icon: Zap,
      exact: true,
      badge: 'وفّر وقت',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      label: 'سوق التصفية',
      href: '/merchant/clearance',
      icon: Flame,
      exact: true,
      badge: 'خصومات',
      badgeColor: 'bg-purple-100 text-purple-700',
    },
    {
      label: 'المحفظة والمكافآت',
      href: '/merchant/rewards',
      icon: Award,
      exact: true,
      badge: 'VIP',
      badgeColor: 'bg-amber-100 text-amber-800 font-black',
    },
  ];

  const managementItems = [
    {
      label: 'الشركات',
      href: '/merchant/suppliers',
      icon: Building2,
      exact: false,
    },
    {
      label: 'شركاتي',
      href: '/merchant/my-suppliers',
      icon: Link2,
      exact: true,
      counter: linkedSuppliers.length,
      counterColor: 'bg-blue-100 text-blue-800',
    },
    {
      label: 'سلة الطلب',
      href: '/merchant/cart',
      icon: ShoppingCart,
      exact: true,
      counter: cartCount,
      counterColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      label: 'طلباتي',
      href: '/merchant/orders',
      icon: Package,
      exact: true,
      counter: stats.pendingOrdersCount > 0 ? stats.pendingOrdersCount : undefined,
      counterColor: 'bg-amber-100 text-amber-800',
    },
    {
      label: 'تعديل الحساب',
      href: '/merchant/settings',
      icon: Settings,
      exact: true,
    },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const content = (
    <div className="flex flex-col h-full justify-between bg-white">
      <div>
        {/* Store / Merchant Header Profile */}
        <div className="p-4 border-b border-slate-100">
          {isMobileDrawer && (
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <span className="text-xs font-black text-[#0f2d4a]">بوابة التاجر</span>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div
              suppressHydrationWarning
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0f2d4a] text-white font-black text-base shadow-xs"
            >
              {profile?.avatar || profile?.storeName?.charAt(0) || 'ت'}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2
                  suppressHydrationWarning
                  className="text-xs sm:text-sm font-black text-gray-900 truncate"
                >
                  {profile?.storeName || 'سوبر ماركت'}
                </h2>
              </div>

              <div
                suppressHydrationWarning
                className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 truncate"
              >
                <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                <span className="truncate">{profile?.area || 'شبين'}، {profile?.governorate || 'الإسماعيلية'}</span>
              </div>

              <div className="mt-1 flex items-center gap-1.5">
                <span
                  suppressHydrationWarning
                  className="inline-block rounded-md bg-purple-50 px-1.5 py-0.2 text-[9px] font-bold text-purple-700"
                >
                  {profile?.storeType || 'سوبر ماركت'}
                </span>
                <span className="inline-block rounded-md bg-amber-50 px-1.5 py-0.2 text-[9px] font-bold text-amber-700">
                  تاجر VIP 🌟
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Main Smart Features */}
        <nav className="p-3 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider block mb-1">
            خدمات السوبر ماركت الذكية
          </span>

          {mainFeatures.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#0f2d4a] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#0f2d4a]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 ${
                      active ? 'text-white' : 'text-slate-400 group-hover:text-[#0f2d4a]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                        active ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Section 2: Management & Orders */}
        <div className="px-3 pt-2">
          <div className="border-t border-slate-100 pt-3">
            <span className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider block mb-1">
              إدارة التوريد والطلبات
            </span>

            <div className="space-y-1">
              {managementItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.exact);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-[#0f2d4a] text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#0f2d4a]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`h-4 w-4 ${
                          active ? 'text-white' : 'text-slate-400 group-hover:text-[#0f2d4a]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.counter !== undefined && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            active ? 'bg-white/20 text-white' : item.counterColor
                          }`}
                        >
                          {item.counter}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 m-2 rounded-xl text-center">
        <p className="text-[10px] font-bold text-slate-600">منصة توريد للتجار والموردين</p>
        <p className="text-[9px] text-slate-400 mt-0.5">تسوق بالجملة من المصانع مباشرة</p>
      </div>
    </div>
  );

  if (isMobileDrawer) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        />

        {/* Drawer panel */}
        <aside className="fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-2xl border-l border-slate-200 transform transition-transform duration-300 ease-in-out">
          {content}
        </aside>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <aside className="hidden lg:block w-64 shrink-0 rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
      {content}
    </aside>
  );
}

// Mobile bottom bar for quick thumb navigation
export function MobileBottomBar() {
  const pathname = usePathname();
  const { cartCount, linkedSuppliers, stats } = useMerchant();

  const items = [
    {
      label: 'الرئيسية',
      href: '/merchant',
      icon: Home,
      exact: true,
      badge: stats.unreadUpdatesCount > 0 ? stats.unreadUpdatesCount : undefined,
    },
    {
      label: 'بورصة الأسعار',
      href: '/merchant/market-prices',
      icon: TrendingDown,
      exact: true,
    },
    {
      label: 'النواقص',
      href: '/merchant/smart-restock',
      icon: Zap,
      exact: true,
    },
    {
      label: 'السلة',
      href: '/merchant/cart',
      icon: ShoppingCart,
      exact: true,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      label: 'المكافآت',
      href: '/merchant/rewards',
      icon: Award,
      exact: true,
    },
  ];

  return (
    <nav
      aria-label="شريط التنقل السفلي"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 lg:hidden flex items-center justify-around shadow-lg"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              active ? 'text-[#0f2d4a] font-bold' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <div className="relative">
              <Icon className={`h-5 w-5 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {item.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-black text-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
