'use client';

import React from 'react';
import { Inbox } from 'lucide-react';
import { StoreLocation } from '@/types/store';
import { StoreCard } from './StoreCard';

interface StoreListProps {
  stores: StoreLocation[];
  selectedStore: StoreLocation | null;
  onSelectStore: (store: StoreLocation) => void;
  onInviteStore: (store: StoreLocation) => void;
}

export function StoreList({
  stores,
  selectedStore,
  onSelectStore,
  onInviteStore,
}: StoreListProps) {
  if (stores.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <Inbox className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-bold text-gray-900">لا توجد محلات مطابقة لمعايير البحث</h4>
        <p className="text-xs text-gray-500 max-w-xs mx-auto">
          جرب توسيع نطاق المسافة أو إلغاء تحديد بعض الفلاتر لعرض مزيد من المحلات.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1 pl-1">
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          isSelected={selectedStore?.id === store.id}
          onSelect={onSelectStore}
          onInvite={onInviteStore}
        />
      ))}
    </div>
  );
}
