'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Building2,
  Trash2,
  Send,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useMerchant } from '@/context/MerchantContext';
import { CartGroup } from '@/components/merchant/CartGroup';
import { EmptyState } from '@/components/common/EmptyState';
import { CartItem } from '@/types/merchant';

export default function MerchantCartPage() {
  const { cart, suppliers, cartCount } = useMerchant();

  // Group items by supplier
  const groupedItems = useMemo(() => {
    const map = new Map<string, { supplierId: string; supplierName: string; items: CartItem[] }>();

    cart.forEach((item) => {
      if (!map.has(item.supplierId)) {
        map.set(item.supplierId, {
          supplierId: item.supplierId,
          supplierName: item.supplierName,
          items: [],
        });
      }
      map.get(item.supplierId)!.items.push(item);
    });

    return Array.from(map.values());
  }, [cart]);

  const totalCartValue = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-black text-gray-900">سلة طلبات البضائع</h1>
            <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
              {cartCount} كرتونة
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            يتم تجميع طلبيات كل مصنع أو شركة منفصلة لضمان الشحن المباشر وفق الحد الأدنى
          </p>
        </div>

        {cart.length > 0 && (
          <div className="text-left bg-slate-50 border border-slate-100 rounded-xl p-2.5 px-4 self-start sm:self-auto">
            <span className="text-[10px] text-slate-400 block">إجمالي كل الشركات:</span>
            <span className="text-base sm:text-lg font-black text-gray-900 font-mono">
              {totalCartValue.toLocaleString()} ج.م
            </span>
          </div>
        )}
      </div>

      {/* Cart Content */}
      {cart.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="سلة طلباتك فارغة حالياً"
          description="تصفح منتجات الشركات والمصانع المربوطة معك وأضف احتياجات متجرك من البضائع لتصلك في سيارات التوزيع."
          actionText="تصفح كتالوجات الشركات"
          onAction={() => {
            window.location.href = '/merchant/suppliers';
          }}
          badge="ابدأ الطلب الآن"
        />
      ) : (
        <div className="space-y-6">
          {groupedItems.map((group) => {
            const supplierObj = suppliers.find((s) => s.id === group.supplierId);

            return (
              <CartGroup
                key={group.supplierId}
                supplierId={group.supplierId}
                supplierName={group.supplierName}
                items={group.items}
                supplier={supplierObj}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
