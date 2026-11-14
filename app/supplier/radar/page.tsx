'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Radar,
  Store,
  Users,
  Send,
  MapPin,
  List,
  Map as MapIcon,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { StoreLocation, StoreFilterState } from '@/types/store';
import { getStoresRadar, markStoreAsInvited } from '@/lib/mock-api';
import { StatCard } from '@/components/clearance/StatCard';
import { StoreMap } from '@/components/radar/StoreMap';
import { StoreList } from '@/components/radar/StoreList';
import { RadarFilters } from '@/components/radar/RadarFilters';
import { InviteModal } from '@/components/radar/InviteModal';
import { SupplierHeader } from '@/components/supplier/SupplierHeader';

export default function SupplierRadarPage() {
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(null);
  const [invitingStore, setInvitingStore] = useState<StoreLocation | null>(null);
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<StoreFilterState>({
    type: 'الكل',
    area: 'الكل',
    status: 'الكل',
    maxDistance: 25,
    searchQuery: '',
  });

  // Load stores from mock API
  useEffect(() => {
    const data = getStoresRadar();
    setStores(data);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Unique areas list for filter dropdown
  const areasList = useMemo(() => {
    const set = new Set<string>();
    stores.forEach((s) => set.add(s.area));
    return Array.from(set);
  }, [stores]);

  // Filter stores
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      // Type
      const matchType = filters.type === 'الكل' || store.type === filters.type;

      // Area
      const matchArea = filters.area === 'الكل' || store.area === filters.area;

      // Status
      let matchStatus = true;
      if (filters.status === 'registered') {
        matchStatus = store.status === 'registered';
      } else if (filters.status === 'unregistered') {
        matchStatus = store.status === 'unregistered' && !store.invited;
      } else if (filters.status === 'invited') {
        matchStatus = !!store.invited;
      }

      // Distance
      const matchDistance = store.distanceKm <= filters.maxDistance;

      // Search Query
      const q = filters.searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        store.name.toLowerCase().includes(q) ||
        store.ownerName.toLowerCase().includes(q) ||
        store.area.toLowerCase().includes(q) ||
        store.addressDetails.toLowerCase().includes(q);

      return matchType && matchArea && matchStatus && matchDistance && matchQuery;
    });
  }, [stores, filters]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = stores.length;
    const registered = stores.filter((s) => s.status === 'registered').length;
    const invited = stores.filter((s) => s.invited).length;
    const unregistered = total - registered;

    return {
      total,
      registered,
      unregistered,
      invited,
    };
  }, [stores]);

  // Handle invitation sent
  const handleInviteSent = (storeId: string) => {
    console.log('[RadarPage] Store invited:', storeId);
    markStoreAsInvited(storeId);
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, invited: true } : s))
    );
    showToast('تم إرسال الدعوة بنجاح وتحديث حالة المحل');
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

      {/* Shared Header */}
      <SupplierHeader />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Page Title & Subtitle */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <Radar className="h-5 w-5" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  رادار المحلات
                </h1>
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700">
                  جديد
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed">
                اكتشف كل المحلات في منطقتك وادعُ غير المسجلين للانضمام بضغطة واحدة، ووسع شبكة توزيعك جغرافياً.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="إجمالي المحلات في منطقتك"
            value={`${stats.total} محل`}
            subtitle="نطاق محافظة الإسماعيلية"
            icon={Store}
            colorScheme="blue"
          />

          <StatCard
            title="مسجلة على المنصة"
            value={`${stats.registered} محل`}
            subtitle="عملاء نشطون جاهزون للطلب"
            icon={CheckCircle2}
            colorScheme="emerald"
          />

          <StatCard
            title="غير مسجلة بعد"
            value={`${stats.unregistered} محل`}
            subtitle="فرص نمو وتوسّع جديدة"
            icon={MapPin}
            colorScheme="amber"
          />

          <StatCard
            title="دعوات تم إرسالها"
            value={`${stats.invited} دعوة`}
            subtitle="تمت دعوتهم عبر واتساب"
            icon={Send}
            colorScheme="purple"
          />
        </div>

        {/* Filters */}
        <RadarFilters
          filters={filters}
          onChange={setFilters}
          areasList={areasList}
          totalMatches={filteredStores.length}
        />

        {/* Mobile View Toggle Tabs (الخريطة / القائمة) */}
        <div className="flex md:hidden rounded-xl bg-slate-200/80 p-1">
          <button
            type="button"
            onClick={() => setMobileView('map')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              mobileView === 'map'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapIcon className="h-4 w-4" />
            <span>الخريطة التفاعلية</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileView('list')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              mobileView === 'list'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="h-4 w-4" />
            <span>قائمة المحلات ({filteredStores.length})</span>
          </button>
        </div>

        {/* Split Layout: Desktop Map on one side, List on other */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Map Side */}
          <div
            className={`lg:col-span-7 xl:col-span-8 ${
              mobileView === 'map' ? 'block' : 'hidden md:block'
            }`}
          >
            <StoreMap
              stores={filteredStores}
              selectedStore={selectedStore}
              onSelectStore={(store) => {
                setSelectedStore(store);
              }}
              onInviteStore={(store) => {
                setInvitingStore(store);
              }}
            />
          </div>

          {/* List Side */}
          <div
            className={`lg:col-span-5 xl:col-span-4 ${
              mobileView === 'list' ? 'block' : 'hidden md:block'
            }`}
          >
            <div className="mb-2 flex items-center justify-between text-xs text-gray-500 px-1">
              <span>
                تم العثور على <strong className="text-gray-900 font-bold">{filteredStores.length}</strong> محل
              </span>
              <span>انقر لتحديد المحل على الخريطة</span>
            </div>

            <StoreList
              stores={filteredStores}
              selectedStore={selectedStore}
              onSelectStore={(store) => {
                setSelectedStore(store);
                if (window.innerWidth < 768) {
                  setMobileView('map');
                }
              }}
              onInviteStore={(store) => {
                setInvitingStore(store);
              }}
            />
          </div>
        </div>
      </main>

      {/* Invite Modal */}
      <InviteModal
        store={invitingStore}
        isOpen={!!invitingStore}
        onClose={() => setInvitingStore(null)}
        onInviteSent={handleInviteSent}
      />
    </div>
  );
}
