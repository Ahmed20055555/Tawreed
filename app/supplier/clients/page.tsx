'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  ShoppingCart,
  Clock,
  Sparkles,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { LinkedClient } from '@/types/clients';
import { getClients } from '@/lib/mock-api';
import { StatCard } from '@/components/clearance/StatCard';
import { InviteLinkCard } from '@/components/clients/InviteLinkCard';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { ClientDrawer } from '@/components/clients/ClientDrawer';
import { EmptyState } from '@/components/common/EmptyState';
import { SupplierHeader } from '@/components/supplier/SupplierHeader';

export default function SupplierClientsPage() {
  const [clients, setClients] = useState<LinkedClient[]>([]);
  const [selectedClient, setSelectedClient] = useState<LinkedClient | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setClients(getClients());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 4 Stats Calculations
  const stats = useMemo(() => {
    const total = clients.length;
    // New clients this week (last 7 days)
    const sevenDaysAgo = Date.now() - 7 * 86400000;
    const newThisWeek = clients.filter((c) => new Date(c.linkedAt).getTime() >= sevenDaysAgo).length;
    const orderedCount = clients.filter((c) => c.ordersCount > 0).length;
    const neverOrderedCount = clients.filter((c) => c.ordersCount === 0).length;

    return {
      total,
      newThisWeek,
      orderedCount,
      neverOrderedCount,
    };
  }, [clients]);

  const handleRowClick = (client: LinkedClient) => {
    setSelectedClient(client);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-gray-900 flex flex-col font-sans" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs sm:text-sm text-white shadow-xl animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Shared Supplier Header */}
      <SupplierHeader />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <StatCard
            title="إجمالي العملاء"
            value={`${stats.total} تاجر`}
            subtitle="مربوطين رسمياً بحساب شركتك"
            icon={Users}
            colorScheme="blue"
          />

          <StatCard
            title="عملاء جدد هذا الأسبوع"
            value={`${stats.newThisWeek} عميل`}
            subtitle="انضموا خلال آخر 7 أيام"
            icon={UserPlus}
            colorScheme="purple"
            badge="نشاط متصاعد"
          />

          <StatCard
            title="عملاء طلبوا فعلاً"
            value={`${stats.orderedCount} تاجر`}
            subtitle="أصدروا طلبيات سابقة"
            icon={ShoppingCart}
            colorScheme="emerald"
          />

          <StatCard
            title="عملاء لم يطلبوا بعد"
            value={`${stats.neverOrderedCount} تاجر`}
            subtitle="فرص ترويجية تحتاج لتنشيط"
            icon={Clock}
            colorScheme="amber"
          />
        </div>

        {/* Invite Link Card */}
        <InviteLinkCard supplierSlug="ahram-food" />

        {/* Clients Table or Empty State */}
        {clients.length > 0 ? (
          <ClientsTable
            clients={clients}
            onSelectClient={handleRowClick}
          />
        ) : (
          <EmptyState
            icon={Users}
            title="لا يوجد عملاء مربوطين حتى الآن"
            description="شارك رابط الربط الخاص بشركتك عبر واتساب ليقوم أصحاب السوبر ماركت والمحلات بالربط وتصفح بضاعتك فوراً."
            actionText="مشاركة رابط الربط"
            onAction={() => {
              const waUrl = `https://wa.me/?text=${encodeURIComponent(
                'ندعوك للربط مع حساب شركة الأهرام للصناعات الغذائية عبر منصة توريد: https://tawreed.com/join/ahram-food'
              )}`;
              window.open(waUrl, '_blank');
            }}
          />
        )}
      </main>

      {/* Client Side Drawer */}
      <ClientDrawer
        client={selectedClient}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
