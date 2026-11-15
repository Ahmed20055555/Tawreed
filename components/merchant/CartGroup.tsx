'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Trash2,
  Send,
  AlertCircle,
  CheckCircle2,
  Truck,
  Building2,
  FileText,
} from 'lucide-react';
import { CartItem, Supplier } from '@/types/merchant';
import { useMerchant } from '@/context/MerchantContext';
import { QuantityStepper } from './QuantityStepper';

interface CartGroupProps {
  supplierId: string;
  supplierName: string;
  items: CartItem[];
  supplier?: Supplier;
}

export function CartGroup({ supplierId, supplierName, items, supplier }: CartGroupProps) {
  const { updateQuantity, removeFromCart, submitOrder } = useMerchant();
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const minOrderValue = supplier?.minOrderValue || 2000;
  const isMinMet = subtotal >= minOrderValue;
  const remaining = Math.max(0, minOrderValue - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / minOrderValue) * 100));

  const handleSubmit = async () => {
    if (!isMinMet || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const order = await submitOrder(supplierId, notes);
      if (order) {
        setOrderSuccess(order.orderNumber);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-emerald-950">
          تم إرسال طلبيتك إلى {supplierName} بنجاح!
        </h3>
        <p className="text-xs text-emerald-800">
          رقم الطلب: <span className="font-mono font-black">{orderSuccess}</span>
        </p>
        <div className="pt-2 flex items-center justify-center gap-2">
          <Link
            href="/merchant/orders"
            className="rounded-xl bg-emerald-700 text-white px-4 py-2 text-xs font-bold hover:bg-emerald-800 transition-colors"
          >
            متابعة الطلب في قائمة طلباتي
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0f2d4a] text-white font-black text-sm">
            {supplierName.charAt(0)}
          </div>
          <div>
            <Link
              href={`/merchant/suppliers/${supplierId}`}
              className="text-xs sm:text-sm font-bold text-gray-900 hover:text-blue-700 transition-colors"
            >
              {supplierName}
            </Link>
            <p className="text-[10px] text-slate-400">
              الحد الأدنى للطلبية: <span className="font-bold text-gray-700">{minOrderValue.toLocaleString()} ج.م</span>
            </p>
          </div>
        </div>

        {/* Min Order Progress */}
        <div className="sm:text-left min-w-[200px]">
          <div className="flex items-center justify-between sm:justify-end gap-2 text-[11px] mb-1">
            {isMinMet ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>تم استيفاء الحد الأدنى للطلب</span>
              </span>
            ) : (
              <span className="text-amber-700 font-bold flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                <span>باقي {remaining.toLocaleString()} ج.م للحد الأدنى</span>
              </span>
            )}
            <span className="font-mono text-slate-400 text-[10px]">{progressPercent}%</span>
          </div>

          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isMinMet ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-slate-100 p-4">
        {items.map((item) => {
          const itemTotal = item.price * item.quantity;

          return (
            <div
              key={item.productId}
              className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                  {item.name}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                  <span>{item.unit}</span>
                  <span>•</span>
                  <span className="font-semibold text-gray-700">
                    {item.price.toLocaleString()} ج.م / وحدة
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <QuantityStepper
                  value={item.quantity}
                  onChange={(q) => updateQuantity(item.productId, q)}
                  min={1}
                />

                <div className="text-left min-w-[80px]">
                  <span className="text-xs sm:text-sm font-black text-gray-900 block font-mono">
                    {itemTotal.toLocaleString()} ج.م
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.productId)}
                  aria-label="حذف من السلة"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes & Checkout Box */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
            <FileText className="h-3 w-3 text-slate-400" />
            <span>ملاحظات خاصة بمندوب {supplierName} (اختياري):</span>
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="مثال: يرجى التوصيل قبل الساعة 2 ظهراً أو الاتصال مسبقاً"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-[#0f2d4a] focus:outline-none"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 block">إجمالي طلبية هذه الشركة:</span>
            <span className="text-base sm:text-xl font-black text-gray-900">
              {subtotal.toLocaleString()} ج.م
            </span>
          </div>

          <button
            type="button"
            disabled={!isMinMet || isSubmitting}
            onClick={handleSubmit}
            className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer ${
              isMinMet
                ? 'bg-[#0f2d4a] hover:bg-blue-900 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="h-4 w-4" />
            <span>{isSubmitting ? 'جاري الإرسال...' : `إرسال الطلب إلى ${supplierName}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
