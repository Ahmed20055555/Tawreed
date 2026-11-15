'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Sparkles,
  Clock,
  ShoppingCart,
  Check,
  TrendingDown,
  Building2,
  Filter,
  ArrowRight,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { useMerchant } from '@/context/MerchantContext';

export default function MerchantOffersPage() {
  const { suppliers, addToCart } = useMerchant();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const deals = [
    {
      id: 'deal-1',
      supplierId: 'sup-1',
      supplierName: 'شركة الأهرام للصناعات الغذائية',
      title: 'بونص كرتونة شيبسي هدية',
      description: 'اطلب 5 كراتين شيبسي عائلي 75 جم واحصل على كرتونة إضافية مجاناً فوراً.',
      discount: 'كرتونة هدية مجاناً',
      savingEstimate: 'وفر 210 ج.م فوري',
      endsIn: 'ينتهي خلال 18 ساعة',
      price: 210,
      unit: 'كرتونة 24 كيس',
      productName: 'شيبسي عائلي بطعم الجبنة المتبلة',
      badge: 'عرض بونص',
    },
    {
      id: 'deal-2',
      supplierId: 'sup-2',
      supplierName: 'شركة النيل للألبان والجبن',
      title: 'خصم كاش 12% على الجبنة الفيتا',
      description: 'سعر ترويجي حصري لمتاجر التجزئة لتنشيط سحب وجبات الفطور والعشاء.',
      discount: 'خصم 12%',
      savingEstimate: 'وفر 80 ج.م لكل كرتونة',
      endsIn: 'ينتهي اليوم 10:00 م',
      price: 600,
      oldPrice: 680,
      unit: 'كرتونة 24 علبة (500 جم)',
      productName: 'جبنة بيضاء فيتا تتراباك',
      badge: 'خصم كاش',
    },
    {
      id: 'deal-3',
      supplierId: 'sup-3',
      supplierName: 'مجموعة البركة للمنظفات',
      title: 'تخفيض سعر مسحوق الغسيل الأوتوماتيك',
      description: 'تخفيض مباشر من المصنع على كرتونة 4 أكياس سوبر لافندر معطر.',
      discount: 'وفر 40 ج.م',
      savingEstimate: 'هامش ربح إضافي 15%',
      endsIn: 'صالح لمدة 48 ساعة',
      price: 490,
      oldPrice: 530,
      unit: 'كرتونة 4 أكياس (2.5 كجم)',
      productName: 'مسحوق غسيل أوتوماتيك لافندر',
      badge: 'سعر مصنع مخفض',
    },
    {
      id: 'deal-4',
      supplierId: 'sup-4',
      supplierName: 'شركة الفيروز للمشروبات',
      title: 'عرض كرتونة عصير مانجو طبيعي',
      description: 'خصم 15 ج.م عند طلب أكثر من 3 كراتين عصير طبيعي بدون مواد حافظة.',
      discount: 'خصم فوري',
      savingEstimate: 'وفر 15 ج.م للكرتونة',
      endsIn: 'باقي 3 أيام',
      price: 195,
      oldPrice: 210,
      unit: 'كرتونة 27 علبة (200 مل)',
      productName: 'عصير تفاح طبيعي الفيروز',
      badge: 'سحب سريع',
    },
  ];

  const handleAddToCart = (deal: (typeof deals)[0]) => {
    const sup = suppliers.find((s) => s.id === deal.supplierId) || {
      id: deal.supplierId,
      name: deal.supplierName,
    };

    addToCart(
      {
        id: deal.id,
        supplierId: deal.supplierId,
        name: deal.productName,
        category: 'عروض حصرية',
        unit: deal.unit,
        price: deal.price,
        minOrder: 1,
        inStock: true,
      },
      sup as any,
      1
    );

    setAddedIds((prev) => ({ ...prev, [deal.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [deal.id]: false }));
    }, 2500);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0f2d4a] via-[#1a446c] to-[#0f2d4a] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold">
            <Flame className="w-3.5 h-3.5" />
            <span>عروض خاصة بمحلك وسعر المصنع</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black">
            العروض والصفقات الحصرية 🔥
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
            جميع الخصومات والبونص والصفقات الحارقة من المصانع والشركات المربوطة معك في صفحة واحدة مخصصة.
          </p>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {deals.map((deal) => {
          const isAdded = !!addedIds[deal.id];

          return (
            <div
              key={deal.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    {deal.badge}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>{deal.endsIn}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900">{deal.productName}</h3>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>{deal.supplierName}</span>
                    <span>•</span>
                    <span>{deal.unit}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-xl border border-slate-100">
                  {deal.description}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base sm:text-lg font-black text-gray-900 font-mono">
                        {deal.price} ج.م
                      </span>
                      {deal.oldPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {deal.oldPrice} ج
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold block">
                      {deal.savingEstimate}
                    </span>
                  </div>

                  <span className="bg-emerald-50 text-emerald-800 font-black text-xs px-2.5 py-1 rounded-lg border border-emerald-200">
                    {deal.discount}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/merchant/suppliers/${deal.supplierId}`}
                  className="text-xs font-bold text-[#0f2d4a] hover:text-blue-700 flex items-center gap-1"
                >
                  <span>عرض منتجات الشركة</span>
                  <ArrowRight className="w-3 h-3 rotate-180" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleAddToCart(deal)}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#0f2d4a] hover:bg-blue-900 text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>تمت الإضافة!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>أضف للسلة</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
