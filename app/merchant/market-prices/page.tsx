'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingDown,
  TrendingUp,
  Minus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  Building2,
  ShoppingCart,
  Filter,
  Search,
  Zap,
} from 'lucide-react';
import { COMMODITY_PRICES } from '@/data/merchant-extra-mock';
import { CommodityPrice } from '@/types/merchant-extra';
import { useMerchant } from '@/context/MerchantContext';

export default function MarketPricesPage() {
  const { suppliers, addToCart } = useMerchant();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [trendFilter, setTrendFilter] = useState<'all' | 'down' | 'up' | 'stable'>('all');

  const categories = useMemo(() => {
    const set = new Set(COMMODITY_PRICES.map((c) => c.category));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredItems = useMemo(() => {
    return COMMODITY_PRICES.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (trendFilter !== 'all' && item.trend !== trendFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        if (!item.name.toLowerCase().includes(q) && !item.category.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, trendFilter, searchQuery]);

  const downCount = COMMODITY_PRICES.filter((c) => c.trend === 'down').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0f2d4a] to-[#1a4a75] p-5 sm:p-7 text-white shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-emerald-300 border border-white/15 mb-2">
              <Zap className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
              <span>مؤشر بورصة السلع الغذائية الحية في مصر</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              بورصة الأسعار اليومية وتوجيهات الشراء 📊
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mt-1">
              تابع حركة أسعار السلع الأساسية يومياً من أرض المصانع مباشرة. اعرف السلعة اللي نزلت عشان تخزنها بسعر رخيص، وتجنب الشراء عند ارتفاع الأسعار.
            </p>
          </div>

          <div className="shrink-0 rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/15 text-center sm:text-right min-w-[200px]">
            <span className="text-[11px] text-slate-300 block">حالة السوق اليوم:</span>
            <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-sm font-black text-emerald-300">
                {downCount} سلع تشهد انخفاضاً ملحوظاً
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              تحديث الأسعار يتم تلقائياً كل 4 ساعات
            </span>
          </div>
        </div>
      </div>

      {/* Quick Trend Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          onClick={() => setTrendFilter(trendFilter === 'down' ? 'all' : 'down')}
          className={`rounded-2xl border p-4 cursor-pointer transition-all ${
            trendFilter === 'down'
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">سلع انخفضت أسعارها (فرص شراء)</span>
            <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-black">
              {downCount} سلع
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            الزيوت، الأرز، والمكرونة سجلت انخفاضاً يمنح محلك هامش ربح أعلى.
          </p>
        </div>

        <div
          onClick={() => setTrendFilter(trendFilter === 'stable' ? 'all' : 'stable')}
          className={`rounded-2xl border p-4 cursor-pointer transition-all ${
            trendFilter === 'stable'
              ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200'
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900">سلع مستقرة السعر</span>
            <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-black">
              {COMMODITY_PRICES.filter((c) => c.trend === 'stable').length} سلع
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            السكر والجبن والشيبسي مستقرة، اشترِ احتياج أسبوع إلى أسبوعين.
          </p>
        </div>

        <div
          onClick={() => setTrendFilter(trendFilter === 'up' ? 'all' : 'up')}
          className={`rounded-2xl border p-4 cursor-pointer transition-all ${
            trendFilter === 'up'
              ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200'
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-900">سلع مرشحة للارتفاع</span>
            <span className="rounded-full bg-rose-100 text-rose-800 px-2 py-0.5 text-xs font-black">
              {COMMODITY_PRICES.filter((c) => c.trend === 'up').length} سلعة
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            الحليب المعقم قد يشهد زيادة بسبب التغليف، احجز احتياجك الآن.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن سلعة لمتابعة بورصتها (زيت، سكر، أرز، حليب...)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-3 pr-9 py-2 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-gray-800 cursor-pointer focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
          >
            <option value="all">كل الأقسام</option>
            {categories
              .filter((c) => c !== 'all')
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>

          {trendFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setTrendFilter('all')}
              className="text-xs text-slate-500 hover:text-slate-800 underline font-semibold whitespace-nowrap"
            >
              إلغاء فلتر الحركة
            </button>
          )}
        </div>
      </div>

      {/* Commodities Table / Cards */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isDown = item.trend === 'down';
          const isUp = item.trend === 'up';

          return (
            <div
              key={item.id}
              className="rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4"
            >
              {/* Product meta & price movement */}
              <div className="space-y-1.5 sm:space-y-2 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="rounded-md bg-slate-100 text-slate-700 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold">
                    {item.category}
                  </span>

                  <span className="text-[9px] sm:text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span>تحديث: {item.updatedAt}</span>
                  </span>

                  {isDown && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[9px] sm:text-[10px] font-black">
                      <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>انخفاض {Math.abs(item.changePercent)}% هذا الأسبوع</span>
                    </span>
                  )}

                  {isUp && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 text-rose-800 px-2 py-0.5 text-[9px] sm:text-[10px] font-black">
                      <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>ارتفاع {item.changePercent}%</span>
                    </span>
                  )}

                  {item.trend === 'stable' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold">
                      <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>سعر مستقر</span>
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2 sm:gap-3">
                  <h3 className="text-xs sm:text-base font-bold text-gray-900">{item.name}</h3>
                  <span className="text-[10px] sm:text-xs text-slate-400">({item.unit})</span>
                </div>

                {/* Intelligent Advice for Supermarket Owner */}
                <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-2 sm:p-2.5 text-[10px] sm:text-[11px] text-slate-700 leading-relaxed">
                  <strong className="text-blue-900 font-bold ml-1">💡 نصيحة توريد لمحلك:</strong>
                  <span>{item.advice}</span>
                </div>
              </div>

              {/* Price comparison & Quick Action */}
              <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-5 pt-2.5 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <div className="text-right">
                  <span className="text-[9px] sm:text-[10px] text-slate-400 block">أرخص سعر مصنع متاح:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm sm:text-xl font-black text-emerald-700 font-mono">
                      {item.bestPrice} ج.م
                    </span>
                    {item.currentAvgPrice > item.bestPrice && (
                      <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                        {item.currentAvgPrice} ج
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold block mt-0.5">
                    المورد: {item.bestSupplierName}
                  </span>
                </div>

                <Link
                  href={`/merchant/suppliers/${item.bestSupplierId}`}
                  className="flex items-center gap-1 rounded-xl bg-[#0f2d4a] hover:bg-blue-900 text-white px-3 py-1.5 sm:px-4 sm:py-2.5 text-[10px] sm:text-xs font-bold shadow-xs transition-colors shrink-0"
                >
                  <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>شراء بأرخص سعر</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
