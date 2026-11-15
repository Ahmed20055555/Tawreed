'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  Check,
  ExternalLink,
  Flame,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Megaphone,
} from 'lucide-react';
import { useMerchant } from '@/context/MerchantContext';
import { FeedUpdate } from '@/types/merchant';

export function NotificationBell() {
  const { feed, unreadCount, markRead, markAllRead, linkedSuppliers } = useMerchant();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter latest updates from linked suppliers
  const linkedIds = new Set(linkedSuppliers.map((s) => s.id));
  const relevantUpdates = feed.filter((u) => linkedIds.has(u.supplierId)).slice(0, 5);

  const getIcon = (type: FeedUpdate['type']) => {
    switch (type) {
      case 'new_product':
        return <Sparkles className="h-3.5 w-3.5 text-blue-600" />;
      case 'offer':
        return <Flame className="h-3.5 w-3.5 text-amber-600" />;
      case 'price_change':
        return <TrendingDown className="h-3.5 w-3.5 text-emerald-600" />;
      case 'announcement':
      default:
        return <Megaphone className="h-3.5 w-3.5 text-purple-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="الإشعارات والتحديثات"
        className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
      >
        <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-[#0f2d4a]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] sm:h-5 sm:min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] sm:text-[10px] font-black text-white shadow-sm animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 text-right">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-900">آخر تحديثات الشركات</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-100 px-1.5 py-0.2 text-[10px] font-bold text-blue-700">
                  {unreadCount} جديد
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <Check className="h-3 w-3" />
                <span>تحديد الكل كمقروء</span>
              </button>
            )}
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {relevantUpdates.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                لا توجد تحديثات جديدة حالياً
              </div>
            ) : (
              relevantUpdates.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    markRead(item.id);
                  }}
                  className={`flex items-start gap-2.5 p-2 rounded-xl transition-all cursor-pointer ${
                    !item.isRead ? 'bg-blue-50/60 hover:bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 shadow-2xs mt-0.5">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[10px] font-bold text-slate-500 truncate">
                        {item.supplierName}
                      </span>
                      <span className="text-[9px] text-slate-400 shrink-0">{item.publishedAt}</span>
                    </div>

                    <p className="text-xs font-bold text-gray-900 leading-snug line-clamp-1">
                      {item.title}
                    </p>

                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  {!item.isRead && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-center">
            <Link
              href="/merchant"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-[#0f2d4a] hover:text-blue-700 flex items-center gap-1 py-1"
            >
              <span>عرض كل التحديثات في الرئيسية</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
