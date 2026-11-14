'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Flame,
  Plus,
  Search,
  PackageCheck,
  TrendingUp,
  ShieldCheck,
  Inbox,
  Filter,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { ClearanceListing, ClearanceFormData, ClearanceStatus } from '@/types/clearance';
import { getClearanceListings, saveClearanceListing } from '@/lib/mock-api';
import { StatCard } from '@/components/clearance/StatCard';
import { ClearanceCard } from '@/components/clearance/ClearanceCard';
import { ClearanceFormModal } from '@/components/clearance/ClearanceFormModal';
import { SupplierHeader } from '@/components/supplier/SupplierHeader';

export default function SupplierClearancePage() {
  const [listings, setListings] = useState<ClearanceListing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<ClearanceListing | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load mock listings
  useEffect(() => {
    const data = getClearanceListings();
    setListings(data);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Stats calculation
  const stats = useMemo(() => {
    const activeCount = listings.filter((l) => l.status === 'active').length;
    const totalSoldCartons = listings.reduce((acc, curr) => acc + curr.soldCartons, 0);
    const savedFromWasteCartons = listings.reduce((acc, curr) => acc + curr.soldCartons, 0);
    // Rough estimate of money saved or preserved
    const rescuedValue = listings.reduce(
      (acc, curr) => acc + curr.soldCartons * curr.clearancePrice,
      0
    );

    return {
      activeCount,
      totalSoldCartons,
      savedFromWasteCartons,
      rescuedValue,
    };
  }, [listings]);

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchSearch =
        searchQuery === '' ||
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        selectedStatus === 'all' || item.status === selectedStatus;

      return matchSearch && matchStatus;
    });
  }, [listings, searchQuery, selectedStatus]);

  // Handle Add or Edit Submit
  const handleFormSubmit = (data: ClearanceFormData) => {
    console.log('[ClearancePage] Form submitted:', data);

    if (editingListing) {
      // Update existing
      const updated = listings.map((l) =>
        l.id === editingListing.id
          ? {
              ...l,
              ...data,
              discountPercentage: Math.round(
                ((data.originalPrice - data.clearancePrice) / data.originalPrice) * 100
              ),
              availableCartons: Math.max(0, data.totalCartons - l.soldCartons),
            }
          : l
      );
      setListings(updated);
      setEditingListing(null);
      showToast(`تم تحديث عرض التصفية "${data.productName}" بنجاح!`);
    } else {
      // Add new
      const discountPercentage = Math.round(
        ((data.originalPrice - data.clearancePrice) / data.originalPrice) * 100
      );
      const newListing: ClearanceListing = {
        id: 'clr_' + Date.now(),
        ...data,
        discountPercentage,
        soldCartons: 0,
        availableCartons: data.totalCartons,
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      saveClearanceListing(newListing);
      setListings([newListing, ...listings]);
      showToast(`تم نشر عرض التصفية "${newListing.productName}" بنجاح!`);
    }
  };

  // Toggle status (active <-> expired / stopped)
  const handleToggleStatus = (id: string) => {
    const updated = listings.map((l) => {
      if (l.id === id) {
        const nextStatus: ClearanceStatus = l.status === 'active' ? 'expired' : 'active';
        return { ...l, status: nextStatus };
      }
      return l;
    });
    setListings(updated);
    showToast('تم تحديث حالة العرض');
  };

  const openCreateModal = () => {
    setEditingListing(null);
    setIsModalOpen(true);
  };

  const openEditModal = (listing: ClearanceListing) => {
    setEditingListing(listing);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-gray-900 flex flex-col font-sans" dir="rtl">
      {/* Toast */}
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
                  <Flame className="h-5 w-5" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  سوق التصفية
                </h1>
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700">
                  جديد
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed">
                اعرض البضاعة قريبة الصلاحية بخصم كبير وبيعها بسرعة للتجار، وتجنب الخسائر مع الحفاظ على دورة رأس المال.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <Link
                href="/merchant/clearance"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                title="تصفح العروض كما يراها أصحاب المحلات والسوبرماركت"
              >
                <Eye className="h-4 w-4 text-slate-500" />
                <span>معاينة واجهة التاجر</span>
              </Link>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f2d4a] px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#163e63] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>إضافة عرض تصفية</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <StatCard
            title="عروض نشطة"
            value={`${stats.activeCount} عروض`}
            subtitle="معروضة حالياً لجميع التجار المسجلين"
            icon={Flame}
            colorScheme="purple"
          />

          <StatCard
            title="كميات تم بيعها"
            value={`${stats.totalSoldCartons} كرتونة`}
            subtitle="تم تصريفها بنجاح عبر المنصة"
            icon={TrendingUp}
            colorScheme="blue"
          />

          <StatCard
            title="بضاعة تم إنقاذها من التلف"
            value={`${stats.rescuedValue.toLocaleString()} ج.م`}
            subtitle="قيمة البضائع التي تم تصريفها قبل انتهاء صلاحيتها"
            icon={ShieldCheck}
            colorScheme="emerald"
          />
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث باسم المنتج، الصنف أو البراند..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-slate-50/70 pr-10 pl-4 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-purple-600 focus:outline-none transition-all"
              />
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'active', label: 'نشط' },
                { id: 'expired', label: 'منتهي / متوقف' },
                { id: 'sold_out', label: 'تم بيعه بالكامل' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setSelectedStatus(chip.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedStatus === chip.id
                      ? 'bg-[#0f2d4a] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredListings.map((item) => (
              <ClearanceCard
                key={item.id}
                listing={item}
                mode="supplier"
                onEdit={openEditModal}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        ) : (
          /* Friendly Empty State */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Inbox className="h-7 w-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              لا توجد عروض تصفية مطابقة
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
              لم نجد عروضاً تتطابق مع معايير البحث الحالية. يمكنك إضافة عرض جديد أو إعادة ضبط الفلاتر.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0f2d4a] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#163e63] transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>إضافة أول عرض تصفية</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Add / Edit Clearance Modal */}
      <ClearanceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingListing}
      />
    </div>
  );
}
