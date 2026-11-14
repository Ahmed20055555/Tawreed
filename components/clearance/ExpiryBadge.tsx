import React from 'react';
import { Clock, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ExpiryBadgeProps {
  expiryDateStr: string;
}

export function calculateDaysLeft(expiryDateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(expiryDateStr);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function ExpiryBadge({ expiryDateStr }: ExpiryBadgeProps) {
  const daysLeft = calculateDaysLeft(expiryDateStr);

  if (daysLeft < 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-gray-700">
        <AlertCircle className="h-3 w-3 text-gray-500" />
        <span>منتهي الصلاحية</span>
      </span>
    );
  }

  if (daysLeft <= 7) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-red-700 animate-pulse">
        <AlertTriangle className="h-3 w-3 text-red-600" />
        <span>متبقي {daysLeft === 0 ? 'اليوم فقط' : `${daysLeft} يوم`}</span>
      </span>
    );
  }

  if (daysLeft <= 30) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-amber-700">
        <Clock className="h-3 w-3 text-amber-600" />
        <span>متبقي {daysLeft} يوم</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-emerald-700">
      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
      <span>متبقي {daysLeft} يوم</span>
    </span>
  );
}
