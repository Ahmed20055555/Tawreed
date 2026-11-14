'use client';

import React from 'react';
import {
  X,
  Store,
  MapPin,
  Phone,
  Calendar,
  ShoppingCart,
  TrendingUp,
  Clock,
  Send,
  Sparkles,
  FileText,
  Building2,
} from 'lucide-react';
import { LinkedClient } from '@/types/clients';

interface ClientDrawerProps {
  client: LinkedClient | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClientDrawer({ client, isOpen, onClose }: ClientDrawerProps) {
  if (!isOpen || !client) return null;

  // Calculate if joined in the last 7 days
  const isNew = (() => {
    const linkTime = new Date(client.linkedAt).getTime();
    const diffDays = (Date.now() - linkTime) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  })();

  // Format phone for WhatsApp
  const cleanPhone = client.phone.replace(/[^0-9]/g, '');
  const waPhone = cleanPhone.startsWith('0') ? '2' + cleanPhone : cleanPhone;
  const greeting = encodeURIComponent(
    `أهلاً بك يا فندم في ${client.name}، معك شركة الأهرام للصناعات الغذائية عبر منصة توريد. بخصوص آخر عروضنا وأسعار الجملة المتاحة لمتجركم:`
  );
  const waUrl = `https://wa.me/${waPhone}?text=${greeting}`;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Slide-out Drawer */}
      <aside className="fixed inset-y-0 left-0 z-50 w-full sm:w-[460px] bg-white shadow-2xl border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-300 ease-in-out animate-in slide-in-from-left">
        <div>
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white font-black text-sm shadow-xs">
                {client.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold truncate max-w-[240px]">
                    {client.name}
                  </h3>
                  {isNew && (
                    <span className="rounded-full bg-emerald-500 text-white px-2 py-0.2 text-[9px] font-bold">
                      جديد
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300">
                  {client.type} • {client.area}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-4 sm:p-5 space-y-4 max-h-[calc(100vh-160px)] overflow-y-auto">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-0.5">
                <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                  <ShoppingCart className="h-3 w-3 text-slate-400" />
                  <span>الطلبات المسجلة</span>
                </span>
                <div className="text-base font-black text-gray-900">
                  {client.ordersCount > 0 ? `${client.ordersCount} طلب` : 'لا توجد طلبات بعد'}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-0.5">
                <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-slate-400" />
                  <span>إجمالي المسحوبات</span>
                </span>
                <div className="text-base font-black text-emerald-700">
                  {client.totalSpend > 0 ? `${client.totalSpend.toLocaleString()} ج.م` : '0 ج.م'}
                </div>
              </div>
            </div>

            {/* Merchant Details Section */}
            <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5">
              <h4 className="text-xs font-bold text-gray-800 border-b border-slate-200/80 pb-2">
                بيانات التاجر والتواصل
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">اسم المالك / المسؤول:</span>
                  <span className="font-bold text-gray-900">{client.ownerName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">رقم الهاتف / واتساب:</span>
                  <span className="font-mono font-bold text-gray-900" dir="ltr">
                    {client.phone}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">نوع النشاط:</span>
                  <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    {client.type}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">المنطقة والمدينة:</span>
                  <span className="font-bold text-gray-800 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span>{client.area}، {client.city}</span>
                  </span>
                </div>

                {client.addressDetails && (
                  <div className="pt-1 text-[11px] text-gray-600 border-t border-slate-200/60">
                    <span className="text-gray-400 block mb-0.5 font-semibold">العنوان التفصيلي:</span>
                    <span>{client.addressDetails}</span>
                  </div>
                )}
              </div>
            </div>

            {/* History info */}
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-white p-3.5 text-xs">
              <h4 className="font-bold text-gray-800 border-b border-slate-100 pb-2">
                سجل الربط والتفاعل
              </h4>

              <div className="space-y-1.5 text-gray-600">
                <div className="flex items-center justify-between">
                  <span>تاريخ الربط بالشركة:</span>
                  <strong className="text-gray-900">
                    {new Date(client.linkedAt).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </strong>
                </div>

                {client.lastOrderDate && (
                  <div className="flex items-center justify-between">
                    <span>تاريخ آخر طلبية:</span>
                    <strong className="text-emerald-700">{client.lastOrderDate}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Internal Notes */}
            {client.notes && (
              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-3.5 space-y-1 text-xs">
                <span className="font-bold text-amber-900 flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-amber-700" />
                  <span>ملاحظات فريق المبيعات:</span>
                </span>
                <p className="text-[11px] text-amber-900/90 leading-relaxed">{client.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-white transition-colors"
          >
            إغلاق
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-[0.98]"
          >
            <Send className="h-4 w-4" />
            <span>محادثة واتساب مباشرة</span>
          </a>
        </div>
      </aside>
    </>
  );
}
