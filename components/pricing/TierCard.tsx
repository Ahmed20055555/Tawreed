'use client';

import React from 'react';
import { Layers, Users, ShoppingCart, Edit3, Trash2, ShieldCheck, Tag } from 'lucide-react';
import { PriceTier, TierColor } from '@/types/pricing';

interface TierCardProps {
  tier: PriceTier;
  merchantsCount: number;
  onEdit: (tier: PriceTier) => void;
  onDelete: (tierId: string, tierName: string) => void;
}

const COLOR_STYLES: Record<TierColor, { bg: string; border: string; text: string; badge: string; dot: string }> = {
  blue: {
    bg: 'bg-blue-50/70',
    border: 'border-blue-200',
    text: 'text-blue-900',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    dot: 'bg-blue-600',
  },
  emerald: {
    bg: 'bg-emerald-50/70',
    border: 'border-emerald-200',
    text: 'text-emerald-900',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-600',
  },
  purple: {
    bg: 'bg-purple-50/70',
    border: 'border-purple-200',
    text: 'text-purple-900',
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
    dot: 'bg-purple-600',
  },
  amber: {
    bg: 'bg-amber-50/70',
    border: 'border-amber-200',
    text: 'text-amber-900',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    dot: 'bg-amber-600',
  },
  rose: {
    bg: 'bg-rose-50/70',
    border: 'border-rose-200',
    text: 'text-rose-900',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    dot: 'bg-rose-600',
  },
  indigo: {
    bg: 'bg-indigo-50/70',
    border: 'border-indigo-200',
    text: 'text-indigo-900',
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    dot: 'bg-indigo-600',
  },
};

export function TierCard({
  tier,
  merchantsCount,
  onEdit,
  onDelete,
}: TierCardProps) {
  const scheme = COLOR_STYLES[tier.colorTag] || COLOR_STYLES.blue;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border ${scheme.border} bg-white p-4 sm:p-5 shadow-xs transition-all hover:shadow-md`}
    >
      <div>
        {/* Header with color dot and tag */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${scheme.dot} ring-4 ring-slate-100`} />
            <h3 className="text-base sm:text-lg font-bold text-gray-900">{tier.name}</h3>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] sm:text-xs font-bold ${scheme.badge}`}
          >
            <Tag className="h-3 w-3" />
            <span>شريحة سعرية</span>
          </span>
        </div>

        {/* Description */}
        {tier.description && (
          <p className="text-xs text-gray-600 leading-relaxed mb-4 min-h-[36px]">
            {tier.description}
          </p>
        )}

        {/* Stat metrics */}
        <div className="grid grid-cols-2 gap-2.5 rounded-xl bg-slate-50 p-3 border border-slate-100 mb-4">
          <div className="space-y-0.5">
            <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500 flex items-center gap-1">
              <Users className="h-3 w-3 text-slate-400" />
              <span>المحلات المسكنة:</span>
            </span>
            <div className="text-sm sm:text-base font-black text-gray-900">
              {merchantsCount} <span className="text-[10px] font-normal text-gray-500">محل</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500 flex items-center gap-1">
              <ShoppingCart className="h-3 w-3 text-slate-400" />
              <span>الحد الأدنى للطلب:</span>
            </span>
            <div className="text-sm sm:text-base font-black text-emerald-700">
              {tier.minOrderValue ? `${tier.minOrderValue.toLocaleString()} ج.م` : 'بدون حد'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onEdit(tier)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <Edit3 className="h-3.5 w-3.5 text-slate-500" />
          <span>تعديل الشريحة</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete(tier.id, tier.name)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50/60 py-2 px-3 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
          title="حذف الشريحة"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden xs:inline">حذف</span>
        </button>
      </div>
    </div>
  );
}
