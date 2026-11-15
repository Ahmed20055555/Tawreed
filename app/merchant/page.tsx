'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  ShoppingCart,
  Package,
  Wallet,
  Zap,
  TrendingDown,
  Truck,
  Flame,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  Plus,
  Check,
  Ticket,
  Copy,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useMerchant } from '@/context/MerchantContext';

export default function MerchantHomePage() {
  const { profile, linkedSuppliers, cartCount, stats, orders, addToCart, showToast } = useMerchant();

  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [basketAdded, setBasketAdded] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const latestOrder = orders.length > 0 ? orders[0] : null;

  // 1. Core Fast-Selling Commodities for direct price comparison
  const priceComparisonItems = [
    {
      id: 'prod-101',
      name: 'شيبسي عائلي بالجبنة (كرتونة 24 كيس)',
      factoryPrice: 210,
      marketPrice: 235,
      saving: 25,
      unit: 'كرتونة 24 كيس',
      supplierId: 'sup-1',
      supplierName: 'شركة الأهرام',
    },
    {
      id: 'prod-501',
      name: 'زيت ذرة ممتاز الشرق 800 مل (كرتونة 12 زجاجة)',
      factoryPrice: 790,
      marketPrice: 840,
      saving: 50,
      unit: 'كرتونة 12 زجاجة',
      supplierId: 'sup-5',
      supplierName: 'مصانع الشرق',
    },
    {
      id: 'prod-103',
      name: 'أرز الأهرام عريض فاخر (بالتة 10 أكياس 1 كجم)',
      factoryPrice: 310,
      marketPrice: 335,
      saving: 25,
      unit: 'بالتة 10 أكياس',
      supplierId: 'sup-1',
      supplierName: 'شركة الأهرام',
    },
  ];

  // Quick 4 navigation services
  const quickServices = [
    {
      title: 'النواقص السريعة',
      desc: 'باقات البقالة والألبان الأكثر سحباً، تنزل في سلتك بنقرة واحدة.',
      href: '/merchant/smart-restock',
      icon: Zap,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50',
      badge: 'وفّر وقتك',
    },
    {
      title: 'بورصة الأسعار',
      desc: 'مؤشر أسعار الزيت والسكر والأرز يومياً، وأرخص سعر مصنع.',
      href: '/merchant/market-prices',
      icon: TrendingDown,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      badge: 'مؤشر حي',
    },
    {
      title: 'العروض والخصومات',
      desc: 'صفقات البونص والكرتونة الهدية وخصومات المصانع المباشرة.',
      href: '/merchant/offers',
      icon: Flame,
      iconColor: 'text-rose-500',
      bgColor: 'bg-rose-50',
      badge: 'تخفيضات',
    },
    {
      title: 'الشركات والمصانع',
      desc: 'تصفح كتالوجات كبرى مصانع الأغذية واربط معهم للشراء بالجملة.',
      href: '/merchant/suppliers',
      icon: Building2,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      badge: 'دليل الجملة',
    },
  ];

  // Add individual item to cart
  const handleAddItem = (item: (typeof priceComparisonItems)[0]) => {
    addToCart(
      {
        id: item.id,
        supplierId: item.supplierId,
        name: item.name,
        category: 'بقالة أساسية',
        unit: item.unit,
        price: item.factoryPrice,
        minOrder: 1,
        inStock: true,
      },
      { id: item.supplierId, name: item.supplierName } as any,
      1
    );

    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 2500);
  };

  // Add the 3-carton restock basket all at once
  const handleAddQuickBasket = () => {
    priceComparisonItems.forEach((item) => {
      addToCart(
        {
          id: item.id,
          supplierId: item.supplierId,
          name: item.name,
          category: 'بقالة أساسية',
          unit: item.unit,
          price: item.factoryPrice,
          minOrder: 1,
          inStock: true,
        },
        { id: item.supplierId, name: item.supplierName } as any,
        1
      );
    });

    setBasketAdded(true);
    showToast('تمت إضافة الـ 3 أصناف إلى سلتك ووفرت 100 ج.م فوري! 🛒');
    setTimeout(() => setBasketAdded(false), 3000);
  };

  const handleCopyCoupon = () => {
    navigator.clipboard?.writeText('TAWREED100');
    setCopiedCoupon(true);
    showToast('تم نسخ كود الخصم TAWREED100 بنجاح!');
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* 1. Four Clean Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Linked Suppliers */}
        <Link
          href="/merchant/my-suppliers"
          className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500">شركات مربوطة</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 mt-1">
            {linkedSuppliers.length}{' '}
            <span className="text-[10px] sm:text-xs font-normal text-slate-400">شركات</span>
          </div>
          <span className="text-[10px] text-blue-700 font-semibold mt-1 flex items-center gap-0.5">
            <span>عرض شركاتي</span>
            <ChevronLeft className="w-3 h-3" />
          </span>
        </Link>

        {/* Cart items */}
        <Link
          href="/merchant/cart"
          className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-emerald-300 transition-all block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500">سلة الطلب</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 mt-1">
            {cartCount}{' '}
            <span className="text-[10px] sm:text-xs font-normal text-slate-400">أصناف</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-0.5">
            <span>مراجعة السلة</span>
            <ChevronLeft className="w-3 h-3" />
          </span>
        </Link>

        {/* Pending Orders */}
        <Link
          href="/merchant/orders"
          className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-amber-300 transition-all block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500">طلبيات جارية</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 mt-1">
            {stats.pendingOrdersCount}{' '}
            <span className="text-[10px] sm:text-xs font-normal text-slate-400">طلبية</span>
          </div>
          <span className="text-[10px] text-amber-800 font-semibold mt-1 flex items-center gap-0.5">
            <span>متابعة الشحن</span>
            <ChevronLeft className="w-3 h-3" />
          </span>
        </Link>

        {/* Cashback Balance */}
        <Link
          href="/merchant/rewards"
          className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-purple-300 transition-all block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500">رصيد الكاش باك</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 mt-1">
            1,480{' '}
            <span className="text-[10px] sm:text-xs font-normal text-slate-400">ج.م</span>
          </div>
          <span className="text-[10px] text-purple-700 font-semibold mt-1 flex items-center gap-0.5">
            <span>فتح المحفظة</span>
            <ChevronLeft className="w-3 h-3" />
          </span>
        </Link>
      </div>

      {/* 2. REAL SAVINGS SECTION: شوف وفرك الحقيقي في الكرتونة */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                💰
              </span>
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                وفرك المباشر في الكرتونة مقارنة بسوق الجملة
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              أسعار المصانع المباشرة على توريد مقارنة بأسعار سيارات الجملة العادية
            </p>
          </div>

          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto">
            متوسط توفيرك: 15% إلى 20%
          </span>
        </div>

        {/* 3 Price comparison items */}
        <div className="space-y-2.5">
          {priceComparisonItems.map((item) => {
            const isAdded = !!addedItems[item.id];

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {item.name}
                  </h3>
                  <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                    {item.supplierName} • {item.unit}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                  {/* Prices comparison */}
                  <div className="text-right">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm sm:text-base font-black text-emerald-700 font-mono">
                        {item.factoryPrice} ج.م
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {item.marketPrice} ج
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 block">
                      وفر {item.saving} ج.م في الكرتونة
                    </span>
                  </div>

                  {/* Add button */}
                  <button
                    type="button"
                    onClick={() => handleAddItem(item)}
                    className={`flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#0f2d4a] hover:bg-blue-900 text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>تمت الإضافة</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>أضف كرتونة</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 1-Click Fast Restock Basket CTA */}
        <div className="pt-2">
          <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent rounded-2xl p-4 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>طلبية النواقص السريعة لمحلك (شيبسي + زيت + أرز)</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                إجمالي الـ 3 أصناف معاً: <strong className="text-slate-900">1,310 ج.م فقط</strong> (بتوفر 100 ج.م دفعة واحدة)
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddQuickBasket}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                basketAdded
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {basketAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تمت إضافة الـ 3 كراتين للسلة!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>أضف الـ 3 كراتين دفعة واحدة للسلة</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. WELCOME VOUCHER: كوبون 100 ج.م فوري */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-2xl sm:rounded-3xl border border-dashed border-amber-300 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-amber-950">
                كوبون خصم 100 ج.م فوري لمحلك 🎁
              </h3>
              <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                عرض نشط
              </span>
            </div>
            <p className="text-xs text-amber-800 mt-0.5">
              ينزل خصم فوري من إجمالي فاتورة مشترياتك القادمة عند تجاوز 2,500 ج.م
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <span className="font-mono font-black text-sm bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-[#0f2d4a]">
            TAWREED100
          </span>
          <button
            type="button"
            onClick={handleCopyCoupon}
            className="bg-[#0f2d4a] hover:bg-blue-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            {copiedCoupon ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>تم النسخ</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ الكود</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4. FOUR EASY SERVICES */}
      <div className="space-y-3">
        <h2 className="text-xs sm:text-sm font-black text-slate-800">
          خدمات السوبر ماركت الأساسية
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {quickServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <Link
                key={srv.title}
                href={srv.href}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex items-start gap-3 group"
              >
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${srv.bgColor} ${srv.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {srv.title}
                    </h3>
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {srv.badge}
                    </span>
                  </div>

                  <p className="text-[10px] sm:text-xs text-slate-500 mt-1 leading-snug">
                    {srv.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 5. FOUR STORE OWNER GUARANTEES: ليه تطلب من توريد وأنت مطمن؟ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">توصيل لباب المحل</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
              عربية المصنع بتفرغ بضاعتك جوة المحل مجاناً لطلبات الجملة
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">معاينة قبل الدفع</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
              افحص تواريخ الصلاحية والكراتين كاملة قبل ما تسدد الفاتورة
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">الدفع كاش للمندوب</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
              مش محتاج تدفع أونلاين — سلم الفلوس كاش عند وصول البضاعة
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">استبدال فوري للتالف</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
              أي صنف فيه مشكلة بيستبدل في الحال في الفاتورة الرسمية
            </p>
          </div>
        </div>
      </div>

      {/* 6. Active Order Snippet (If exists) */}
      {latestOrder && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  آخر طلبية قيد التوصيل: {latestOrder.orderNumber}
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  في الطريق
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                المورد: {latestOrder.supplierName} • الإجمالي: {latestOrder.total.toLocaleString()} ج.م • التسليم المتوقع: غداً صباحاً
              </p>
            </div>
          </div>

          <Link
            href="/merchant/orders"
            className="text-xs font-bold text-[#0f2d4a] hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto bg-slate-100 px-3 py-1.5 rounded-xl"
          >
            <span>تفاصيل الطلب</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
