'use client';

import React from 'react';
import {
  Sparkles,
  Tag,
  Package,
  TrendingDown,
  Megaphone,
  Calendar,
  Building2,
  Percent,
} from 'lucide-react';
import { UpdateType } from '@/types/updates';

interface UpdatePreviewProps {
  type: UpdateType;
  title: string;
  description: string;
  imageUrl?: string;
  productName?: string;
  price?: number;
  unit?: string;
  discountPercentage?: number;
  startDate?: string;
  endDate?: string;
  oldPrice?: number;
  newPrice?: number;
  companyName?: string;
}

const TYPE_CONFIG = {
  new_product: {
    label: 'منتج جديد',
    bg: 'bg-emerald-600',
    lightBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: Package,
  },
  offer: {
    label: 'عرض خاص',
    bg: 'bg-rose-600',
    lightBg: 'bg-rose-50 text-rose-800 border-rose-200',
    icon: Tag,
  },
  price_change: {
    label: 'تعديل سعر',
    bg: 'bg-amber-600',
    lightBg: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: TrendingDown,
  },
  announcement: {
    label: 'تنويه وإعلان',
    bg: 'bg-blue-600',
    lightBg: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: Megaphone,
  },
};

export function UpdatePreview({
  type,
  title,
  description,
  imageUrl,
  productName,
  price,
  unit,
  discountPercentage,
  startDate,
  endDate,
  oldPrice,
  newPrice,
  companyName = 'شركة الأهرام للصناعات الغذائية',
}: UpdatePreviewProps) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.announcement;
  const Icon = config.icon;

  // Price change calculation
  const priceChangePct = (() => {
    if (oldPrice && newPrice && oldPrice > 0) {
      return Math.round(((newPrice - oldPrice) / oldPrice) * 100);
    }
    return 0;
  })();

  return (
    <div className="w-full max-w-sm mx-auto rounded-3xl border-2 border-slate-800 bg-white shadow-xl overflow-hidden text-right font-sans">
      {/* Mobile Top Bar mockup */}
      <div className="bg-slate-900 px-4 py-2 flex items-center justify-between text-[11px] text-slate-300 border-b border-slate-800">
        <span className="font-mono">9:41</span>
        <span className="text-[10px] text-slate-400">معاينة كما يراها التاجر</span>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>متصل</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3.5 space-y-3 bg-slate-50/50">
        {/* Supplier Header */}
        <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0f2d4a] text-white font-bold text-xs">
              {companyName.charAt(0)}
            </div>
            <div className="min-w-0">
              <h5 className="font-bold text-xs text-gray-900 truncate">{companyName}</h5>
              <span className="text-[10px] text-gray-400">تحديث مباشر عبر المنصة</span>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${config.lightBg}`}>
            <Icon className="h-3 w-3" />
            <span>{config.label}</span>
          </span>
        </div>

        {/* Post Image Preview */}
        {imageUrl ? (
          <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
            <img src={imageUrl} alt="Update Preview" className="h-full w-full object-cover" />
          </div>
        ) : null}

        {/* Update Main Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2.5">
          <h4 className="font-bold text-sm text-gray-900 leading-snug">
            {title || 'عنوان التحديث سيظهر هنا...'}
          </h4>

          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
            {description || 'تفاصيل الإعلان أو العرض الجديد ستظهر هنا للتجار المربوطين...'}
          </p>

          {/* Type-specific highlight blocks */}
          {type === 'new_product' && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-emerald-800 font-medium block">الصنف الجديد:</span>
                <strong className="text-emerald-950 font-bold">{productName || 'اسم المنتج'}</strong>
                {unit && <span className="text-[10px] text-emerald-700 block mt-0.5">({unit})</span>}
              </div>
              <div className="text-left">
                <span className="text-[10px] text-emerald-800 font-medium block">سعر الجملة:</span>
                <span className="text-base font-black text-emerald-700">
                  {price ? `${price} ج.م` : 'قريباً'}
                </span>
              </div>
            </div>
          )}

          {type === 'offer' && (
            <div className="rounded-xl bg-rose-50 border border-rose-100 p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white font-black text-sm">
                  %{discountPercentage || 0}
                </div>
                <div>
                  <span className="font-bold text-rose-950 block">خصم حصري</span>
                  <span className="text-[10px] text-rose-700">
                    {startDate && endDate ? `من ${startDate} إلى ${endDate}` : 'لفترة محدودة'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {type === 'price_change' && (
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-2.5 text-xs space-y-1">
              <div className="font-bold text-amber-950">{productName || 'اسم الصنف'}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-gray-400 line-through text-[11px]">{oldPrice || 0} ج.م</span>
                <span className="text-base font-black text-amber-900">{newPrice || 0} ج.م</span>
                {priceChangePct !== 0 && (
                  <span
                    className={`rounded-md px-1.5 py-0.2 text-[10px] font-bold ${
                      priceChangePct < 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {priceChangePct < 0 ? `تخفيض ${Math.abs(priceChangePct)}%` : `زيادة ${priceChangePct}%`}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer simulation */}
        <div className="text-center text-[10px] text-gray-400 py-1">
          تم الإرسال لجميع التجار المربوطين عبر منصة توريد
        </div>
      </div>
    </div>
  );
}
