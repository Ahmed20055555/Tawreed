'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  Eye,
  CheckCircle2,
  TableProperties,
  Users,
  Sparkles,
  Inbox,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { PriceTier, TierProduct, PricingMerchant } from '@/types/pricing';
import {
  getPriceTiers,
  savePriceTier,
  deletePriceTier,
  getTierProducts,
  saveTierProducts,
  getPricingMerchants,
  updateMerchantTier,
  bulkAssignMerchantsToTier,
  updateMerchantSpecialPrice,
} from '@/lib/mock-api';
import { DEFAULT_PRICE_TIERS } from '@/data/pricing-mock';
import { TierCard } from '@/components/pricing/TierCard';
import { TierFormModal } from '@/components/pricing/TierFormModal';
import { PriceTable } from '@/components/pricing/PriceTable';
import { MerchantTierTable } from '@/components/pricing/MerchantTierTable';
import { MerchantPreviewDrawer } from '@/components/pricing/MerchantPreviewDrawer';
import { SupplierHeader } from '@/components/supplier/SupplierHeader';

export default function PriceTiersPage() {
  const [activeTab, setActiveTab] = useState<'tiers' | 'prices' | 'merchants'>('tiers');
  const [tiers, setTiers] = useState<PriceTier[]>([]);
  const [products, setProducts] = useState<TierProduct[]>([]);
  const [merchants, setMerchants] = useState<PricingMerchant[]>([]);

  // Modals & Drawers state
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<PriceTier | null>(null);
  const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load data from mock-api
  useEffect(() => {
    setTiers(getPriceTiers());
    setProducts(getTierProducts());
    setMerchants(getPricingMerchants());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Merchants count per tier
  const tierMerchantsCount = useMemo(() => {
    const counts: Record<string, number> = {};
    merchants.forEach((m) => {
      if (m.tierId) {
        counts[m.tierId] = (counts[m.tierId] || 0) + 1;
      }
    });
    return counts;
  }, [merchants]);

  // Unassigned merchants count
  const unassignedCount = useMemo(() => {
    return merchants.filter((m) => !m.tierId).length;
  }, [merchants]);

  // Handle Save / Edit Tier
  const handleSaveTier = (tierData: Omit<PriceTier, 'createdAt' | 'merchantsCount'>) => {
    console.log('[PriceTiersPage] Saving tier:', tierData);
    const fullTier: PriceTier = {
      ...tierData,
      createdAt: editingTier?.createdAt || new Date().toISOString().split('T')[0],
      merchantsCount: tierMerchantsCount[tierData.id] || 0,
    };

    const updatedTiers = savePriceTier(fullTier, tiers);
    setTiers(updatedTiers);
    setEditingTier(null);
    showToast(`تم حفظ الشريحة "${fullTier.name}" بنجاح!`);
  };

  // Handle Delete Tier with confirmation
  const handleDeleteTier = (tierId: string, tierName: string) => {
    const assignedCount = tierMerchantsCount[tierId] || 0;
    const warningMsg =
      assignedCount > 0
        ? `تنبيه: هناك ${assignedCount} محل مسكنين حالياً على هذه الشريحة.\nهل أنت متأكد من حذف الشريحة "${tierName}"؟ سيتم تحويل المحلات إلى (بدون شريحة).`
        : `هل أنت متأكد من حذف الشريحة "${tierName}"؟`;

    if (confirm(warningMsg)) {
      const updatedTiers = deletePriceTier(tierId, tiers);
      setTiers(updatedTiers);

      // Unassign merchants that were in this tier
      const updatedMerchants = merchants.map((m) =>
        m.tierId === tierId ? { ...m, tierId: null } : m
      );
      setMerchants(updatedMerchants);

      showToast(`تم حذف شريحة "${tierName}" بنجاح`);
    }
  };

  // Handle Restore Default Tiers if empty
  const handleRestoreDefaultTiers = () => {
    DEFAULT_PRICE_TIERS.forEach((t) => savePriceTier(t));
    setTiers(DEFAULT_PRICE_TIERS);
    showToast('تم إنشاء الشرائح الأربع الافتراضية بنجاح!');
  };

  // Handle Save Products Prices from PriceTable
  const handleSaveProducts = (updatedProducts: TierProduct[]) => {
    saveTierProducts(updatedProducts);
    setProducts(updatedProducts);
    showToast('تم حفظ وتحديث أسعار الشرائح بنجاح!');
  };

  // Merchant Tier Updates
  const handleUpdateMerchantTier = (merchantId: string, tierId: string | null) => {
    const updated = updateMerchantTier(merchantId, tierId, merchants);
    setMerchants(updated);
    showToast('تم تحديث شريحة التاجر بنجاح');
  };

  const handleBulkAssignTier = (merchantIds: string[], tierId: string | null) => {
    const updated = bulkAssignMerchantsToTier(merchantIds, tierId, merchants);
    setMerchants(updated);
    showToast(`تم تسكين ${merchantIds.length} محلات بنجاح!`);
  };

  const handleUpdateSpecialPrice = (merchantId: string, productId: string, price: number | null) => {
    const updated = updateMerchantSpecialPrice(merchantId, productId, price, merchants);
    setMerchants(updated);
    showToast('تم تحديث السعر الخاص للتاجر');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-gray-900 flex flex-col font-sans" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs sm:text-sm text-white shadow-xl animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Shared Supplier Header */}
      <SupplierHeader />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <Layers className="h-5 w-5" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  شرائح الأسعار (Price Tiers)
                </h1>
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700">
                  جديد
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed">
                حدد أسعاراً مخصصة لكل فئة من التجار (جملة، نص جملة، مفرق، سلاسل)، وسيرى كل تاجر فقط السعر المخصص لشريحته.
              </p>
            </div>

            {/* Action Buttons: Preview as Merchant + Add Tier */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={() => setIsPreviewDrawerOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-2.5 text-xs font-bold text-purple-800 hover:bg-purple-100 transition-colors shadow-xs cursor-pointer"
                title="افتح الكتالوج وشاهده كما يراه التاجر تماماً"
              >
                <Eye className="h-4 w-4 text-purple-600" />
                <span>معاينة كتاجر</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingTier(null);
                  setIsTierModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f2d4a] px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#163e63] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>إضافة شريحة جديدة</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs (3 Tabs) */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('tiers')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'tiers'
                  ? 'bg-[#0f2d4a] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>الشرائح ({tiers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('prices')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'prices'
                  ? 'bg-[#0f2d4a] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <TableProperties className="h-4 w-4" />
              <span>جدول أسعار المنتجات ({products.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('merchants')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'merchants'
                  ? 'bg-[#0f2d4a] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>تسكين التجار ({merchants.length})</span>
              {unassignedCount > 0 && (
                <span className="rounded-full bg-amber-500 text-white px-2 py-0.2 text-[10px] font-bold">
                  {unassignedCount} بدون شريحة
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: الشرائح (Tiers) */}
        {activeTab === 'tiers' && (
          <div>
            {tiers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {tiers.map((tier) => (
                  <TierCard
                    key={tier.id}
                    tier={tier}
                    merchantsCount={tierMerchantsCount[tier.id] || 0}
                    onEdit={(t) => {
                      setEditingTier(t);
                      setIsTierModalOpen(true);
                    }}
                    onDelete={handleDeleteTier}
                  />
                ))}
              </div>
            ) : (
              /* Empty state when no tiers */
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <Inbox className="h-7 w-7" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  لا توجد شرائح أسعار حتى الآن
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                  قم بإنشاء شرائحك الأولى لتبدأ في تقديم أسعار مختلفة للمحلات والهايبر ماركت وتجار الجملة.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={handleRestoreDefaultTiers}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-purple-700 transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>إنشاء الشرائح الأربع الافتراضية بضغطة واحدة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingTier(null);
                      setIsTierModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>إنشاء شريحة مخصصة</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: أسعار المنتجات (Product Prices Spreadsheet Table) */}
        {activeTab === 'prices' && (
          <PriceTable
            tiers={tiers}
            products={products}
            onSaveProducts={handleSaveProducts}
          />
        )}

        {/* TAB 3: التجار (Merchants Assignment) */}
        {activeTab === 'merchants' && (
          <MerchantTierTable
            merchants={merchants}
            tiers={tiers}
            products={products}
            onUpdateMerchantTier={handleUpdateMerchantTier}
            onBulkAssignTier={handleBulkAssignTier}
            onUpdateSpecialPrice={handleUpdateSpecialPrice}
          />
        )}
      </main>

      {/* Tier Form Modal */}
      <TierFormModal
        isOpen={isTierModalOpen}
        onClose={() => setIsTierModalOpen(false)}
        onSubmit={handleSaveTier}
        initialData={editingTier}
      />

      {/* Merchant Preview Drawer */}
      <MerchantPreviewDrawer
        isOpen={isPreviewDrawerOpen}
        onClose={() => setIsPreviewDrawerOpen(false)}
        merchants={merchants}
        tiers={tiers}
        products={products}
      />
    </div>
  );
}
