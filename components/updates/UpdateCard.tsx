'use client';

import React from 'react';
import {
  Package,
  Tag,
  TrendingDown,
  Megaphone,
  Users,
  Eye,
  Calendar,
  Clock,
  Edit3,
  Trash2,
  RotateCw,
  CheckCircle2,
} from 'lucide-react';
import { SupplierUpdate, UpdateType } from '@/types/updates';

interface UpdateCardProps {
  update: SupplierUpdate;
  onEdit: (update: SupplierUpdate) => void;
  onDelete: (id: string, title: string) => void;
  onResend: (id: string) => void;
}

const TYPE_CONFIG: Record<
  UpdateType,
  { label: string; icon: any; badge: string; border: string }
> = {
  new_product: {
    label: 'منتج جديد',
    icon: Package,
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    border: 'border-emerald-200',
  },
  offer: {
    label: 'عرض خاص',
    icon: Tag,
    badge: 'bg-rose-50 text-rose-800 border-rose-200',
    border: 'border-rose-200',
  },
  price_change: {
    label: 'تعديل سعر',
    icon: TrendingDown,
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    border: 'border-amber-200',
  },
  announcement: {
    label: 'تنويه وإعلان',
    icon: Megaphone,
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
    border: 'border-blue-200',
  },
};

export function UpdateCard({
  update,
  onEdit,
  onDelete,
  onResend,
}: UpdateCardProps) {
  const config = TYPE_CONFIG[update.type] || TYPE_CONFIG.announcement;
  const Icon = config.icon;

  const isScheduled = update.status === 'scheduled';
  const viewPercent =
    update.reachCount > 0 ? Math.min(100, Math.round((update.viewsCount / update.reachCount) * 100)) : 0;

  return (
    <div className="group rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md space-y-3.5">
      {/* Top Banner: Type Badge + Status + Actions */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${config.badge}`}>
            <Icon className="h-3.5 w-3.5" />
            <span>{config.label}</span>
          </span>

          {isScheduled ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-[10px] font-bold text-purple-700">
              <Clock className="h-3 w-3" />
              <span>مجدول للنشر</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              <span>منشور</span>
            </span>
          )}
        </div>

        {/* Date */}
        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {new Date(update.publishedAt).toLocaleDateString('ar-EG', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="space-y-1.5">
        <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-snug">
          {update.title}
        </h3>
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {update.description}
        </p>

        {/* Extra pill summary for types */}
        {update.type === 'new_product' && update.productName && (
          <div className="pt-1 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <span>المنتج: {update.productName}</span>
            {update.price && <span>• السعر: {update.price} ج.م</span>}
          </div>
        )}

        {update.type === 'offer' && update.discountPercentage && (
          <div className="pt-1 text-xs font-semibold text-rose-800">
            خصم: {update.discountPercentage}% {update.endDate && `(حتى ${update.endDate})`}
          </div>
        )}

        {update.type === 'price_change' && update.oldPrice && update.newPrice && (
          <div className="pt-1 text-xs font-semibold text-amber-850 flex items-center gap-2">
            <span>تعديل من: {update.oldPrice} ج.م</span>
            <span>إلى: {update.newPrice} ج.م</span>
          </div>
        )}
      </div>

      {/* Stats Progress Bar: Reach & Views */}
      <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-gray-600 flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <span>وصل إلى: <strong className="text-gray-900">{update.reachCount}</strong> عميل</span>
          </span>

          <span className="text-gray-600 flex items-center gap-1">
            <Eye className="h-3.5 w-3.5 text-slate-400" />
            <span>شاهده: <strong className="text-emerald-700">{update.viewsCount}</strong> تاجر ({viewPercent}%)</span>
          </span>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
            style={{ width: `${viewPercent}%` }}
          />
        </div>
      </div>

      {/* Actions Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="text-[11px] text-gray-400">
          الجمهور: {update.audience.type === 'all' ? 'جميع العملاء المربوطين' : 'فئة محددة'}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(update)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-slate-700 hover:bg-slate-50 font-bold transition-colors cursor-pointer"
          >
            <Edit3 className="h-3 w-3 text-slate-400" />
            <span>تعديل</span>
          </button>

          {!isScheduled && (
            <button
              type="button"
              onClick={() => onResend(update.id)}
              className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50/70 text-blue-700 hover:bg-blue-100 px-2.5 py-1 font-bold transition-colors cursor-pointer"
              title="إعادة إرسال التحديث الآن للعملاء"
            >
              <RotateCw className="h-3 w-3" />
              <span>إعادة نشر</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(update.id, update.title)}
            className="rounded-lg p-1 text-red-400 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
            title="حذف التحديث"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
