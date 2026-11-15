'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Package,
  Users,
  ShieldCheck,
  Star,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';
import { Supplier } from '@/types/merchant';
import { LinkButton } from './LinkButton';

interface SupplierCardProps {
  supplier: Supplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0f2d4a] text-white font-black text-base shadow-xs">
              {supplier.logo.charAt(0)}
            </div>

            <div className="min-w-0">
              <Link
                href={`/merchant/suppliers/${supplier.id}`}
                className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors truncate block"
              >
                {supplier.name}
              </Link>

              <div className="flex items-center gap-2 mt-0.5">
                <span className="rounded-md bg-purple-50 px-1.5 py-0.2 text-[10px] font-bold text-purple-700">
                  {supplier.category}
                </span>

                {supplier.rating && (
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{supplier.rating}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
          {supplier.description}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center mb-3">
          <div>
            <span className="text-[9px] text-slate-400 block">المنتجات</span>
            <span className="text-xs font-black text-gray-900">{supplier.productsCount}</span>
          </div>

          <div>
            <span className="text-[9px] text-slate-400 block">التجار المربوطين</span>
            <span className="text-xs font-black text-[#0f2d4a]">{supplier.linkedMerchantsCount}</span>
          </div>

          <div>
            <span className="text-[9px] text-slate-400 block">حد أدنى للطلب</span>
            <span className="text-[11px] font-black text-emerald-700">{supplier.minOrderValue} ج</span>
          </div>
        </div>

        {/* Delivery Areas Chips */}
        <div className="mb-4">
          <span className="text-[10px] font-semibold text-slate-400 block mb-1.5 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-slate-400" />
            <span>مناطق التوريد:</span>
          </span>

          <div className="flex flex-wrap gap-1">
            {supplier.deliveryAreas.slice(0, 4).map((area) => (
              <span
                key={area}
                className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
              >
                {area}
              </span>
            ))}
            {supplier.deliveryAreas.length > 4 && (
              <span className="rounded-lg bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-400">
                +{supplier.deliveryAreas.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          href={`/merchant/suppliers/${supplier.id}`}
          className="text-xs font-bold text-[#0f2d4a] hover:text-blue-700 flex items-center gap-1 py-1"
        >
          <span>تصفح الكتالوج</span>
          <ChevronLeft className="h-3.5 w-3.5" />
        </Link>

        <LinkButton supplier={supplier} compact />
      </div>
    </div>
  );
}
