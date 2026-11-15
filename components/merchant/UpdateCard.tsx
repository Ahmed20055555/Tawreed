'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Flame,
  TrendingDown,
  TrendingUp,
  Megaphone,
  Check,
  ShoppingCart,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { FeedUpdate } from '@/types/merchant';
import { useMerchant } from '@/context/MerchantContext';

interface UpdateCardProps {
  update: FeedUpdate;
}

export function UpdateCard({ update }: UpdateCardProps) {
  const { markRead, addToCart, suppliers } = useMerchant();

  const targetSupplier = suppliers.find((s) => s.id === update.supplierId);

  const typeConfig = {
    new_product: {
      label: 'منتج جديد',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Sparkles,
      iconColor: 'text-blue-600',
    },
    offer: {
      label: 'عرض وخصم',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Flame,
      iconColor: 'text-amber-600',
    },
    price_change: {
      label: 'تحديث سعر',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: TrendingDown,
      iconColor: 'text-emerald-600',
    },
    announcement: {
      label: 'إعلان عام',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Megaphone,
      iconColor: 'text-purple-600',
    },
  }[update.type];

  const Icon = typeConfig.icon;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (update.productDetails && targetSupplier) {
      addToCart(
        {
          id: update.productDetails.productId || 'p-' + Date.now(),
          supplierId: update.supplierId,
          name: update.productDetails.productName,
          category: 'منتج عام',
          unit: update.productDetails.unit,
          price: update.productDetails.price,
          minOrder: 1,
          inStock: true,
        },
        targetSupplier,
        1
      );
    }
  };

  return (
    <article
      onClick={() => !update.isRead && markRead(update.id)}
      className={`group relative overflow-hidden rounded-2xl border transition-all hover:shadow-md p-3 sm:p-5 bg-white ${
        !update.isRead
          ? 'border-blue-200 shadow-xs ring-1 ring-blue-100'
          : 'border-slate-200/90 shadow-2xs'
      }`}
    >
      {/* Top Supplier & Meta Header */}
      <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href={`/merchant/suppliers/${update.supplierId}`}
            onClick={(e) => e.stopPropagation()}
            className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[#0f2d4a] text-white font-bold text-xs sm:text-sm shadow-xs hover:opacity-90 transition-opacity"
          >
            {update.supplierLogo.charAt(0)}
          </Link>

          <div className="min-w-0">
            <Link
              href={`/merchant/suppliers/${update.supplierId}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs sm:text-sm font-bold text-gray-900 hover:text-blue-700 transition-colors truncate block"
            >
              {update.supplierName}
            </Link>

            <div className="flex items-center gap-1 text-[9px] sm:text-xs text-slate-400 mt-0.5">
              <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span>{update.publishedAt}</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1 shrink-0">
          {!update.isRead && (
            <span className="flex items-center gap-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold text-white shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span>جديد</span>
            </span>
          )}

          <span
            className={`flex items-center gap-1 rounded-md sm:rounded-lg border px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold ${typeConfig.badgeClass}`}
          >
            <Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span>{typeConfig.label}</span>
          </span>
        </div>
      </div>

      {/* Main Title & Description */}
      <div className="space-y-1 mb-2.5">
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
          {update.title}
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
          {update.description}
        </p>
      </div>

      {/* Type Specific Payloads */}
      {/* 1. New Product payload */}
      {update.type === 'new_product' && update.productDetails && (
        <div className="mt-2.5 rounded-xl bg-blue-50/70 border border-blue-100 p-2.5 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-white border border-blue-100 text-blue-700 font-black text-[10px] sm:text-xs shadow-2xs">
              صورة
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900">
                {update.productDetails.productName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 text-[10px] sm:text-[11px] text-slate-600">
                <span className="font-black text-[#0f2d4a]">
                  {update.productDetails.price.toLocaleString()} ج.م
                </span>
                <span>/</span>
                <span className="text-slate-500">{update.productDetails.unit}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-1 rounded-lg sm:rounded-xl bg-[#0f2d4a] hover:bg-blue-900 px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-white shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>أضف للسلة</span>
          </button>
        </div>
      )}

      {/* 2. Offer payload */}
      {update.type === 'offer' && update.offerDetails && (
        <div className="mt-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200 p-2.5 sm:p-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-amber-500 text-white font-black text-xs sm:text-sm shadow-xs">
              %{update.offerDetails.discountPercentage}
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-amber-900">
                {update.offerDetails.badgeText || `خصم فوري ${update.offerDetails.discountPercentage}%`}
              </p>
              <p className="text-[10px] sm:text-[11px] text-amber-700 font-medium">
                {update.offerDetails.validUntil}
              </p>
            </div>
          </div>

          <Link
            href={`/merchant/suppliers/${update.supplierId}`}
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg sm:rounded-xl bg-amber-600 hover:bg-amber-700 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold text-white shadow-xs transition-colors"
          >
            تصفح العرض
          </Link>
        </div>
      )}

      {/* 3. Price Change payload */}
      {update.type === 'price_change' && update.priceChangeDetails && (
        <div className="mt-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 p-2.5 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-xs sm:text-sm font-bold text-gray-900">
              {update.priceChangeDetails.productName}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                {update.priceChangeDetails.oldPrice.toLocaleString()} ج
              </span>
              <span className="text-xs sm:text-sm font-black text-emerald-700">
                {update.priceChangeDetails.newPrice.toLocaleString()} ج.م
              </span>
              <span className="rounded-md bg-emerald-100 px-1 py-0.2 text-[9px] font-bold text-emerald-800 flex items-center gap-0.5">
                <TrendingDown className="h-2.5 w-2.5" />
                <span>{Math.abs(update.priceChangeDetails.percentChange)}%</span>
              </span>
            </div>
          </div>

          <Link
            href={`/merchant/suppliers/${update.supplierId}`}
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg sm:rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold text-emerald-800 transition-colors text-center self-start sm:self-auto"
          >
            الطلب بالسعر الجديد
          </Link>
        </div>
      )}

      {/* Footer Actions */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <Link
          href={`/merchant/suppliers/${update.supplierId}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[10px] sm:text-xs font-bold text-[#0f2d4a] hover:text-blue-700 flex items-center gap-1"
        >
          <span>كتالوج {update.supplierName}</span>
          <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 rotate-180" />
        </Link>

        {!update.isRead ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              markRead(update.id);
            }}
            className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <Check className="h-3 w-3 text-emerald-600" />
            <span>تحديد كمقروء</span>
          </button>
        ) : (
          <span className="text-[9px] sm:text-[10px] text-slate-400">تم الاطلاع ✓</span>
        )}
      </div>
    </article>
  );
}
