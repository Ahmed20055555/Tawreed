'use client';

import React from 'react';
import { Search, MapPin, SlidersHorizontal, Store, ShieldCheck, Navigation } from 'lucide-react';
import { StoreFilterState, StoreType } from '@/types/store';

interface RadarFiltersProps {
  filters: StoreFilterState;
  onChange: (filters: StoreFilterState) => void;
  areasList: string[];
  totalMatches: number;
}

const STORE_TYPES: ('الكل' | StoreType)[] = [
  'الكل',
  'سوبر ماركت',
  'هايبر ماركت',
  'ميني ماركت',
  'محل بقالة',
];

export function RadarFilters({
  filters,
  onChange,
  areasList,
  totalMatches,
}: RadarFiltersProps) {
  const update = (partial: Partial<StoreFilterState>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-5 shadow-xs space-y-4">
      {/* Top Search bar */}
      <div className="relative">
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="ابحث باسم المحل، اسم المالك أو الشارع..."
          value={filters.searchQuery}
          onChange={(e) => update({ searchQuery: e.target.value })}
          className="w-full rounded-xl border border-gray-200 bg-slate-50/70 pr-10 pl-4 py-2 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#0f2d4a] focus:outline-none transition-all"
        />
      </div>

      {/* Grid of filters: Store Type, Area, Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Type Filter */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1">
            <Store className="h-3.5 w-3.5 text-[#0f2d4a]" />
            <span>نوع النشاط:</span>
          </label>
          <select
            value={filters.type}
            onChange={(e) => update({ type: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0f2d4a]"
          >
            {STORE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Area Filter */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-[#0f2d4a]" />
            <span>المنطقة / الحي:</span>
          </label>
          <select
            value={filters.area}
            onChange={(e) => update({ area: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0f2d4a]"
          >
            <option value="الكل">كل المناطق بالإسماعيلية</option>
            {areasList.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-[#0f2d4a]" />
            <span>حالة التسجيل:</span>
          </label>
          <select
            value={filters.status}
            onChange={(e) => update({ status: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0f2d4a]"
          >
            <option value="الكل">الكل (مسجل وغير مسجل)</option>
            <option value="registered">مسجل على المنصة فقط</option>
            <option value="unregistered">غير مسجل بعد</option>
            <option value="invited">تمت دعوته</option>
          </select>
        </div>
      </div>

      {/* Distance Radius Slider */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <Navigation className="h-3.5 w-3.5 text-blue-600" />
            <span>نطاق المسافة من مقر الشركة:</span>
          </label>
          <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-black text-blue-700">
            حتى {filters.maxDistance} كم
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="50"
          step="1"
          value={filters.maxDistance}
          onChange={(e) => update({ maxDistance: Number(e.target.value) })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0f2d4a]"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-semibold">
          <span>1 كم (نطاق الحي)</span>
          <span>15 كم</span>
          <span>30 كم</span>
          <span>50 كم (المحافظة كاملة)</span>
        </div>
      </div>
    </div>
  );
}
