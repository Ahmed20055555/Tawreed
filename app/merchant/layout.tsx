import React from 'react';
import { MerchantProvider } from '@/context/MerchantContext';
import { MerchantHeader } from '@/components/merchant/MerchantHeader';
import { SidebarNav, MobileBottomBar } from '@/components/merchant/SidebarNav';

export const metadata = {
  title: 'توريد | بوابة التاجر',
  description: 'منصة ربط تجار التجزئة والسوبر ماركت بكبرى الشركات والمصانع في مصر',
};

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return (
    <MerchantProvider>
      <div className="min-h-screen bg-slate-100/70 font-sans text-gray-900 flex flex-col pb-16 lg:pb-0" dir="rtl">
        <MerchantHeader />

        <div className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 py-2.5 sm:py-6">
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            <SidebarNav />
            <main className="flex-1 w-full min-w-0">{children}</main>
          </div>
        </div>

        <MobileBottomBar />
      </div>
    </MerchantProvider>
  );
}
