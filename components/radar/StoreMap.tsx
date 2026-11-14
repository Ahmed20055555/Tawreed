'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { StoreLocation } from '@/types/store';
import { MapPin, Loader2 } from 'lucide-react';

interface StoreMapProps {
  stores: StoreLocation[];
  selectedStore: StoreLocation | null;
  onSelectStore: (store: StoreLocation) => void;
  onInviteStore: (store: StoreLocation) => void;
}

const StoreMapClient = dynamic(() => import('./StoreMapLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-[380px] sm:h-[600px] rounded-2xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 text-[#0f2d4a] animate-spin" />
      <span className="text-xs sm:text-sm font-bold text-gray-600">
        جاري تحميل خريطة رادار المحلات...
      </span>
    </div>
  ),
});

export function StoreMap(props: StoreMapProps) {
  return <StoreMapClient {...props} />;
}
