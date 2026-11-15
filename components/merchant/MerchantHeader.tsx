'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { useMerchant } from '@/context/MerchantContext';
import { NotificationBell } from './NotificationBell';
import { SidebarNav } from './SidebarNav';

interface MerchantHeaderProps {
  title?: string;
  subtitle?: string;
}

export function MerchantHeader({ title, subtitle }: MerchantHeaderProps) {
  const { cartCount, toast } = useMerchant();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <>
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-slate-900/95 backdrop-blur-md px-4 py-2.5 text-xs sm:text-sm text-white shadow-2xl animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toast}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3">
          {/* Logo & Mobile Drawer Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              aria-label="فتح القائمة"
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
            >
              <Menu className="h-5 w-5 text-[#0f2d4a]" />
            </button>

            <Link href="/merchant" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#0f2d4a] text-white shadow-xs font-black text-sm sm:text-base">
                ت
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-base font-black tracking-tight text-[#0f2d4a] leading-none">
                  توريد
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
                  بوابة التاجر
                </span>
              </div>
            </Link>

            {title && (
              <>
                <span className="hidden md:inline-block h-4 w-[1px] bg-slate-200" />
                <div className="hidden md:flex flex-col">
                  <h1 className="text-xs font-bold text-gray-900 leading-tight">{title}</h1>
                  {subtitle && <p className="text-[10px] text-slate-400 truncate max-w-xs">{subtitle}</p>}
                </div>
              </>
            )}
          </div>

          {/* Quick Actions (Cart & Notification Bell) */}
          <div className="flex items-center gap-2">
            <Link
              href="/merchant/cart"
              className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
              aria-label="سلة الطلب"
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-[#0f2d4a]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] sm:h-5 sm:min-w-[20px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[9px] sm:text-[10px] font-black text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            <NotificationBell />
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Drawer */}
      <SidebarNav
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        isMobileDrawer
      />
    </>
  );
}
