'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Package,
  Search,
  Filter,
  Clock,
  RotateCcw,
  Eye,
  CheckCircle2,
  Truck,
  Building2,
  Calendar,
} from 'lucide-react';
import { useMerchant } from '@/context/MerchantContext';
import { MerchantOrder, OrderStatus } from '@/types/merchant';
import { OrderDrawer } from '@/components/merchant/OrderDrawer';
import { EmptyState } from '@/components/common/EmptyState';

export default function MerchantOrdersPage() {
  const { orders, reorder } = useMerchant();

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer state
  const [activeOrder, setActiveOrder] = useState<MerchantOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const statusConfig: Record<OrderStatus, { label: string; bg: string; text: string }> = {
    pending: { label: 'قيد المراجعة', bg: 'bg-amber-100', text: 'text-amber-800' },
    confirmed: { label: 'تم التأكيد', bg: 'bg-blue-100', text: 'text-blue-800' },
    shipping: { label: 'في الطريق', bg: 'bg-purple-100', text: 'text-purple-800' },
    delivered: { label: 'تم التسليم', bg: 'bg-emerald-100', text: 'text-emerald-800' },
    cancelled: { label: 'ملغي', bg: 'bg-rose-100', text: 'text-rose-800' },
  };

  // Suppliers in orders
  const suppliersInOrders = useMemo(() => {
    const map = new Map<string, string>();
    orders.forEach((o) => map.set(o.supplierId, o.supplierName));
    return Array.from(map.entries());
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (selectedStatus !== 'all' && o.status !== selectedStatus) {
        return false;
      }
      if (selectedSupplierId !== 'all' && o.supplierId !== selectedSupplierId) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchNumber = o.orderNumber.toLowerCase().includes(q);
        const matchSupplier = o.supplierName.toLowerCase().includes(q);
        if (!matchNumber && !matchSupplier) return false;
      }
      return true;
    });
  }, [orders, selectedStatus, selectedSupplierId, searchQuery]);

  const handleOpenDrawer = (order: MerchantOrder) => {
    setActiveOrder(order);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-black text-gray-900">سجل الطلبيات</h1>
            <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5">
              {orders.length} طلبية
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            متابعة مراحل تجهيز وشحن طلبيات متجرك من المصانع والموردين
          </p>
        </div>

        <Link
          href="/merchant/suppliers"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f2d4a] hover:bg-blue-900 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors self-start sm:self-auto"
        >
          <Package className="h-3.5 w-3.5" />
          <span>طلب بضاعة جديدة</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          {/* Search */}
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برقم الطلب، اسم الشركة..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-3 pr-9 py-2 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-gray-800 cursor-pointer focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
            >
              <option value="all">كل الحالات</option>
              <option value="pending">قيد المراجعة</option>
              <option value="confirmed">تم التأكيد</option>
              <option value="shipping">في الطريق</option>
              <option value="delivered">تم التسليم</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>

          {/* Supplier Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-gray-800 cursor-pointer focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
            >
              <option value="all">كل الشركات</option>
              {suppliersInOrders.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="لا توجد طلبيات مسجلة"
          description="عندما ترسل طلبيات بضاعة للشركات المربوطة ستظهر هنا بتحديثات لحظية لحالة الشحن والتسليم."
          actionText="تصفح دليل الشركات للطلب"
          onAction={() => {
            window.location.href = '/merchant/suppliers';
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const st = statusConfig[order.status];

            return (
              <div
                key={order.id}
                onClick={() => handleOpenDrawer(order)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-md transition-all cursor-pointer shadow-xs"
              >
                {/* Order header & supplier info */}
                <div className="flex items-start sm:items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0f2d4a] text-white font-bold text-xs shadow-xs">
                    {order.supplierLogo.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-gray-900">
                        {order.orderNumber}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${st.bg} ${st.text}`}>
                        {st.label}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-700 mt-0.5">
                      {order.supplierName}
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{order.date}</span>
                      </span>
                      <span>•</span>
                      <span>{order.items.length} أصناف</span>
                    </div>
                  </div>
                </div>

                {/* Price & Actions */}
                <div
                  className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">الإجمالي:</span>
                    <span className="text-sm sm:text-base font-black text-[#0f2d4a] font-mono">
                      {order.total.toLocaleString()} ج.م
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenDrawer(order)}
                      className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>التفاصيل</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => reorder(order)}
                      title="إضافة كل المنتجات للسلة مجدداً"
                      className="flex items-center gap-1 rounded-xl bg-[#0f2d4a] hover:bg-blue-900 px-3 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">إعادة الطلب</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drawer */}
      <OrderDrawer
        order={activeOrder}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
