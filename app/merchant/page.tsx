'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Building2,
  Bell,
  Flame,
  Package,
  Filter,
  CheckCircle2,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Megaphone,
  Store,
  Layers,
  Wallet,
  Zap,
  ShieldCheck,
  Truck,
  Award,
  ArrowRight,
  ShoppingCart,
  Plus,
  Clock,
  MapPin,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useMerchant } from '@/context/MerchantContext';
import { StatCard } from '@/components/clearance/StatCard';
import { UpdateCard } from '@/components/merchant/UpdateCard';
import { EmptyState } from '@/components/common/EmptyState';
import { SupplierProduct } from '@/types/merchant';

export default function MerchantHomePage() {
  const {
    feed,
    linkedSuppliers,
    suppliers,
    stats,
    markAllRead,
    addToCart,
    profile,
    showToast,
  } = useMerchant();

  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);
  const [quickOrderAdded, setQuickOrderAdded] = useState(false);

  // Filter feed: Only show updates from linked suppliers
  const linkedSupplierIds = useMemo(
    () => new Set(linkedSuppliers.map((s) => s.id)),
    [linkedSuppliers]
  );

  const filteredUpdates = useMemo(() => {
    return feed.filter((item) => {
      if (!linkedSupplierIds.has(item.supplierId)) return false;
      if (selectedSupplierId !== 'all' && item.supplierId !== selectedSupplierId) return false;
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      if (unreadOnly && item.isRead) return false;
      return true;
    });
  }, [feed, linkedSupplierIds, selectedSupplierId, selectedType, unreadOnly]);

  const typeTabs: { id: string; label: string; icon?: React.ElementType }[] = [
    { id: 'all', label: 'الكل' },
    { id: 'offer', label: 'عروض وخصومات', icon: Flame },
    { id: 'new_product', label: 'منتجات جديدة', icon: Sparkles },
    { id: 'price_change', label: 'تغيير أسعار', icon: TrendingDown },
    { id: 'announcement', label: 'إعلانات', icon: Megaphone },
  ];

  // Hot Flash Deals (Curated high-margin deals for supermarkets)
  const flashDeals = [
    {
      id: 'deal-1',
      supplierId: 'sup-1',
      supplierName: 'شركة الأهرام',
      title: 'بونص كرتونة شيبسي هدية',
      description: 'اطلب 5 كراتين شيبسي عائلي واحصل على كرتونة مجاناً فوراً',
      discount: 'كرتونة مجاناً',
      savingEstimate: '210 ج.م وفر مباشر',
      endsIn: 'ينتهي بعد 18 ساعة',
      price: 210,
      unit: 'كرتونة 24 كيس',
      productName: 'شيبسي عائلي بالجبنة المتبلة',
    },
    {
      id: 'deal-2',
      supplierId: 'sup-2',
      supplierName: 'شركة النيل للألبان',
      title: 'خصم كاش 12% على الجبنة الفيتا',
      description: 'سعر ترويجي لمتاجر التجزئة لتنشيط مبيعات الفطور',
      discount: 'خصم 12%',
      savingEstimate: '80 ج.م وفر لكل كرتونة',
      endsIn: 'ينتهي اليوم 10 مساءً',
      price: 600,
      oldPrice: 680,
      unit: 'كرتونة 24 علبة',
      productName: 'جبنة بيضاء فيتا تتراباك 500 جم',
    },
    {
      id: 'deal-3',
      supplierId: 'sup-3',
      supplierName: 'البركة للمنظفات',
      title: 'عرض مسحوق الغسيل الأوتوماتيك',
      description: 'تخفيض سعر المصنع المباشر لكرتونة 4 أكياس سوبر لافندر',
      discount: 'وفر 40 ج.م',
      savingEstimate: 'هامش ربح إضافي 15%',
      endsIn: 'باقي يومين',
      price: 490,
      oldPrice: 530,
      unit: 'كرتونة 4 أكياس',
      productName: 'مسحوق غسيل أوتوماتيك لافندر 2.5 كجم',
    },
  ];

  // Top fast-selling items in the merchant's area
  const trendingAreaProducts = [
    {
      id: 'trend-1',
      name: 'شيبسي عائلي بالجبنة المتبلة',
      category: 'مقرمشات وشيبسي',
      price: 210,
      unit: 'كرتونة 24 كيس',
      supplierId: 'sup-1',
      demandNote: 'طلبته 54 بقالة وسوبر ماركت في منطقتك هذا الأسبوع',
      margin: 'هامش ربحك 30%',
    },
    {
      id: 'trend-2',
      name: 'حليب النيل كامل الدسم UHT (1 لتر)',
      category: 'حليب وألبان',
      price: 430,
      unit: 'كرتونة 12 علبة',
      supplierId: 'sup-2',
      demandNote: 'أعلى معدل سحب يومي للمنازل في منطقتك',
      margin: 'هامش ربحك 22%',
    },
    {
      id: 'trend-3',
      name: 'مكرونة الأهرام قلم فاخرة (400 جم)',
      category: 'مكرونة ودقيق',
      price: 240,
      unit: 'كرتونة 20 كيس',
      supplierId: 'sup-1',
      demandNote: 'صنف أساسي سريع الدوران بالمحلات',
      margin: 'هامش ربحك 25%',
    },
    {
      id: 'trend-4',
      name: 'سائل غسيل الأطباق بالليمون (1 لتر)',
      category: 'منظفات مطبخ',
      price: 260,
      unit: 'كرتونة 12 زجاجة',
      supplierId: 'sup-3',
      demandNote: 'طلبته 38 بقالة في الشيخ زايد هذا الشهر',
      margin: 'هامش ربحك 28%',
    },
  ];

  // Quick 1-Click Restock Basket handler
  const handleQuickRestockAll = () => {
    trendingAreaProducts.forEach((item) => {
      const sup = suppliers.find((s) => s.id === item.supplierId);
      if (sup) {
        addToCart(
          {
            id: item.id,
            supplierId: item.supplierId,
            name: item.name,
            category: item.category,
            unit: item.unit,
            price: item.price,
            minOrder: 1,
            inStock: true,
          },
          sup,
          1
        );
      }
    });
    setQuickOrderAdded(true);
    showToast('تمت إضافة كرتونة من كل صنف أساسي إلى سلتك بنجاح! 🛒');
    setTimeout(() => setQuickOrderAdded(false), 4000);
  };

  const handleAddSingleDeal = (deal: (typeof flashDeals)[0]) => {
    const sup = suppliers.find((s) => s.id === deal.supplierId);
    if (sup) {
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
        sup,
        1
      );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ========================================================
          1. HERO SAVINGS & BUYING POWER BANNER
          يقنع التاجر فوراً بحجم الوفر المالي وهامش ربحه
         ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2d4a] via-[#143a5e] to-[#0a1e32] p-5 sm:p-7 text-white shadow-lg border border-[#1e4870]">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Value Proposition */}
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-emerald-300 border border-white/15">
              <Zap className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
              <span>وفرك المالي هذا الشهر مع توريد</span>
              <span className="text-white/60">•</span>
              <span>سعر المصنع بدون وسطاء</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
                وفرت حوالي <span className="text-emerald-400 underline decoration-emerald-500/40 font-mono">4,850 ج.م</span> في طلبياتك هذا الشهر!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                مرحباً يا <strong className="text-white">{profile.ownerName || 'ريس'}</strong> ({profile.storeName})! الشراء المباشر من مصانع وشركات توريد يوفر عليك متوسط <strong className="text-emerald-300">14% إلى 22%</strong> مقارنة بأسعار سيارات الجملة والوسطاء في السوق.
              </p>
            </div>

            {/* Quick Micro-Trust badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-emerald-400" />
                <span>توصيل مجاني لباب المحل</span>
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>استبدال فوري للتالف</span>
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-emerald-400" />
                <span>الدفع بعد المعاينة والفاتورة</span>
              </span>
            </div>
          </div>

          {/* Quick Action Widget / Gold Tier Badge */}
          <div className="shrink-0 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-5 flex flex-col justify-between space-y-3 min-w-[240px]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-300 block">رتبة متجرك</span>
                  <span className="text-xs font-bold text-amber-300">تاجر ذهبي معتمد</span>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                نشط ✓
              </span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>خصم إضافي قادم:</span>
                <span className="font-bold text-emerald-300">2% كاش باك</span>
              </div>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 w-3/4 rounded-full" />
              </div>
              <span className="text-[10px] text-slate-400 block text-right">
                اطلب بـ 1,820 ج.م إضافية لتحصل على هدية بونص مجانية
              </span>
            </div>

            <Link
              href="/merchant/suppliers"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-2.5 px-3 text-xs shadow-md transition-all text-center"
            >
              <span>تصفح كبرى المصانع والشركات</span>
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. 4 STAT CARDS
         ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <StatCard
          title="شركات مربوطة"
          value={`${stats.linkedSuppliersCount} شركة`}
          subtitle="تستقبل أسعارها الحية"
          icon={Building2}
          colorScheme="blue"
        />

        <StatCard
          title="تحديثات وعروض"
          value={`${stats.unreadUpdatesCount} جديد`}
          subtitle="تخفيضات لم تقرأها بعد"
          icon={Bell}
          colorScheme="purple"
          badge={stats.unreadUpdatesCount > 0 ? 'تنبيه مهم' : undefined}
        />

        <StatCard
          title="عروض وبونص متاح"
          value={`${stats.activeOffersCount} صفقات`}
          subtitle="كرتونة هدية وخصومات"
          icon={Flame}
          colorScheme="amber"
        />

        <StatCard
          title="طلبيات جارية"
          value={`${stats.pendingOrdersCount} طلبيات`}
          subtitle="سيارات التوزيع في الطريق"
          icon={Package}
          colorScheme="emerald"
        />
      </div>

      {/* ========================================================
          3. FLASH DEALS & BONUSES CAROUSEL / GRID
          صفقات حارقة تشجع التاجر يطلب فوراً
         ======================================================== */}
      <div className="rounded-2xl border border-amber-200/90 bg-gradient-to-b from-amber-50/50 to-white p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-gray-900">
                صفقات اليوم وبونص المصانع الفوري 🔥
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-800">
                عروض أسعار خاصة للمتاجر المربوطة فقط بهامش ربح مضاعف لمحلك
              </p>
            </div>
          </div>

          <Link
            href="/merchant/clearance"
            className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>سوق التصفية والخصومات الكبرى</span>
            <ArrowRight className="h-3 w-3 rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {flashDeals.map((deal) => (
            <div
              key={deal.id}
              className="flex flex-col justify-between rounded-xl border border-amber-200 bg-white p-3.5 shadow-xs hover:border-amber-300 hover:shadow-md transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5">
                    {deal.discount}
                  </span>
                  <span className="text-[10px] text-amber-700 font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3 text-amber-500" />
                    <span>{deal.endsIn}</span>
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                  {deal.productName}
                </h3>

                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {deal.description}
                </p>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <div>
                    <span className="text-sm font-black text-gray-900">{deal.price} ج.م</span>
                    {deal.oldPrice && (
                      <span className="text-[11px] text-slate-400 line-through mr-1">
                        {deal.oldPrice} ج
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 block">{deal.unit}</span>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {deal.savingEstimate}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-slate-500">{deal.supplierName}</span>
                <button
                  type="button"
                  onClick={() => handleAddSingleDeal(deal)}
                  className="flex items-center gap-1 rounded-lg bg-[#0f2d4a] hover:bg-blue-900 text-white px-3 py-1.5 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <ShoppingCart className="h-3 w-3" />
                  <span>أضف للسلة</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          4. 1-CLICK QUICK RESTOCK BASKET & AREA TRENDS
          "طلبية النواقص بضغطة واحدة" - إبداع حقيقي يسهل عمل التاجر
         ======================================================== */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
                <MapPin className="h-4 w-4" />
              </span>
              <h2 className="text-sm sm:text-base font-black text-gray-900">
                المنتجات الأكثر طلباً وسحباً في منطقتك ({profile.area || 'الإسماعيلية'}) 📈
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              هذه الأصناف سريعة الدوران ومطلوبة يومياً في المتاجر المجاورة لك بمحافظتك
            </p>
          </div>

          <button
            type="button"
            onClick={handleQuickRestockAll}
            className={`flex items-center justify-center gap-2 rounded-xl py-2 px-4 text-xs font-black shadow-xs transition-all cursor-pointer self-start sm:self-auto ${
              quickOrderAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0f2d4a] hover:bg-blue-900 text-white'
            }`}
          >
            {quickOrderAdded ? (
              <>
                <Check className="h-4 w-4" />
                <span>تمت الإضافة للسلة!</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 fill-amber-300 text-amber-300" />
                <span>طلب النواقص كلها بنقرة واحدة (4 كراتين)</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {trendingAreaProducts.map((prod) => (
            <div
              key={prod.id}
              className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[9px] font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                    {prod.category}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    {prod.margin}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-gray-900 leading-snug line-clamp-1">
                  {prod.name}
                </h3>

                <p className="text-[10px] text-slate-400 mt-0.5">{prod.unit}</p>

                <p className="text-[10px] text-blue-700 font-semibold mt-1.5 bg-blue-50/60 p-1 rounded-md">
                  📍 {prod.demandNote}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-black text-gray-900 font-mono">
                  {prod.price} ج.م
                </span>

                <button
                  type="button"
                  onClick={() => {
                    const sup = suppliers.find((s) => s.id === prod.supplierId);
                    if (sup) {
                      addToCart(
                        {
                          id: prod.id,
                          supplierId: prod.supplierId,
                          name: prod.name,
                          category: prod.category,
                          unit: prod.unit,
                          price: prod.price,
                          minOrder: 1,
                          inStock: true,
                        },
                        sup,
                        1
                      );
                    }
                  }}
                  className="flex items-center gap-1 rounded-lg bg-white border border-slate-200 hover:border-[#0f2d4a] hover:bg-[#0f2d4a] hover:text-white text-slate-700 px-2 py-1 text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>كرتونة</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          5. WHY TAWREED? (TRUST & GUARANTEES FOR SUPERMARKET)
          كروت إقناع عملية لصاحب المحل
         ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">توصيل لباب المحل</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
              سيارات توزيع معتمدة تنزل بضاعتك داخل المحل مجاناً لطلبيات الجملة
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">فاتورة رسمية واستبدال</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
              فاتورة ضريبية معتمدة مع حق استبدال أي كرتونة تالفة فوراً دون نزاع
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">الدفع عند الاستلام</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
              عاين الكراتين وتواريخ الصلاحية أولاً ثم ادفع كاش للمندوب بأمان
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">أسعار مصانع حقيقية</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
              بدون وسيط أو تاجر جملة يرفع السعر — هامش ربح كامل لمحلك
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          6. FEED OF LIVE UPDATES FROM LINKED SUPPLIERS
         ======================================================== */}
      <div className="space-y-3.5 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-gray-900">
                منشورات وتحديثات الشركات المربوطة معك
              </h2>
              {stats.unreadUpdatesCount > 0 && (
                <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5">
                  {stats.unreadUpdatesCount} جديد
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              كل جديد تنزله المصانع يصل لحسابك فوراً لتكون أول من يستفيد من العروض
            </p>
          </div>

          <div className="flex items-center gap-2">
            {stats.unreadUpdatesCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>تحديد الكل كمقروء</span>
              </button>
            )}

            <Link
              href="/merchant/suppliers"
              className="text-xs font-bold text-[#0f2d4a] hover:text-blue-700 flex items-center gap-1"
            >
              <span>ربط المزيد من الشركات</span>
              <ArrowRight className="h-3 w-3 rotate-180" />
            </Link>
          </div>
        </div>

        {/* Filters Bar */}
        {linkedSuppliers.length > 0 && (
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Type Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {typeTabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = selectedType === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedType(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        active
                          ? 'bg-[#0f2d4a] text-white shadow-xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                      }`}
                    >
                      {Icon && <Icon className="h-3 w-3" />}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Supplier Filter & Unread Toggle */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-gray-800 cursor-pointer focus:border-[#0f2d4a] focus:outline-none"
                >
                  <option value="all">كل الشركات المربوطة</option>
                  {linkedSuppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setUnreadOnly(!unreadOnly)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    unreadOnly
                      ? 'bg-blue-50 border-blue-300 text-blue-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      unreadOnly ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  />
                  <span>غير المقروء فقط</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feed List or Empty State */}
        {linkedSuppliers.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="لم تقم بالربط مع أي شركة بعد"
            description="اربط مع المصانع والشركات التي تشتري منها بضاعة محلك لتصلك عروضهم وتخفيضاتهم وأسعارهم الحية هنا في شاشتك الرئيسية."
            actionText="تصفح دليل الشركات للربط"
            onAction={() => {
              window.location.href = '/merchant/suppliers';
            }}
            badge="ابدأ التوفير الآن"
          />
        ) : filteredUpdates.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="لا توجد تحديثات مطابقة للفلاتر الحالية"
            description="جرب إزالة فلتر غير المقروء أو اختيار شركة أخرى لرؤية التحديثات والمنشورات السابقة."
            actionText="إعادة ضبط الفلاتر"
            onAction={() => {
              setSelectedSupplierId('all');
              setSelectedType('all');
              setUnreadOnly(false);
            }}
          />
        ) : (
          <div className="space-y-3.5">
            {filteredUpdates.map((update) => (
              <UpdateCard key={update.id} update={update} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
