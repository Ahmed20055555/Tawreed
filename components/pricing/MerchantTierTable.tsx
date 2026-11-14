'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  CheckSquare,
  Square,
  Layers,
  Sparkles,
  Check,
  MapPin,
  Phone,
  Tag,
  AlertTriangle,
} from 'lucide-react';
import { PriceTier, PricingMerchant, TierProduct } from '@/types/pricing';

interface MerchantTierTableProps {
  merchants: PricingMerchant[];
  tiers: PriceTier[];
  products: TierProduct[];
  onUpdateMerchantTier: (merchantId: string, tierId: string | null) => void;
  onBulkAssignTier: (merchantIds: string[], tierId: string | null) => void;
  onUpdateSpecialPrice: (merchantId: string, productId: string, price: number | null) => void;
}

export function MerchantTierTable({
  merchants,
  tiers,
  products,
  onUpdateMerchantTier,
  onBulkAssignTier,
  onUpdateSpecialPrice,
}: MerchantTierTableProps) {
  const [selectedMerchantIds, setSelectedMerchantIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [bulkTierSelect, setBulkTierSelect] = useState<string>('');
  const [editingSpecialMerchant, setEditingSpecialMerchant] = useState<PricingMerchant | null>(null);

  // Filtered merchants
  const filteredMerchants = useMemo(() => {
    return merchants.filter((m) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.ownerName.toLowerCase().includes(q) ||
        m.area.toLowerCase().includes(q);

      let matchTier = true;
      if (tierFilter === 'unassigned') {
        matchTier = !m.tierId;
      } else if (tierFilter !== 'all') {
        matchTier = m.tierId === tierFilter;
      }

      return matchSearch && matchTier;
    });
  }, [merchants, searchQuery, tierFilter]);

  // Bulk selection toggles
  const isAllSelected =
    filteredMerchants.length > 0 &&
    filteredMerchants.every((m) => selectedMerchantIds.includes(m.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedMerchantIds([]);
    } else {
      setSelectedMerchantIds(filteredMerchants.map((m) => m.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedMerchantIds.includes(id)) {
      setSelectedMerchantIds((prev) => prev.filter((mId) => mId !== id));
    } else {
      setSelectedMerchantIds((prev) => [...prev, id]);
    }
  };

  // Bulk assign action
  const handleApplyBulk = () => {
    if (!bulkTierSelect || selectedMerchantIds.length === 0) return;
    const tierId = bulkTierSelect === 'none' ? null : bulkTierSelect;
    onBulkAssignTier(selectedMerchantIds, tierId);
    setSelectedMerchantIds([]);
    setBulkTierSelect('');
  };

  return (
    <div className="space-y-4">
      {/* Search and Bulk Controls */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث باسم المحل أو المالك أو الحي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-slate-50/70 pr-10 pl-4 py-2 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#0f2d4a] focus:outline-none transition-all"
            />
          </div>

          {/* Tier Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0f2d4a]"
            >
              <option value="all">جميع الشرائح</option>
              <option value="unassigned">⚠️ بدون شريحة (يحتاج تسكين)</option>
              {tiers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Action Strip when merchants selected */}
        {selectedMerchantIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl bg-purple-50 border border-purple-200 p-2.5 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-600 text-white text-[11px]">
                {selectedMerchantIds.length}
              </span>
              <span>محلات محددة للتعيين الجماعي</span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={bulkTierSelect}
                onChange={(e) => setBulkTierSelect(e.target.value)}
                className="rounded-lg border border-purple-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-purple-600"
              >
                <option value="">-- اختر الشريحة للتسكين --</option>
                {tiers.map((t) => (
                  <option key={t.id} value={t.id}>
                    نقل إلى: {t.name}
                  </option>
                ))}
                <option value="none">إلغاء التسكين (بدون شريحة)</option>
              </select>

              <button
                type="button"
                disabled={!bulkTierSelect}
                onClick={handleApplyBulk}
                className="inline-flex items-center gap-1 rounded-lg bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-purple-700 disabled:opacity-40 transition-colors shadow-xs"
              >
                <Check className="h-3.5 w-3.5" />
                <span>تطبيق على المحددين</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Merchants Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-gray-600 border-b border-slate-200">
              <tr>
                <th className="p-3 w-10">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-slate-500 hover:text-slate-800"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="h-4 w-4 text-[#0f2d4a]" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                </th>
                <th className="p-3 font-bold min-w-[200px]">المحل والمسؤول</th>
                <th className="p-3 font-bold min-w-[140px]">المنطقة / الحي</th>
                <th className="p-3 font-bold min-w-[180px]">الشريحة السعرية الحالية</th>
                <th className="p-3 font-bold min-w-[180px]">السعر المخصص (Special Price)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMerchants.map((merchant) => {
                const isSelected = selectedMerchantIds.includes(merchant.id);
                const hasSpecialPrices =
                  merchant.specialPrices && Object.keys(merchant.specialPrices).length > 0;

                return (
                  <tr
                    key={merchant.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-purple-50/40' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(merchant.id)}
                        className="text-slate-500 hover:text-slate-800"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-[#0f2d4a]" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-300" />
                        )}
                      </button>
                    </td>

                    {/* Merchant Info */}
                    <td className="p-3">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{merchant.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                          <span>المالك: {merchant.ownerName}</span>
                          <span>•</span>
                          <span className="font-mono" dir="ltr">
                            {merchant.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Area */}
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>
                          {merchant.area}، {merchant.city}
                        </span>
                      </div>
                    </td>

                    {/* Current Tier Dropdown */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={merchant.tierId || ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? null : e.target.value;
                            onUpdateMerchantTier(merchant.id, val);
                          }}
                          className={`rounded-xl border px-2.5 py-1.5 text-xs font-bold transition-all focus:outline-none ${
                            merchant.tierId
                              ? 'border-gray-200 bg-white text-gray-900'
                              : 'border-amber-300 bg-amber-50 text-amber-900 font-black ring-1 ring-amber-300'
                          }`}
                        >
                          <option value="">بدون شريحة (يحتاج تسكين)</option>
                          {tiers.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </select>

                        {!merchant.tierId && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-800 shrink-0">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            بدون شريحة
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Special Override Price */}
                    <td className="p-3">
                      {hasSpecialPrices ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-800">
                            <Tag className="h-3 w-3 text-emerald-600" />
                            <span>
                              {Object.keys(merchant.specialPrices!).length} أصناف بسعر مخصص
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingSpecialMerchant(merchant)}
                            className="text-[11px] font-bold text-[#0f2d4a] underline hover:text-blue-700"
                          >
                            تعديل
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditingSpecialMerchant(merchant)}
                          className="inline-flex items-center gap-1 rounded-lg border border-dashed border-gray-300 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-gray-600 hover:bg-slate-100"
                        >
                          <span>+ تخصيص سعر إضافي</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Special Price Modal for individual merchant */}
      {editingSpecialMerchant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden my-6">
            <div className="flex items-center justify-between border-b border-gray-100 bg-slate-50 px-5 py-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  أسعار مخصصة لـ: {editingSpecialMerchant.name}
                </h3>
                <p className="text-xs text-gray-500">
                  تجاوز سعر الشريحة وتحديد سعر خاص لهذا التاجر بالذات
                </p>
              </div>
              <button
                onClick={() => setEditingSpecialMerchant(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {products.map((prod) => {
                const currentOverride = editingSpecialMerchant.specialPrices?.[prod.id] ?? '';
                const tierPrice = editingSpecialMerchant.tierId
                  ? prod.tierPrices[editingSpecialMerchant.tierId]
                  : null;

                return (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-gray-100 bg-slate-50/60"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{prod.name}</h4>
                      <p className="text-[10px] text-gray-500">
                        السعر الأساسي: {prod.basePrice} ج.م • سعر شريحته:{' '}
                        {tierPrice ? `${tierPrice} ج.م` : 'غير محدد'}
                      </p>
                    </div>

                    <div className="w-28 shrink-0">
                      <input
                        type="number"
                        placeholder="سعر مخصص"
                        defaultValue={currentOverride}
                        onBlur={(e) => {
                          const val = e.target.value === '' ? null : Number(e.target.value);
                          onUpdateSpecialPrice(editingSpecialMerchant.id, prod.id, val);
                        }}
                        className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#0f2d4a]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setEditingSpecialMerchant(null)}
                className="rounded-xl bg-[#0f2d4a] px-4 py-2 text-xs font-bold text-white"
              >
                تم وتطبيق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
