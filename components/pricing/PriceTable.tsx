'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Upload,
  Percent,
  Check,
  RotateCcw,
  Package,
  AlertCircle,
  TrendingDown,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { PriceTier, TierProduct } from '@/types/pricing';
import { BulkDiscountModal } from './BulkDiscountModal';
import { ExcelImportModal } from './ExcelImportModal';

interface PriceTableProps {
  tiers: PriceTier[];
  products: TierProduct[];
  onSaveProducts: (updated: TierProduct[]) => void;
}

export function PriceTable({
  tiers,
  products,
  onSaveProducts,
}: PriceTableProps) {
  // Local working copy of products for inline editing
  const [workingProducts, setWorkingProducts] = useState<TierProduct[]>(products);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [isBulkDiscountOpen, setIsBulkDiscountOpen] = useState(false);
  const [isExcelImportOpen, setIsExcelImportOpen] = useState(false);

  // Set of changed cell keys: `${productId}_${tierId}`
  const changedCells = useMemo(() => {
    const changed = new Set<string>();
    workingProducts.forEach((wp) => {
      const orig = products.find((p) => p.id === wp.id);
      if (!orig) return;

      tiers.forEach((t) => {
        if (wp.tierPrices[t.id] !== orig.tierPrices[t.id]) {
          changed.add(`${wp.id}_${t.id}`);
        }
      });
    });
    return changed;
  }, [workingProducts, products, tiers]);

  const hasUnsavedChanges = changedCells.size > 0;

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ['الكل', ...Array.from(set)];
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return workingProducts.filter((p) => {
      const matchCat = selectedCategory === 'الكل' || p.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }, [workingProducts, selectedCategory, searchQuery]);

  // Handle cell edit
  const handlePriceChange = (productId: string, tierId: string, valStr: string) => {
    const val = valStr === '' ? null : Number(valStr);
    setWorkingProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          tierPrices: {
            ...p.tierPrices,
            [tierId]: val,
          },
        };
      })
    );
  };

  // Revert changes
  const handleRevert = () => {
    setWorkingProducts(products);
  };

  // Save changes
  const handleSave = () => {
    console.log('[PriceTable] Saving updated tier prices:', workingProducts);
    // TODO(backend): replace with real API call
    onSaveProducts(workingProducts);
  };

  // Export current prices to CSV using xlsx
  const handleExportCSV = () => {
    const rows = workingProducts.map((p) => {
      const row: Record<string, any> = {
        'كود_الصنف': p.sku,
        'اسم_المنتج': p.name,
        'التصنيف': p.category,
        'الوحدة': p.unit,
        'السعر_الأساسي': p.basePrice,
      };
      tiers.forEach((t) => {
        row[t.name] = p.tierPrices[t.id] ?? '';
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'أسعار_الشرائح');
    XLSX.writeFile(wb, `أسعار_شرائح_توريد_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Apply bulk discount from modal
  const handleApplyBulkDiscount = (tierId: string, updated: TierProduct[]) => {
    setWorkingProducts(updated);
  };

  // Apply excel import
  const handleImportConfirm = (imported: TierProduct[]) => {
    setWorkingProducts(imported);
    onSaveProducts(imported);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث باسم المنتج، كود الصنف (SKU) أو التصنيف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-slate-50/70 pr-10 pl-4 py-2 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#0f2d4a] focus:outline-none transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0f2d4a]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'الكل' ? 'جميع التصنيفات' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons: Bulk Discount, Import, Export */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            <button
              type="button"
              onClick={() => setIsBulkDiscountOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-2 text-xs font-bold transition-colors cursor-pointer"
            >
              <Percent className="h-3.5 w-3.5" />
              <span>خصم جماعي</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExcelImportOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-2 text-xs font-bold transition-colors cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>استيراد Excel</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>تصدير CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spreadsheet-like Table */}
      <div className="relative rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
          <table className="w-full text-right text-xs border-collapse">
            <thead className="bg-slate-50/95 sticky top-0 z-10 border-b border-slate-200 text-gray-700">
              <tr>
                <th className="p-3 font-bold min-w-[240px]">المنتج والتعبئة</th>
                <th className="p-3 font-bold min-w-[120px]">كود (SKU)</th>
                <th className="p-3 font-bold min-w-[120px] bg-slate-100/70 border-l border-r border-slate-200">
                  السعر الأساسي
                </th>
                {tiers.map((t) => (
                  <th key={t.id} className="p-3 font-bold min-w-[150px]">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#0f2d4a]" />
                      <span className="truncate">{t.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-blue-50/20 transition-colors">
                  {/* Product Info */}
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 truncate max-w-[220px]">
                          {prod.name}
                        </h4>
                        <span className="text-[10px] text-gray-400">
                          {prod.category} • {prod.unit}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="p-3">
                    <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {prod.sku}
                    </span>
                  </td>

                  {/* Base Price */}
                  <td className="p-3 bg-slate-50/50 border-l border-r border-slate-200">
                    <div className="font-black text-sm text-gray-900">
                      {prod.basePrice.toLocaleString()} ج.م
                    </div>
                    <span className="text-[10px] text-gray-400">سعر القائمة</span>
                  </td>

                  {/* Dynamic Tier Columns */}
                  {tiers.map((t) => {
                    const price = prod.tierPrices[t.id];
                    const isChanged = changedCells.has(`${prod.id}_${t.id}`);

                    // Live discount calculation compared to basePrice
                    let discountPct = 0;
                    if (price !== null && price !== undefined && prod.basePrice > 0) {
                      discountPct = Math.round(((prod.basePrice - price) / prod.basePrice) * 100);
                    }

                    return (
                      <td
                        key={t.id}
                        className={`p-2.5 transition-colors ${
                          isChanged ? 'bg-amber-50/60 ring-1 ring-inset ring-amber-300' : ''
                        }`}
                      >
                        <div className="relative">
                          <input
                            type="number"
                            step="0.5"
                            placeholder="غير محدد"
                            value={price === null || price === undefined ? '' : price}
                            onChange={(e) => handlePriceChange(prod.id, t.id, e.target.value)}
                            className={`w-full rounded-lg border px-2.5 py-1.5 text-xs font-black transition-all focus:outline-none focus:ring-1 focus:ring-[#0f2d4a] ${
                              isChanged
                                ? 'border-amber-400 bg-amber-50 text-amber-950 font-bold'
                                : price !== null
                                ? 'border-gray-200 bg-white text-gray-900'
                                : 'border-dashed border-gray-300 bg-slate-50/60 text-gray-400 placeholder:text-gray-400'
                            }`}
                          />
                        </div>

                        {/* Live discount / margin indicator */}
                        {price !== null && price !== undefined ? (
                          <div className="mt-1 flex items-center justify-between text-[10px]">
                            {discountPct > 0 ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                                <TrendingDown className="h-2.5 w-2.5" />
                                خصم {discountPct}%
                              </span>
                            ) : discountPct < 0 ? (
                              <span className="text-rose-600 font-bold">
                                +{Math.abs(discountPct)}% زيادة
                              </span>
                            ) : (
                              <span className="text-gray-400">السعر الأساسي</span>
                            )}
                            <span className="text-gray-400">ج.م</span>
                          </div>
                        ) : (
                          <span className="mt-1 block text-[10px] text-gray-400 font-semibold">
                            السعر غير محدد
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky Unsaved Changes Bar */}
      {hasUnsavedChanges && (
        <div className="sticky bottom-4 z-40 flex items-center justify-between gap-3 rounded-2xl bg-slate-900 text-white p-4 shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-400 animate-ping" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold">
                لديك تعديلات غير محفوظة ({changedCells.size} خلايا سعرية تم تعديلها)
              </h4>
              <p className="text-[11px] text-slate-300 hidden sm:block">
                احفظ التعديلات لتصبح سارية فوراً لجميع التجار المسكنين على تلك الشرائح
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRevert}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-600 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>تراجع</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs sm:text-sm font-bold text-white hover:bg-emerald-500 transition-all shadow-md cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>حفظ التعديلات الآن</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <BulkDiscountModal
        isOpen={isBulkDiscountOpen}
        onClose={() => setIsBulkDiscountOpen(false)}
        tiers={tiers}
        products={workingProducts}
        onApply={handleApplyBulkDiscount}
      />

      <ExcelImportModal
        isOpen={isExcelImportOpen}
        onClose={() => setIsExcelImportOpen(false)}
        tiers={tiers}
        products={workingProducts}
        onImportConfirm={handleImportConfirm}
      />
    </div>
  );
}
