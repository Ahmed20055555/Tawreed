'use client';

import React, { useState, useMemo } from 'react';
import { X, Percent, Sparkles, Check, ArrowDownRight, Tag } from 'lucide-react';
import { PriceTier, TierProduct } from '@/types/pricing';

interface BulkDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  tiers: PriceTier[];
  products: TierProduct[];
  onApply: (tierId: string, updatedProducts: TierProduct[]) => void;
}

export function BulkDiscountModal({
  isOpen,
  onClose,
  tiers,
  products,
  onApply,
}: BulkDiscountModalProps) {
  const [selectedTierId, setSelectedTierId] = useState<string>(tiers[0]?.id || '');
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [roundToPound, setRoundToPound] = useState<boolean>(true);

  // Calculate preview
  const previewProducts = useMemo(() => {
    if (!selectedTierId) return [];

    return products.map((prod) => {
      const discountRatio = Math.max(0, Math.min(100, discountPercent)) / 100;
      let newPrice = prod.basePrice * (1 - discountRatio);
      if (roundToPound) {
        newPrice = Math.round(newPrice);
      } else {
        newPrice = Math.round(newPrice * 10) / 10;
      }

      const currentTierPrice = prod.tierPrices[selectedTierId] ?? null;

      return {
        ...prod,
        currentTierPrice,
        newCalculatedPrice: newPrice,
      };
    });
  }, [selectedTierId, discountPercent, roundToPound, products]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const updated = products.map((prod) => {
      const discountRatio = Math.max(0, Math.min(100, discountPercent)) / 100;
      let newPrice = prod.basePrice * (1 - discountRatio);
      if (roundToPound) {
        newPrice = Math.round(newPrice);
      } else {
        newPrice = Math.round(newPrice * 10) / 10;
      }

      return {
        ...prod,
        tierPrices: {
          ...prod.tierPrices,
          [selectedTierId]: newPrice,
        },
      };
    });

    console.log('[BulkDiscountModal] Applying discount to tier:', {
      tierId: selectedTierId,
      discountPercent,
    });
    // TODO(backend): replace with real API call
    onApply(selectedTierId, updated);
    onClose();
  };

  const selectedTier = tiers.find((t) => t.id === selectedTierId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-slate-50/80 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
              <Percent className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                تطبيق نسبة خصم جماعية على شريحة
              </h3>
              <p className="text-xs text-gray-500">
                حساب أسعار جميع المنتجات تلقائياً كنسبة خصم من السعر الأساسي
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-purple-50/50 border border-purple-100 rounded-xl p-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                اختر الشريحة المستهدفة:
              </label>
              <select
                value={selectedTierId}
                onChange={(e) => setSelectedTierId(e.target.value)}
                className="w-full rounded-lg border border-purple-200 bg-white px-3 py-2 text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:border-purple-600"
              >
                {tiers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                نسبة الخصم من السعر الأساسي (%):
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="90"
                  step="0.5"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full rounded-lg border border-purple-200 bg-white pr-3 pl-8 py-2 text-xs sm:text-sm font-black text-purple-900 focus:outline-none focus:border-purple-600"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-purple-600">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                خيارات التقريب:
              </label>
              <label className="flex items-center gap-2 mt-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={roundToPound}
                  onChange={(e) => setRoundToPound(e.target.checked)}
                  className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <span>تقريب لأقرب جنيه صحيح</span>
              </label>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-gray-500">نسب سريعة:</span>
            {[5, 10, 15, 20, 25, 30].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setDiscountPercent(pct)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  discountPercent === pct
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                خصم {pct}%
              </button>
            ))}
          </div>

          {/* Live Preview Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                <span>معاينة الأسعار قبل التطبيق ({selectedTier?.name}):</span>
              </span>
              <span className="text-[11px] text-gray-500">
                إجمالي {previewProducts.length} أصناف
              </span>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-gray-600 sticky top-0 border-b border-gray-200">
                  <tr>
                    <th className="p-2.5 font-bold">المنتج</th>
                    <th className="p-2.5 font-bold">السعر الأساسي</th>
                    <th className="p-2.5 font-bold">السعر الحالي</th>
                    <th className="p-2.5 font-bold text-purple-900">السعر الجديد المقترح</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {previewProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="p-2.5 font-medium text-gray-900">{p.name}</td>
                      <td className="p-2.5 font-bold text-gray-600">{p.basePrice} ج.م</td>
                      <td className="p-2.5 text-gray-500">
                        {p.currentTierPrice ? `${p.currentTierPrice} ج.م` : 'غير محدد'}
                      </td>
                      <td className="p-2.5 font-black text-purple-700">
                        {p.newCalculatedPrice} ج.م
                        <span className="text-[10px] text-gray-400 font-normal mr-1">
                          (وفر {p.basePrice - p.newCalculatedPrice} ج.م)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-xl bg-[#0f2d4a] px-5 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#163e63] transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Check className="h-4 w-4" />
              <span>تطبيق الأسعار الجديدة على ({selectedTier?.name})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
