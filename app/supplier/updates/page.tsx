'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Inbox,
  Users,
} from 'lucide-react';
import { SupplierUpdate, UpdateType, UpdateStatus } from '@/types/updates';
import { LinkedClient } from '@/types/clients';
import {
  getUpdates,
  publishUpdate,
  deleteUpdate,
  resendUpdate,
  getClients,
} from '@/lib/mock-api';
import { UpdateCard } from '@/components/updates/UpdateCard';
import { UpdateComposer } from '@/components/updates/UpdateComposer';
import { EmptyState } from '@/components/common/EmptyState';
import { SupplierHeader } from '@/components/supplier/SupplierHeader';

export default function SupplierUpdatesPage() {
  const [updates, setUpdates] = useState<SupplierUpdate[]>([]);
  const [clients, setClients] = useState<LinkedClient[]>([]);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<SupplierUpdate | null>(null);
  const [activeStatusTab, setActiveStatusTab] = useState<UpdateStatus>('published');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setUpdates(getUpdates());
    setClients(getClients());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered updates by status tab & type
  const filteredUpdates = useMemo(() => {
    return updates.filter((u) => {
      const matchStatus = u.status === activeStatusTab;
      const matchType = selectedTypeFilter === 'all' || u.type === selectedTypeFilter;
      return matchStatus && matchType;
    });
  }, [updates, activeStatusTab, selectedTypeFilter]);

  // Handle Create / Edit Submit
  const handleSaveUpdate = (updateData: SupplierUpdate) => {
    console.log('[SupplierUpdatesPage] Saving update:', updateData);
    const updatedList = publishUpdate(updateData, updates);
    setUpdates(updatedList);
    setEditingUpdate(null);
    showToast(
      updateData.scheduleType === 'scheduled'
        ? `تمت جدولة نشر التحديث "${updateData.title}" بنجاح!`
        : `تم نشر التحديث "${updateData.title}" لجميع العملاء المستهدفين!`
    );
  };

  // Handle Delete with confirmation
  const handleDelete = (id: string, title: string) => {
    if (confirm(`هل أنت متأكد من حذف التحديث: "${title}"؟`)) {
      const updatedList = deleteUpdate(id, updates);
      setUpdates(updatedList);
      showToast('تم حذف التحديث بنجاح');
    }
  };

  // Handle Resend
  const handleResend = (id: string) => {
    const updatedList = resendUpdate(id, updates);
    setUpdates(updatedList);
    showToast('تمت إعادة إرسال التحديث بنجاح إلى خلاصة التجار المربوطين');
  };

  const publishedCount = updates.filter((u) => u.status === 'published').length;
  const scheduledCount = updates.filter((u) => u.status === 'scheduled').length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-gray-900 flex flex-col font-sans" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs sm:text-sm text-white shadow-xl animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Shared Header */}
      <SupplierHeader />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <Megaphone className="h-5 w-5" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  النشر للعملاء
                </h1>
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700">
                  جديد
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed">
                أي جديد تنشره (منتج جديد، عرض، تعديل سعر، أو إعلان) بيظهر تلقائياً عند كل التجار المربوطين معاك.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <Link
                href="/supplier/clients"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
              >
                <Users className="h-4 w-4 text-slate-500" />
                <span>قائمة عملائي ({clients.length})</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setEditingUpdate(null);
                  setIsComposerOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f2d4a] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#163e63] active:scale-[0.98] transition-all cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>نشر جديد للعملاء</span>
              </button>
            </div>
          </div>

          {/* Status Tabs (منشور / مجدول) */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveStatusTab('published')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeStatusTab === 'published'
                    ? 'bg-[#0f2d4a] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>المنشورات الحالية ({publishedCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStatusTab('scheduled')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeStatusTab === 'scheduled'
                    ? 'bg-[#0f2d4a] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>المجدولة لاحقاً ({scheduledCount})</span>
              </button>
            </div>

            {/* Type filter chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'new_product', label: 'منتج جديد' },
                { id: 'offer', label: 'عروض' },
                { id: 'price_change', label: 'تغيير سعر' },
                { id: 'announcement', label: 'إعلانات' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setSelectedTypeFilter(chip.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedTypeFilter === chip.id
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feed of Updates */}
        {filteredUpdates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredUpdates.map((update) => (
              <UpdateCard
                key={update.id}
                update={update}
                onEdit={(u) => {
                  setEditingUpdate(u);
                  setIsComposerOpen(true);
                }}
                onDelete={handleDelete}
                onResend={handleResend}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Megaphone}
            title={activeStatusTab === 'scheduled' ? 'لا توجد تحديثات مجدولة' : 'لم تنشر أي تحديثات بعد'}
            description="انشر أول منتج جديد أو عرض أو تعديل سعر ليصل مباشرة لجميع التجار المربوطين مع شركتك على هواتفهم."
            actionText="انشر أول تحديث الآن"
            onAction={() => {
              setEditingUpdate(null);
              setIsComposerOpen(true);
            }}
          />
        )}
      </main>

      {/* Update Composer Modal */}
      <UpdateComposer
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onSubmit={handleSaveUpdate}
        clients={clients}
        initialData={editingUpdate}
      />
    </div>
  );
}
