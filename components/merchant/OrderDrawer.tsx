'use client';

import React from 'react';
import {
  X,
  Package,
  Clock,
  MapPin,
  FileText,
  RotateCcw,
  CheckCircle2,
  Truck,
  Building2,
} from 'lucide-react';
import { MerchantOrder, OrderStatus } from '@/types/merchant';
import { useMerchant } from '@/context/MerchantContext';

interface OrderDrawerProps {
  order: MerchantOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDrawer({ order, isOpen, onClose }: OrderDrawerProps) {
  const { reorder } = useMerchant();

  if (!isOpen || !order) return null;

  const statusConfig: Record<OrderStatus, { label: string; bg: string; text: string; stepIndex: number }> = {
    pending: { label: 'قيد المراجعة', bg: 'bg-amber-100', text: 'text-amber-800', stepIndex: 0 },
    confirmed: { label: 'تم التأكيد', bg: 'bg-blue-100', text: 'text-blue-800', stepIndex: 1 },
    shipping: { label: 'في الطريق', bg: 'bg-purple-100', text: 'text-purple-800', stepIndex: 2 },
    delivered: { label: 'تم التسليم', bg: 'bg-emerald-100', text: 'text-emerald-800', stepIndex: 3 },
    cancelled: { label: 'ملغي', bg: 'bg-rose-100', text: 'text-rose-800', stepIndex: -1 },
  };

  const currentStatus = statusConfig[order.status];

  const steps = [
    { title: 'إرسال الطلب', desc: 'تم استلام الطلبية بنجاح' },
    { title: 'تأكيد المورد', desc: 'تجهيز البضاعة من المستودع' },
    { title: 'في خط التوزيع', desc: 'مع مندوب الشحن' },
    { title: 'تم التسليم والدفع', desc: 'تسليم الفاتورة للتاجر' },
  ];

  const handleReorder = () => {
    reorder(order);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer */}
      <aside className="relative z-10 w-full max-w-md bg-white shadow-2xl flex flex-col justify-between border-r border-slate-200 animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f2d4a] text-white">
                <Package className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">تفاصيل الطلبية</h3>
                <p className="font-mono text-[10px] text-slate-400">{order.orderNumber}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {/* Status & Supplier banner */}
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#0f2d4a]" />
                  <span className="text-xs font-bold text-gray-900">{order.supplierName}</span>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${currentStatus.bg} ${currentStatus.text}`}
                >
                  {currentStatus.label}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                <span>تاريخ الإنشاء:</span>
                <span className="font-medium text-gray-700">{order.date}</span>
              </div>
            </div>

            {/* Timeline */}
            {order.status !== 'cancelled' && (
              <div className="rounded-2xl border border-slate-100 p-3.5 space-y-3">
                <h4 className="text-xs font-bold text-slate-700">مراحل الشحن والتسليم:</h4>

                <div className="space-y-3 pr-2 border-r-2 border-slate-200">
                  {steps.map((step, idx) => {
                    const isPassed = idx <= currentStatus.stepIndex;
                    const isCurrent = idx === currentStatus.stepIndex;

                    return (
                      <div key={step.title} className="relative pr-4">
                        <span
                          className={`absolute -right-[9px] top-1 h-3 w-3 rounded-full border-2 border-white shadow-2xs ${
                            isPassed ? 'bg-emerald-600' : 'bg-slate-300'
                          } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}
                        />
                        <p
                          className={`text-xs font-bold ${
                            isPassed ? 'text-gray-900' : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{step.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700">المنتجات المطلوبة ({order.items.length}):</h4>

              <div className="rounded-xl border border-slate-100 divide-y divide-slate-100 bg-white">
                {order.items.map((item) => (
                  <div key={item.productId} className="p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {item.quantity} × {item.price.toLocaleString()} ج.م ({item.unit})
                      </p>
                    </div>

                    <span className="font-black text-gray-800 font-mono">
                      {(item.quantity * item.price).toLocaleString()} ج.م
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address & notes */}
            <div className="rounded-xl bg-slate-50 p-3 text-[11px] space-y-1.5 border border-slate-100">
              <div className="flex items-start gap-1.5 text-slate-600">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong>العنوان:</strong> {order.deliveryArea} - {order.deliveryAddress}
                </span>
              </div>

              {order.notes && (
                <div className="flex items-start gap-1.5 text-slate-600 pt-1 border-t border-slate-200/60">
                  <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>الملاحظات:</strong> {order.notes}
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="rounded-xl bg-[#0f2d4a]/5 border border-[#0f2d4a]/10 p-3.5 flex items-center justify-between">
              <span className="text-xs font-bold text-[#0f2d4a]">إجمالي قيمة الطلب:</span>
              <span className="text-base font-black text-[#0f2d4a]">
                {order.total.toLocaleString()} ج.م
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
          <button
            type="button"
            onClick={handleReorder}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#0f2d4a] hover:bg-blue-900 py-2.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>إعادة طلب هذه المنتجات</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
