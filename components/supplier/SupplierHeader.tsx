'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package,
  Store,
  ShoppingCart,
  Percent,
  Menu,
  X,
  Flame,
  Radar,
  ArrowRight,
  LogOut,
  Building2,
  ExternalLink,
  Layers,
  Users,
  Megaphone,
} from 'lucide-react';
import { getClients } from '@/lib/mock-api';

interface SupplierHeaderProps {
  title?: string;
  subtitle?: string;
}

export function SupplierHeader({ title, subtitle }: SupplierHeaderProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [companyName, setCompanyName] = useState('شركة الأهرام للصناعات الغذائية');
  const [governorate, setGovernorate] = useState('الإسماعيلية');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tawreed_company_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.companyName) setCompanyName(parsed.companyName);
          if (parsed.governorate) setGovernorate(parsed.governorate);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const clientsCount = typeof window !== 'undefined' ? getClients().length : 12;

  const navLinks = [
    {
      label: 'الرئيسية والمنتجات',
      href: '/dashboard/company',
      icon: Package,
      active: pathname === '/dashboard/company',
    },
    {
      label: 'المحلات والتجار',
      href: '/dashboard/company',
      icon: Store,
      active: false,
    },
    {
      label: 'عملائي',
      href: '/supplier/clients',
      icon: Users,
      active: pathname.startsWith('/supplier/clients'),
      isNew: true,
      badgeText: 'جديد',
      countBadge: clientsCount,
    },
    {
      label: 'النشر للعملاء',
      href: '/supplier/updates',
      icon: Megaphone,
      active: pathname.startsWith('/supplier/updates'),
      isNew: true,
      badgeText: 'جديد',
    },
    {
      label: 'سوق التصفية',
      href: '/supplier/clearance',
      icon: Flame,
      active: pathname.startsWith('/supplier/clearance'),
      isNew: true,
      badgeText: 'جديد',
    },
    {
      label: 'رادار المحلات',
      href: '/supplier/radar',
      icon: Radar,
      active: pathname.startsWith('/supplier/radar'),
      isNew: true,
      badgeText: 'جديد',
    },
    {
      label: 'سوق التصفية (واجهة التاجر)',
      href: '/merchant/clearance',
      icon: ExternalLink,
      active: pathname.startsWith('/merchant/clearance'),
      isExternal: true,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/dashboard/company" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#0f2d4a] text-white shadow-xs font-black text-sm sm:text-base">
                ت
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-base font-black tracking-tight text-[#0f2d4a] leading-none">
                  توريد
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
                  بوابة الموردين
                </span>
              </div>
            </Link>

            <span className="hidden md:inline-block h-4 w-[1px] bg-slate-200" />

            <div className="hidden xs:flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] sm:text-xs">
              <Building2 className="h-3.5 w-3.5 text-[#0f2d4a]" />
              <span className="font-bold text-gray-800 truncate max-w-[140px] sm:max-w-none">
                {companyName}
              </span>
              <span className="text-slate-400">({governorate})</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/company"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              <span>لوحة التحكم الرئيسية</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#0f2d4a]/10 hover:bg-[#0f2d4a] hover:text-white text-[#0f2d4a] px-3 py-1.5 text-xs font-bold transition-all cursor-pointer"
            >
              <Menu className="h-4 w-4" />
              <span>القائمة الجانبية</span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-over Side Drawer Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        />
      )}

      {/* Slide-over Side Drawer */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 sm:w-80 bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0f2d4a] text-white font-black text-xs">
                ت
              </div>
              <span className="text-xs font-black text-[#0f2d4a]">بوابة الموردين</span>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Company Brief */}
          <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f2d4a] text-white font-bold text-xs">
              {companyName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold text-gray-900 truncate">{companyName}</h3>
              <p className="text-[10px] text-slate-400">{governorate} • حساب مورد موثق</p>
            </div>
          </div>

          {/* Navigation Links list */}
          <nav className="p-3 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider block mb-1">
              الأقسام والخدمات
            </span>
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    item.active
                      ? 'bg-[#0f2d4a] text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-[#0f2d4a]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${item.active ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.isNew && (
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          item.active ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {item.badgeText}
                      </span>
                    )}

                    {'countBadge' in item && item.countBadge !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          item.active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.countBadge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <Link
            href="/dashboard/company"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-white border border-slate-200 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span>العودة للوحة الرئيسية</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
