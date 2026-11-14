'use client';

import React, { useState } from 'react';
import {
  X,
  Eye,
  Store,
  Tag,
  Package,
  ShoppingCart,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { PriceTier, PricingMerchant, TierProduct } from '@/types/pricing';

interface MerchantPreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  merchants: PricingMerchant[];
  tiers: PriceTier[];
  products: TierProduct[];
}

export function MerchantPreviewDrawer({
  isOpen,
  onClose,
  merchants,
  tiers,
  products,
}: MerchantPreviewDrawerProps) {
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>(
    merchants[0]?.id || ''
  );

  if (!isOpen) return null;

  const selectedMerchant = merchants.find((m) => m.id === selectedMerchantId) || merchants[0];
  const merchantTier = tiers.find((t) => t.id === selectedMerchant?.tierId);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Slide-out Drawer */}
      <aside className="fixed inset-y-0 left-0 z-50 w-full sm:w-[480px] md:w-[540px] bg-white shadow-2xl border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-300 ease-in-out animate-in slide-in-from-left">
        <div>
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold">
                  معاينة الكتالوج بعيون التاجر
                </h3>
                <p className="text-[11px] text-slate-300">
                  شاهد المنتجات والأسعار تماماً كما يراها التاجر في حسابه
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Merchant Selector & Badge */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                اختر التاجر للمعاينة:
              </label>
              <select
                value={selectedMerchantId}
                onChange={(e) => setSelectedMerchantId(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#0f2d4a]"
              >
                {merchants.map((m) => {
                  const t = tiers.find((tier) => tier.id === m.tierId);
                  return (
                    <option key={m.id} value={m.id}>
                      {m.name} ({t ? t.name : 'بدون شريحة'}) - {m.area}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Selected Merchant Details Card */}
            {selectedMerchant && (
              <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">الشريحة المعينة:</span>
                  {merchantTier ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-bold">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>{merchantTier.name}</span>
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[11px] font-bold">
                      ⚠️ بدون شريحة (لا يرى أي أسعار خاصة)
                    </span>
                  )}
                </div>

                {merchantTier?.minOrderValue && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">الحد الأدنى للطلب:</span>
                    <strong className="text-gray-900 font-black">
                      {merchantTier.minOrderValue.toLocaleString()} ج.م
                    </strong>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Product Catalog List as Merchant Sees it */}
          <div className="p-4 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-bold text-gray-800">
                المنتجات المتاحة للطلب ({products.length} صنف):
              </span>
              <span>الأسعار بالجنيه المصري</span>
            </div>

            {products.map((prod) => {
              // Special override has highest priority
              const specialPrice = selectedMerchant?.specialPrices?.[prod.id];
              // Tier price
              const tierPrice = merchantTier ? prod.tierPrices[merchantTier.id] : null;
              // Final price to display
              const finalPrice = specialPrice !== undefined ? specialPrice : tierPrice;
              const hasNoPrice = finalPrice === null || finalPrice === undefined;

              return (
                <div
                  key={prod.id}
                  className={`rounded-2xl border p-3.5 transition-all ${
                    hasNoPrice
                      ? 'border-dashed border-gray-300 bg-gray-50/70 opacity-70'
                      : 'border-slate-200 bg-white shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 border border-slate-200">
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-gray-400 font-medium">
                          {prod.category} • {prod.unit}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                          {prod.name}
                        </h4>

                        {specialPrice !== undefined && (
                          <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-md">
                            ★ سعر خاص مخصص لك
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and Add button */}
                    <div className="text-left shrink-0">
                      {hasNoPrice ? (
                        <div className="text-center">
                          <span className="text-xs font-bold text-gray-400 block">
                            السعر غير محدد
                          </span>
                          <span className="text-[10px] text-red-500">غير متاح للطلب</span>
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm sm:text-base font-black text-emerald-700">
                            {finalPrice.toLocaleString()} ج.م
                          </div>
                          <span className="text-[10px] text-gray-400">/ كرتونة</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Merchant Action Simulation */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-gray-400">كود: {prod.sku}</span>
                    <button
                      type="button"
                      disabled={hasNoPrice}
                      className="inline-flex items-center gap-1 rounded-xl bg-[#0f2d4a] px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      <span>أضف للسلة</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            هذه نافذة معاينة تجريبية لا تؤثر على حساب التاجر
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
          >
            إغلاق المعاينة
          </button>
        </div>
      </aside>
    </>
  );
}
