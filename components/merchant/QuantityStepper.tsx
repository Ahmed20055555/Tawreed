'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
}: QuantityStepperProps) {
  const handleDec = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && value > min) {
      onChange(value - 1);
    }
  };

  const handleInc = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <button
        type="button"
        onClick={handleDec}
        disabled={disabled || value <= min}
        aria-label="تقليل الكمية"
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-700 shadow-2xs hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <span className="w-8 text-center text-xs font-black text-gray-900 font-mono">
        {value}
      </span>

      <button
        type="button"
        onClick={handleInc}
        disabled={disabled || value >= max}
        aria-label="زيادة الكمية"
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-700 shadow-2xs hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
