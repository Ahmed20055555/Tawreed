'use client';

import React, { useState } from 'react';
import { Link2, Copy, Check, Share2, Sparkles } from 'lucide-react';

interface InviteLinkCardProps {
  supplierSlug?: string;
  supplierName?: string;
}

export function InviteLinkCard({
  supplierSlug = 'ahram-food',
  supplierName = 'شركة الأهرام للصناعات الغذائية',
}: InviteLinkCardProps) {
  const [copied, setCopied] = useState(false);

  // Link format as requested: /join/[supplierSlug]
  const joinUrl = `https://tawreed.com/join/${supplierSlug}`;

  const shareMessage = `مرحباً بك يا فندم! 🛒
ندعوك للربط المباشر مع حساب ${supplierName} على منصة «توريد».
✅ تصفح كتالوج أسعار الجملة المباشرة
✅ استلام العروض والخصومات الفورية
✅ طلب كراتين بأسعار المصنع مع دفع عند الاستلام

اربط محلك معنا الآن بضغطة واحدة:
${joinUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareMessage);
    const waUrl = `https://wa.me/?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-200/90 bg-gradient-to-br from-purple-50/70 via-white to-blue-50/40 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left / Info */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
              <Link2 className="h-4 w-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              رابط الربط الخاص بشركتك
            </h3>
            <span className="rounded-full bg-purple-100 text-purple-700 px-2 py-0.2 text-[10px] font-bold">
              ربط فوري
            </span>
          </div>
          <p className="text-xs text-gray-600 max-w-xl leading-relaxed">
            شارك هذا الرابط مع عملائك وتجار الجملة والتجزئة. بمجرد فتحهم الرابط، يتم ربط حساباتهم بشركتك تلقائياً وتصلهم جميع عروضك ومنتجاتك الجديدة مباشرة.
          </p>
        </div>

        {/* Right / Link Box & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          {/* Link display */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-700 shadow-inner select-all" dir="ltr">
            <span className="truncate max-w-[200px] sm:max-w-[240px]">{joinUrl}</span>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-purple-200 bg-white px-3.5 py-2 text-xs font-bold text-purple-800 hover:bg-purple-50 transition-colors cursor-pointer shadow-xs"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-purple-600" />
                <span>نسخ الرابط</span>
              </>
            )}
          </button>

          {/* WhatsApp Share Button */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white transition-all shadow-xs cursor-pointer active:scale-[0.98]"
          >
            <Share2 className="h-4 w-4" />
            <span>مشاركة عبر واتساب</span>
          </button>
        </div>
      </div>
    </div>
  );
}
