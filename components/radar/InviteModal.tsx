'use client';

import React, { useState } from 'react';
import { X, Send, Copy, Check, MessageSquare, Phone, Store } from 'lucide-react';
import { StoreLocation } from '@/types/store';

interface InviteModalProps {
  store: StoreLocation | null;
  isOpen: boolean;
  onClose: () => void;
  onInviteSent: (storeId: string) => void;
}

export function InviteModal({
  store,
  isOpen,
  onClose,
  onInviteSent,
}: InviteModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !store) return null;

  const defaultMessage = `مرحباً بك يا فندم في ${store.name} 🛒
يسرّنا في منصة «توريد» دعوتكم للاطلاع على كتالوج أسعار الجملة المباشرة من كبرى مصانع وشركات الأغذية والمشروبات في منطقة ${store.area}.
📦 طلب فوري بأسعار المصنع
🚚 توصيل حتى باب المحل
💰 الدفع عند الاستلام بعد المعاينة

سجّل محلك الآن مجاناً عبر الرابط:
https://tawreed.com/register/merchant?ref=${store.id}`;

  const [message, setMessage] = useState(defaultMessage);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    onInviteSent(store.id);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    // Format phone number for WhatsApp (Egyptian numbers)
    let cleanPhone = store.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '2' + cleanPhone;
    }
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(waUrl, '_blank');
    onInviteSent(store.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-slate-50/80 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                دعوة الانضمام لمنصة توريد
              </h3>
              <p className="text-[11px] text-gray-500">
                إرسال رسالة دعوة خاصة إلى: <strong>{store.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Store Quick Info */}
        <div className="p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-gray-500 font-medium">المالك / المسؤول:</span>
              <p className="font-bold text-gray-900">{store.ownerName}</p>
            </div>
            <div className="space-y-0.5 text-left">
              <span className="text-gray-500 font-medium">رقم الهاتف:</span>
              <p className="font-mono font-bold text-gray-900" dir="ltr">
                {store.phone}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              نص رسالة الدعوة (يمكنك تعديله قبل الإرسال):
            </label>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs sm:text-sm text-gray-900 leading-relaxed focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 px-4 text-xs font-bold text-white hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-xs"
            >
              <Send className="h-4 w-4" />
              <span>إرسال عبر واتساب</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-4 text-xs font-bold text-gray-700 hover:bg-slate-100 active:scale-[0.98] transition-all"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-700">تم نسخ الرسالة!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-gray-500" />
                  <span>نسخ الرسالة</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
