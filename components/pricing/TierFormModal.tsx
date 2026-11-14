'use client';

import React, { useState, useEffect } from 'react';
import { X, Layers, AlertCircle, Check } from 'lucide-react';
import { PriceTier, TierColor } from '@/types/pricing';

interface TierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tierData: Omit<PriceTier, 'createdAt' | 'merchantsCount'>) => void;
  initialData?: PriceTier | null;
}

const COLOR_OPTIONS: { id: TierColor; label: string; bg: string; border: string }[] = [
  { id: 'blue', label: 'أزرق (جملة)', bg: 'bg-blue-600', border: 'border-blue-600' },
  { id: 'emerald', label: 'أخضر (نص جملة)', bg: 'bg-emerald-600', border: 'border-emerald-600' },
  { id: 'purple', label: 'بنفسجي (سلاسل وهايبر)', bg: 'bg-purple-600', border: 'border-purple-600' },
  { id: 'amber', label: 'برتقالي (قطاعي/مفرق)', bg: 'bg-amber-600', border: 'border-amber-600' },
  { id: 'rose', label: 'وردي (عروض خاصة)', bg: 'bg-rose-600', border: 'border-rose-600' },
  { id: 'indigo', label: 'نيلي (موزعين)', bg: 'bg-indigo-600', border: 'border-indigo-600' },
];

export function TierFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: TierFormModalProps) {
  const [name, setName] = useState('');
  const [colorTag, setColorTag] = useState<TierColor>('blue');
  const [minOrderValue, setMinOrderValue] = useState<string>('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setColorTag(initialData.colorTag);
      setMinOrderValue(initialData.minOrderValue ? String(initialData.minOrderValue) : '');
      setDescription(initialData.description || '');
    } else {
      setName('');
      setColorTag('blue');
      setMinOrderValue('3000');
      setDescription('');
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('يرجى كتابة اسم الشريحة السعرية');
      return;
    }

    const payload = {
      id: initialData ? initialData.id : 'tier_' + Date.now(),
      name: name.trim(),
      colorTag,
      minOrderValue: minOrderValue ? Number(minOrderValue) : undefined,
      description: description.trim(),
    };

    console.log('[TierFormModal] Submitted tier:', payload);
    // TODO(backend): replace with real API call
    onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-slate-50/80 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f2d4a] text-white shadow-xs">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                {initialData ? 'تعديل الشريحة السعرية' : 'إضافة شريحة سعرية جديدة'}
              </h3>
              <p className="text-xs text-gray-500">
                حدد فئة التجار وأقل حد للطلب واللون المميز
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Tier Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              اسم الشريحة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="مثال: شريحة تجار الجملة، شريحة نص جملة، VIP"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:border-[#0f2d4a] focus:outline-none"
            />
          </div>

          {/* Color Tag Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              اللون المميز للشريحة
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COLOR_OPTIONS.map((c) => {
                const isSelected = colorTag === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColorTag(c.id)}
                    className={`flex items-center gap-2 rounded-xl p-2.5 border text-xs font-bold transition-all ${
                      isSelected
                        ? `${c.border} bg-slate-50 ring-2 ring-offset-1 ring-[#0f2d4a]`
                        : 'border-gray-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`h-4 w-4 rounded-full ${c.bg} shrink-0`} />
                    <span className="text-gray-800 text-[11px] truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Min Order Value */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              الحد الأدنى لقيمة الطلب (بالجنيه) - اختياري
            </label>
            <input
              type="number"
              placeholder="مثال: 5000 (اتركه فارغاً إذا لم يكن هناك حد أدنى)"
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:border-[#0f2d4a] focus:outline-none"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              لن يتمكن التاجر المندرِج تحت هذه الشريحة من إرسال طلب بأقل من هذا المبلغ.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              وصف الشريحة وشروطها (اختياري)
            </label>
            <textarea
              rows={3}
              placeholder="مثال: مخصصة للمحلات التي يتجاوز مسحوباتها 50 ألف جنيه شهرياً..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:border-[#0f2d4a] focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#0f2d4a] px-5 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#163e63] transition-colors shadow-sm"
            >
              {initialData ? 'حفظ التعديلات' : 'إنشاء الشريحة الآن'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
