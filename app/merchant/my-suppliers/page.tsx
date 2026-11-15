'use client';

import React from 'react';
import Link from 'next/link';
import {
  Link2,
  Building2,
  Package,
  Bell,
  ChevronLeft,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { useMerchant } from '@/context/MerchantContext';
import { LinkButton } from '@/components/merchant/LinkButton';
import { EmptyState } from '@/components/common/EmptyState';

export default function MySuppliersPage() {
  const { linkedSuppliers, feed } = useMerchant();

  // Helper to get unread updates per supplier
  const getSupplierUnreadCount = (supplierId: string) => {
    return feed.filter((u) => u.supplierId === supplierId && !u.isRead).length;
  };

  const getSupplierLastUpdate = (supplierId: string) => {
    const sFeed = feed.filter((u) => u.supplierId === supplierId);
    return sFeed.length > 0 ? sFeed[0].publishedAt : 'لا يوجد مؤخراً';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-black text-gray-900">شركاتي المربوطة</h1>
            <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
              {linkedSuppliers.length} شركة نشطة
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            قائمة الشركات والمصانع المعتمدة المربوطة بحساب متجرك لتوريد البضائع
          </p>
        </div>

        <Link
          href="/merchant/suppliers"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f2d4a] hover:bg-blue-900 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors self-start sm:self-auto"
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>إضافة شركة جديدة</span>
        </Link>
      </div>

      {/* Linked Suppliers List */}
      {linkedSuppliers.length === 0 ? (
        <EmptyState
          icon={Link2}
          title="لا توجد شركات مربوطة حالياً"
          description="قم بالربط مع الشركات والمصانع لتصفح أسعار الجملة، استقبال التحديثات الفورية، وإرسال طلبيات الشحن المباشرة."
          actionText="تصفح دليل الشركات للربط"
          onAction={() => {
            window.location.href = '/merchant/suppliers';
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {linkedSuppliers.map((supplier) => {
            const unreadCount = getSupplierUnreadCount(supplier.id);
            const lastUpdate = getSupplierLastUpdate(supplier.id);

            return (
              <div
                key={supplier.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all"
              >
                <div>
                  {/* Top info */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0f2d4a] text-white font-black text-base shadow-xs">
                        {supplier.logo.charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <Link
                          href={`/merchant/suppliers/${supplier.id}`}
                          className="text-xs sm:text-sm font-bold text-gray-900 hover:text-blue-700 transition-colors truncate block"
                        >
                          {supplier.name}
                        </Link>

                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="rounded-md bg-purple-50 px-1.5 py-0.2 text-[10px] font-bold text-purple-700">
                            {supplier.category}
                          </span>

                          {unreadCount > 0 && (
                            <span className="flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 px-2 py-0.2 text-[10px] font-bold">
                              <Bell className="h-3 w-3" />
                              <span>{unreadCount} جديد</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary row */}
                  <div className="grid grid-cols-2 gap-2 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">تاريخ الربط:</span>
                      <span className="font-semibold text-gray-800">
                        {supplier.linkedAt || 'منذ فترة'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">آخر تحديث:</span>
                      <span className="font-semibold text-gray-800 truncate block">
                        {lastUpdate}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {supplier.description}
                  </p>
                </div>

                {/* Footer buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/merchant/suppliers/${supplier.id}`}
                    className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-[#0f2d4a] hover:bg-blue-900 text-white py-2 px-3 text-xs font-bold shadow-xs transition-colors"
                  >
                    <Package className="h-3.5 w-3.5" />
                    <span>عرض المنتجات والأسعار</span>
                  </Link>

                  <LinkButton supplier={supplier} compact />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
