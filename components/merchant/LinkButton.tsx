'use client';

import React, { useState } from 'react';
import { Check, Link2, Unlink, AlertTriangle } from 'lucide-react';
import { useMerchant } from '@/context/MerchantContext';
import { Supplier } from '@/types/merchant';

interface LinkButtonProps {
  supplier: Supplier;
  compact?: boolean;
}

export function LinkButton({ supplier, compact = false }: LinkButtonProps) {
  const { isLinked, link, unlink } = useMerchant();
  const linked = isLinked(supplier.id);
  const [showConfirmUnlink, setShowConfirmUnlink] = useState(false);

  const handleLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    link(supplier.id);
  };

  const handleUnlinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmUnlink(true);
  };

  const confirmUnlink = (e: React.MouseEvent) => {
    e.stopPropagation();
    unlink(supplier.id);
    setShowConfirmUnlink(false);
  };

  const cancelUnlink = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmUnlink(false);
  };

  if (showConfirmUnlink) {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1.5 p-1 bg-rose-50 rounded-xl border border-rose-200 text-xs animate-in fade-in"
      >
        <span className="text-[10px] font-bold text-rose-700 px-1">تأكيد إلغاء الربط؟</span>
        <button
          type="button"
          onClick={confirmUnlink}
          className="px-2 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700 cursor-pointer"
        >
          نعم
        </button>
        <button
          type="button"
          onClick={cancelUnlink}
          className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[10px] font-bold hover:bg-slate-50 cursor-pointer"
        >
          إلغاء
        </button>
      </div>
    );
  }

  if (linked) {
    return (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1.5 text-xs font-bold">
          <Check className="h-3.5 w-3.5 text-emerald-600" />
          <span>تم الربط</span>
        </span>

        <button
          type="button"
          onClick={handleUnlinkClick}
          title="إلغاء الربط مع الشركة"
          className="flex items-center justify-center h-8 w-8 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
        >
          <Unlink className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLink}
      className={`flex items-center justify-center gap-1.5 rounded-xl bg-[#0f2d4a] hover:bg-blue-900 text-white font-bold transition-all shadow-xs cursor-pointer ${
        compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-xs sm:text-sm'
      }`}
    >
      <Link2 className="h-3.5 w-3.5" />
      <span>ربط مع الشركة</span>
    </button>
  );
}
