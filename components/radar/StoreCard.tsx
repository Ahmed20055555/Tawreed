'use client';

import React from 'react';
import {
  Store,
  MapPin,
  Phone,
  Navigation,
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { StoreLocation } from '@/types/store';

interface StoreCardProps {
  store: StoreLocation;
  isSelected?: boolean;
  onSelect?: (store: StoreLocation) => void;
  onInvite?: (store: StoreLocation) => void;
}

export function StoreCard({
  store,
  isSelected,
  onSelect,
  onInvite,
}: StoreCardProps) {
  const isRegistered = store.status === 'registered';
  const isInvited = store.invited;

  return (
    <div
      onClick={() => onSelect?.(store)}
      className={`relative rounded-2xl border p-3.5 sm:p-4 transition-all cursor-pointer ${
        isSelected
          ? 'border-[#0f2d4a] bg-blue-50/40 shadow-sm ring-1 ring-[#0f2d4a]'
          : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Store Icon & Info */}
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold shadow-xs ${
              isRegistered
                ? 'bg-emerald-600 text-white'
                : isInvited
                ? 'bg-purple-100 text-purple-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Store className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                {store.type}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                <Navigation className="h-2.5 w-2.5" />
                <span>{store.distanceKm} كم</span>
              </span>
            </div>

            <h4 className="mt-1 text-sm sm:text-base font-bold text-gray-900 truncate">
              {store.name}
            </h4>

            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
              <span className="truncate">{store.area} • {store.addressDetails}</span>
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="shrink-0">
          {isRegistered ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] sm:text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>مسجل</span>
            </span>
          ) : isInvited ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-1 text-[10px] sm:text-xs font-bold text-purple-700">
              <Clock className="h-3.5 w-3.5 text-purple-600" />
              <span>تمت دعوته</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-[10px] sm:text-xs font-bold text-slate-600">
              <span>غير مسجل</span>
            </span>
          )}
        </div>
      </div>

      {/* Footer Details & Action */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
        <div className="text-[11px] text-gray-500">
          المالك: <strong className="text-gray-800">{store.ownerName}</strong>
        </div>

        <div>
          {!isRegistered ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onInvite?.(store);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f2d4a] hover:bg-[#163e63] text-white px-3 py-1.5 text-xs font-bold transition-all shadow-xs"
            >
              <Send className="h-3 w-3" />
              <span>{isInvited ? 'إعادة إرسال دعوة' : 'إرسال دعوة'}</span>
            </button>
          ) : (
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {store.ordersCount ? `${store.ordersCount} طلب سابق` : 'جاهز للطلب'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
