'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Building2,
  Filter,
  CheckCircle2,
  MapPin,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useMerchant } from '@/context/MerchantContext';
import { SupplierCard } from '@/components/merchant/SupplierCard';
import { EmptyState } from '@/components/common/EmptyState';

export default function MerchantSuppliersDirectoryPage() {
  const { suppliers } = useMerchant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [activeTab, setActiveTab] = useState<'all' | 'linked'>('all');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(suppliers.map((s) => s.category));
    return ['all', ...Array.from(set)];
  }, [suppliers]);

  // Areas list
  const areas = useMemo(() => {
    const set = new Set<string>();
    suppliers.forEach((s) => s.deliveryAreas.forEach((a) => set.add(a)));
    return ['all', ...Array.from(set)];
  }, [suppliers]);

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      // Tab filter
      if (activeTab === 'linked' && !supplier.isLinked) return false;

      // Category filter
      if (selectedCategory !== 'all' && supplier.category !== selectedCategory) {
        return false;
      }

      // Area filter
      if (selectedArea !== 'all' && !supplier.deliveryAreas.includes(selectedArea)) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchName = supplier.name.toLowerCase().includes(q);
        const matchDesc = supplier.description.toLowerCase().includes(q);
        const matchCategory = supplier.category.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCategory) return false;
      }

      return true;
    });
  }, [suppliers, activeTab, selectedCategory, selectedArea, searchQuery]);

  const linkedCount = useMemo(() => suppliers.filter((s) => s.isLinked).length, [suppliers]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-black text-gray-900">دليل الشركات والموردين</h1>
            <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5">
              {suppliers.length} شركة متاحة
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ابحث عن المصانع وتجار الجملة المعتمدين واربط معهم للشراء بأفضل هوامش ربح
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-[#0f2d4a] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            كل الشركات ({suppliers.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('linked')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'linked'
                ? 'bg-[#0f2d4a] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            المربوطة معك ({linkedCount})
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الشركة، مجال التوريد..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-3 pr-9 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-gray-800 cursor-pointer focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
            >
              <option value="all">كل التصنيفات</option>
              {categories
                .filter((c) => c !== 'all')
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>

          {/* Delivery Area Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-gray-800 cursor-pointer focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
            >
              <option value="all">كل مناطق التوريد</option>
              {areas
                .filter((a) => a !== 'all')
                .map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Supplier Cards */}
      {filteredSuppliers.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="لم يتم العثور على شركات مطابقة للبحث"
          description="جرب البحث بكلمات أخرى أو اختر كل التصنيفات والمناطق لعرض جميع الشركات المتاحة في المنظومة."
          actionText="إعادة ضبط الفلاتر"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setSelectedArea('all');
            setActiveTab('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      )}
    </div>
  );
}
