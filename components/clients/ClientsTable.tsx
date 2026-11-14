'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Send,
  Store,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpDown,
  ShoppingBag,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { LinkedClient, ClientFilterState } from '@/types/clients';

interface ClientsTableProps {
  clients: LinkedClient[];
  onSelectClient: (client: LinkedClient) => void;
}

export function ClientsTable({ clients, onSelectClient }: ClientsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('الكل');
  const [selectedType, setSelectedType] = useState('الكل');
  const [orderFilter, setOrderFilter] = useState<'all' | 'ordered' | 'never_ordered'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'orders' | 'spend'>('newest');

  // Areas list
  const areasList = useMemo(() => {
    const set = new Set<string>();
    clients.forEach((c) => set.add(c.area));
    return ['الكل', ...Array.from(set)];
  }, [clients]);

  // Types list
  const typesList = useMemo(() => {
    const set = new Set<string>();
    clients.forEach((c) => set.add(c.type));
    return ['الكل', ...Array.from(set)];
  }, [clients]);

  // Filtered and sorted clients
  const filteredClients = useMemo(() => {
    let result = clients.filter((c) => {
      // Search
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.ownerName.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q);

      // Area
      const matchArea = selectedArea === 'الكل' || c.area === selectedArea;

      // Type
      const matchType = selectedType === 'الكل' || c.type === selectedType;

      // Order status
      let matchOrder = true;
      if (orderFilter === 'ordered') {
        matchOrder = c.ordersCount > 0;
      } else if (orderFilter === 'never_ordered') {
        matchOrder = c.ordersCount === 0;
      }

      return matchSearch && matchArea && matchType && matchOrder;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.linkedAt).getTime() - new Date(a.linkedAt).getTime();
      } else if (sortBy === 'orders') {
        return b.ordersCount - a.ordersCount;
      } else {
        return b.totalSpend - a.totalSpend;
      }
    });

    return result;
  }, [clients, searchQuery, selectedArea, selectedType, orderFilter, sortBy]);

  // Client-side CSV export
  const handleExportCSV = () => {
    const rows = filteredClients.map((c) => ({
      'اسم_المحل': c.name,
      'اسم_المالك': c.ownerName,
      'نوع_النشاط': c.type,
      'المنطقة': c.area,
      'المدينة': c.city,
      'رقم_الهاتف': c.phone,
      'تاريخ_الربط': new Date(c.linkedAt).toISOString().split('T')[0],
      'عدد_الطلبات': c.ordersCount,
      'إجمالي_المسحوبات_جنيه': c.totalSpend,
      'تاريخ_آخر_طلب': c.lastOrderDate || 'لا يوجد',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'قائمة_العملاء');
    XLSX.writeFile(wb, `عملاء_توريد_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Helper to test if linked in last 7 days
  const isLinkedRecently = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    return diff <= 7 * 86400000;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث باسم المحل أو المالك أو رقم الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-slate-50/70 pr-10 pl-4 py-2 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#0f2d4a] focus:outline-none transition-all"
            />
          </div>

          {/* Export button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>تصدير العملاء (CSV)</span>
          </button>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Area */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">المنطقة:</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-slate-50 px-2.5 py-1.5 font-bold text-gray-800 focus:outline-none focus:border-[#0f2d4a]"
            >
              {areasList.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">نوع المحل:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-slate-50 px-2.5 py-1.5 font-bold text-gray-800 focus:outline-none focus:border-[#0f2d4a]"
            >
              {typesList.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Order status */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">حالة الطلبات:</label>
            <select
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value as any)}
              className="w-full rounded-xl border border-gray-200 bg-slate-50 px-2.5 py-1.5 font-bold text-gray-800 focus:outline-none focus:border-[#0f2d4a]"
            >
              <option value="all">الكل (طلب ولم يطلب)</option>
              <option value="ordered">عملاء طلبوا فعلاً</option>
              <option value="never_ordered">عملاء لم يطلبوا بعد</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">الترتيب حسب:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-xl border border-gray-200 bg-slate-50 px-2.5 py-1.5 font-bold text-gray-800 focus:outline-none focus:border-[#0f2d4a]"
            >
              <option value="newest">الأحدث انضماماً</option>
              <option value="orders">الأكثر طلباً</option>
              <option value="spend">الأعلى قيمة مسحوبات</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result Counter & Hint */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          عرض <strong className="text-gray-900 font-bold">{filteredClients.length}</strong> من أصل{' '}
          {clients.length} عميل مربوط
        </span>
        <span className="hidden sm:inline">اضغط على العميل لعرض ملفه وتفاصيله الكاملة</span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 text-gray-600 border-b border-slate-200">
            <tr>
              <th className="p-3.5 font-bold">المحل والمسؤول</th>
              <th className="p-3.5 font-bold">نوع النشاط</th>
              <th className="p-3.5 font-bold">المنطقة والحي</th>
              <th className="p-3.5 font-bold">تاريخ الربط</th>
              <th className="p-3.5 font-bold">الطلبات والمسحوبات</th>
              <th className="p-3.5 font-bold">الحالة</th>
              <th className="p-3.5 font-bold text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredClients.map((client) => {
              const isNew = isLinkedRecently(client.linkedAt);
              const cleanPhone = client.phone.replace(/[^0-9]/g, '');
              const waPhone = cleanPhone.startsWith('0') ? '2' + cleanPhone : cleanPhone;
              const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
                `أهلاً بك يا فندم في ${client.name}، معك شركة الأهرام للصناعات الغذائية عبر منصة توريد.`
              )}`;

              return (
                <tr
                  key={client.id}
                  onClick={() => onSelectClient(client)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  {/* Name + Avatar */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-black text-sm">
                        {client.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-gray-900 text-sm truncate">{client.name}</h4>
                          {isNew && (
                            <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 text-[9px] font-bold">
                              جديد
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                          <span>المالك: {client.ownerName}</span>
                          <span>•</span>
                          <span className="font-mono" dir="ltr">{client.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="p-3.5">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                      {client.type}
                    </span>
                  </td>

                  {/* Area */}
                  <td className="p-3.5 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{client.area}، {client.city}</span>
                    </div>
                  </td>

                  {/* Link Date */}
                  <td className="p-3.5 text-gray-500 text-[11px]">
                    {new Date(client.linkedAt).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>

                  {/* Orders & Spend */}
                  <td className="p-3.5">
                    <div className="font-bold text-gray-900">
                      {client.ordersCount > 0 ? `${client.ordersCount} طلب` : 'لا يوجد'}
                    </div>
                    {client.totalSpend > 0 && (
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        {client.totalSpend.toLocaleString()} ج.م
                      </span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="p-3.5">
                    {client.ordersCount > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>عميل نشط</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                        <Clock className="h-3 w-3" />
                        <span>لم يطلب بعد</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                      title="محادثة واتساب"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>تواصل</span>
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-3">
        {filteredClients.map((client) => {
          const isNew = isLinkedRecently(client.linkedAt);
          const cleanPhone = client.phone.replace(/[^0-9]/g, '');
          const waPhone = cleanPhone.startsWith('0') ? '2' + cleanPhone : cleanPhone;
          const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
            `أهلاً بك يا فندم في ${client.name}، معك شركة الأهرام للصناعات الغذائية عبر منصة توريد.`
          )}`;

          return (
            <div
              key={client.id}
              onClick={() => onSelectClient(client)}
              className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-3 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-black text-sm">
                    {client.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-gray-900 text-sm truncate">{client.name}</h4>
                      {isNew && (
                        <span className="rounded-full bg-emerald-100 text-emerald-800 px-1.5 py-0.2 text-[9px] font-bold">
                          جديد
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {client.type} • {client.area}
                    </p>
                  </div>
                </div>

                {client.ordersCount > 0 ? (
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700 shrink-0">
                    {client.ordersCount} طلب
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700 shrink-0">
                    لم يطلب بعد
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-[11px] text-gray-500">
                  المالك: <strong className="text-gray-800">{client.ownerName}</strong>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 text-white px-3 py-1.5 text-xs font-bold shadow-xs hover:bg-emerald-700"
                  >
                    <Send className="h-3 w-3" />
                    <span>تواصل واتساب</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
