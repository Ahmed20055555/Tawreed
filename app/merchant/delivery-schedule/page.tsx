'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Truck,
  Calendar,
  Clock,
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  ShoppingCart,
  BellRing,
  Filter,
} from 'lucide-react';
import { DELIVERY_ROUTES } from '@/data/merchant-extra-mock';
import { DeliveryRoute } from '@/types/merchant-extra';
import { useMerchant } from '@/context/MerchantContext';

export default function DeliverySchedulePage() {
  const { profile } = useMerchant();
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [subscribedSupplier, setSubscribedSupplier] = useState<string | null>(null);

  const daysList = ['all', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

  const filteredRoutes = useMemo(() => {
    if (selectedDay === 'all') return DELIVERY_ROUTES;
    return DELIVERY_ROUTES.filter((route) =>
      route.days.some((d) => d.includes(selectedDay)) || route.days.includes('يومياً ما عدا الجمعة')
    );
  }, [selectedDay]);

  const handleSubscribe = (supplierName: string) => {
    setSubscribedSupplier(supplierName);
    setTimeout(() => setSubscribedSupplier(null), 3000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0f2d4a] via-[#163e66] to-[#0f2d4a] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1 rounded-full text-xs font-bold">
              <Truck className="w-3.5 h-3.5" />
              <span>متابعة خطوط سير سيارات المصانع</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              مواعيد سيارات التوريد بمنطقتك 🚚
            </h1>
            <p className="text-slate-200 text-sm sm:text-base max-w-2xl leading-relaxed">
              اعرف بالضبط متى ستصل سيارة كل مصنع وشركة إلى محلك في{' '}
              <span className="font-bold text-amber-300">
                {profile?.area || 'شبين'}، {profile?.governorate || 'الإسماعيلية'}
              </span>
              ، واطلب قبل موعد إغلاق الشحنة لتصلك بضاعتك في أول خط سير!
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center w-full md:w-auto">
              <div className="text-xs text-slate-300 font-medium">السيارات القادمة غداً:</div>
              <div className="text-2xl font-black text-amber-300 mt-0.5">3 سيارات توريد</div>
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold">
              سيارة ألبان النيل خرجت في خط السير الصباحي وميعاد تسليم محلك غداً 07:30 صباحاً
            </span>
          </div>

          <span className="text-slate-300">تحديث أوتوماتيكي عبر نظام GPS التوريد</span>
        </div>
      </div>

      {/* Days Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 ml-2">
          <Filter className="w-3.5 h-3.5" />
          <span>تصفية حسب اليوم:</span>
        </span>
        {daysList.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedDay === day
                ? 'bg-[#0f2d4a] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {day === 'all' ? 'جميع الأيام' : day}
          </button>
        ))}
      </div>

      {/* Route Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRoutes.map((route) => {
          const isDeparted = route.status === 'departed';
          const isSubscribed = subscribedSupplier === route.supplierName;

          return (
            <div
              key={route.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-4 sm:p-6 flex flex-col justify-between space-y-4 sm:space-y-5"
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-700 text-xs sm:text-sm border border-slate-200">
                      {route.supplierLogo || 'شركة'}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                        {route.supplierName}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400" />
                        <span>{route.area}</span>
                      </div>
                    </div>
                  </div>

                  {isDeparted ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                      سيارة في الطريق
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-blue-200">
                      <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      مجدول
                    </span>
                  )}
                </div>

                {/* Next Delivery Arrival Window */}
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs">
                    <span className="text-slate-500 font-medium">موعد وصول السيارة:</span>
                    <span className="font-bold text-[#0f2d4a]">{route.nextDeliveryDate}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] sm:text-xs">
                    <span className="text-slate-500 font-medium">آخر ميعاد للطلب:</span>
                    <span className="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                      حتى {route.cutoffTime} م
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] sm:text-xs pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500 font-medium">أيام التوزيع:</span>
                    <span className="font-semibold text-slate-700">
                      {route.days.join(' • ')}
                    </span>
                  </div>
                </div>

                {/* Driver Info & Direct Contact */}
                {route.driverName && (
                  <div className="mt-3 flex items-center justify-between text-[11px] sm:text-xs px-1">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold">{route.driverName}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${route.driverPhone}`}
                        className="inline-flex items-center gap-1 text-slate-600 hover:text-emerald-700 font-bold bg-slate-100 hover:bg-emerald-50 px-2 py-0.5 rounded-lg transition-colors text-[10px] sm:text-xs"
                      >
                        <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>اتصال</span>
                      </a>
                      <a
                        href={`https://wa.me/20${route.driverPhone?.replace(/^0/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg transition-colors text-[10px] sm:text-xs"
                      >
                        <MessageCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>واتساب</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleSubscribe(route.supplierName)}
                  className={`text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl flex items-center gap-1 transition-all cursor-pointer ${
                    isSubscribed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <BellRing className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{isSubscribed ? 'تم التنبيه' : 'نبّهني'}</span>
                </button>

                <Link
                  href={`/merchant/suppliers/${route.supplierId}`}
                  className="bg-[#0f2d4a] hover:bg-blue-900 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-xs flex items-center gap-1 transition-all"
                >
                  <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>اطلب الآن</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guarantee & Assistance Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              ضمان التوصيل حتى باب المحل وفحص البضاعة
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              سائق التوريد يساعدك في تفريغ الكراتين بالمحل، ولك كامل الحق في فحص تاريخ الإنتاج والصلاحية قبل توقيع إذن الاستلام وسداد الفاتورة.
            </p>
          </div>
        </div>

        <Link
          href="/merchant/suppliers"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-3 rounded-2xl shadow-md shrink-0 flex items-center gap-2"
        >
          <span>تصفح كل شركات التوريد</span>
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
