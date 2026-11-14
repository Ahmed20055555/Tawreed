'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Flame,
  Search,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Inbox,
  CheckCircle2,
  MapPin,
  Clock,
  Tag,
} from 'lucide-react';
import { ClearanceListing } from '@/types/clearance';
import { getClearanceListings } from '@/lib/mock-api';
import { ClearanceCard } from '@/components/clearance/ClearanceCard';
import { calculateDaysLeft } from '@/components/clearance/ExpiryBadge';

export default function MerchantClearancePage() {
  const [listings, setListings] = useState<ClearanceListing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('الكل');
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [expiryFilter, setExpiryFilter] = useState<'all' | 'week' | 'month' | 'more'>('all');
  const [sortBy, setSortBy] = useState<'discount' | 'expiry'>('discount');
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Only show active listings to merchants
    const data = getClearanceListings().filter((item) => item.status === 'active');
    setListings(data);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOrder = (listing: ClearanceListing, qty: number) => {
    console.log('[MerchantClearance] Order placed:', { product: listing.productName, qty });
    setCartCount((c) => c + qty);
    showToast(`تم إرسال طلبك (${qty} كرتونة من ${listing.productName}) للمورد بنجاح!`);
  };

  // Filter & Sort listings
  const filteredAndSortedListings = useMemo(() => {
    let result = listings.filter((item) => {
      // Search
      const matchSearch =
        searchQuery === '' ||
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase());

      // Area
      const matchArea =
        selectedArea === 'الكل' || item.deliveryAreas.includes(selectedArea);

      // Discount %
      const matchDiscount = item.discountPercentage >= minDiscount;

      // Expiry filter
      const daysLeft = calculateDaysLeft(item.expiryDate);
      let matchExpiry = true;
      if (expiryFilter === 'week') {
        matchExpiry = daysLeft <= 7;
      } else if (expiryFilter === 'month') {
        matchExpiry = daysLeft <= 30;
      } else if (expiryFilter === 'more') {
        matchExpiry = daysLeft > 30;
      }

      return matchSearch && matchArea && matchDiscount && matchExpiry;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'discount') {
        return b.discountPercentage - a.discountPercentage;
      } else {
        const daysA = calculateDaysLeft(a.expiryDate);
        const daysB = calculateDaysLeft(b.expiryDate);
        return daysA - daysB;
      }
    });

    return result;
  }, [listings, searchQuery, selectedArea, minDiscount, expiryFilter, sortBy]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-gray-900 flex flex-col font-sans" dir="rtl">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs sm:text-sm text-white shadow-xl animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Merchant Header */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs font-black text-sm sm:text-base">
                <Flame className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-base font-black tracking-tight text-gray-900 leading-none">
                  سوق التصفية
                </span>
                <span className="text-[9px] sm:text-[10px] text-rose-600 font-bold">
                  عروض جملة خاصة للتجار
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-100 px-3 py-1.5 text-xs font-bold text-rose-700">
              <ShoppingBag className="h-4 w-4" />
              <span>طلباتك ({cartCount})</span>
            </div>

            <Link
              href="/supplier/clearance"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span>بوابة الموردين</span>
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-rose-900 via-rose-800 to-[#0f2d4a] text-white p-5 sm:p-7 shadow-md">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>فرص ذهبية لرفع هامش ربحك</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight">
              بضاعة غذائية أصلية بخصومات تصل إلى 60%
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
              اشترِ كراتين البضاعة قريبة الصلاحية مباشرة من كبرى الشركات والمستوردين بأسعار تصفية مخفضة، مع ضمان الفحص والدفع عند الاستلام.
            </p>
          </div>
        </div>

        {/* Filter and Sorting Controls */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-5 shadow-xs space-y-3.5">
          {/* Search bar & Sort selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث باسم المنتج أو الماركة التجارية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-slate-50/70 pr-10 pl-4 py-2 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-rose-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-600 whitespace-nowrap">الترتيب حسب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-xs font-bold text-gray-800 focus:border-rose-600 focus:outline-none"
              >
                <option value="discount">الأعلى خصماً %</option>
                <option value="expiry">الأقرب انتهاءً</option>
              </select>
            </div>
          </div>

          {/* Filters Row: Area + Discount % + Expiry */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            {/* Area Filter */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-rose-600" />
                <span>منطقة التوصيل:</span>
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-rose-600"
              >
                <option value="الكل">كل المحافظات</option>
                <option value="الإسماعيلية">الإسماعيلية</option>
                <option value="السويس">السويس</option>
                <option value="بورسعيد">بورسعيد</option>
                <option value="الشرقية">الشرقية</option>
                <option value="القاهرة">القاهرة</option>
                <option value="الجيزة">الجيزة</option>
              </select>
            </div>

            {/* Discount Filter */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1">
                <Tag className="h-3.5 w-3.5 text-rose-600" />
                <span>نسبة الخصم:</span>
              </label>
              <select
                value={minDiscount}
                onChange={(e) => setMinDiscount(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-rose-600"
              >
                <option value={0}>جميع الخصومات</option>
                <option value={20}>خصم 20% فأكثر</option>
                <option value={30}>خصم 30% فأكثر</option>
                <option value={40}>خصم 40% فأكثر</option>
                <option value={50}>خصم 50% فأكثر (تصفية قصوى)</option>
              </select>
            </div>

            {/* Expiry Filter */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-rose-600" />
                <span>المدة المتبقية للصلاحية:</span>
              </label>
              <select
                value={expiryFilter}
                onChange={(e) => setExpiryFilter(e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-rose-600"
              >
                <option value="all">جميع الفترات</option>
                <option value="week">أقل من 7 أيام (خصم فائق)</option>
                <option value="month">أقل من شهر</option>
                <option value="more">أكثر من شهر</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Result Count */}
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span>
            عرض <strong className="text-gray-900 font-bold">{filteredAndSortedListings.length}</strong> فرصة تصفية متاحة
          </span>
          <span>تحديث مباشر</span>
        </div>

        {/* Grid */}
        {filteredAndSortedListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredAndSortedListings.map((item) => (
              <ClearanceCard
                key={item.id}
                listing={item}
                mode="merchant"
                onOrder={handleOrder}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Inbox className="h-7 w-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              لا توجد عروض مطابقة للفلاتر
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
              جرب تغيير معايير البحث أو اختيار كل المحافظات لعرض الفرص المتاحة.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedArea('الكل');
                setMinDiscount(0);
                setExpiryFilter('all');
              }}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
