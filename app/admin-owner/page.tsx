'use client';

import React, { useState, useMemo } from 'react';
import {
  getAdminOverview,
  getAdminRegistrations,
  getAdminCompanies,
  getAdminMerchants,
  getAdminComplaints,
  getAdminSettings,
  getAdminSalesTeam,
} from '@/lib/mock-api';
import type {
  Registration,
  AdminCompany,
  AdminMerchant,
  Complaint,
  SalesMember,
} from '@/types/admin-dashboard';
import {
  Shield,
  Users,
  UserPlus,
  ShoppingCart,
  Link2,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  X,
  Search,
  Filter,
  ChevronDown,
  Megaphone,
  AlertTriangle,
  MessageSquare,
  Settings,
  UserCheck,
  Target,
  Download,
} from 'lucide-react';

// ===== Tabs =====
type AdminTab = 'overview' | 'registrations' | 'companies' | 'merchants' | 'complaints' | 'sales' | 'settings';

const TABS: { key: AdminTab; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'نظرة عامة', icon: TrendingUp },
  { key: 'registrations', label: 'مراجعة التسجيلات', icon: Clock },
  { key: 'companies', label: 'الشركات', icon: Building2 },
  { key: 'merchants', label: 'التجار', icon: Users },
  { key: 'complaints', label: 'الشكاوى', icon: AlertTriangle },
  { key: 'sales', label: 'فريق السيلز', icon: Target },
  { key: 'settings', label: 'الإعدادات', icon: Settings },
];

// ===== Helpers =====
function formatCurrency(n: number) {
  return n.toLocaleString('ar-EG') + ' ج.م';
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ===== Registration Detail Drawer =====
function RegistrationDrawer({
  reg,
  onClose,
  onApprove,
  onReject,
}: {
  reg: Registration;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" />
      <aside className="fixed inset-y-0 left-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl border-r border-slate-200 overflow-y-auto transform transition-transform duration-300">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-sm font-bold text-gray-900">تفاصيل طلب التسجيل</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Company Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f2d4a] text-white font-bold text-lg">
              {reg.companyName.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{reg.companyName}</h4>
              <p className="text-xs text-gray-500">{reg.category} • {reg.governorate}</p>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 gap-3 bg-slate-50 rounded-2xl p-4">
            <InfoRow icon={Users} label="صاحب الشركة" value={reg.ownerName} />
            <InfoRow icon={Phone} label="الهاتف" value={reg.phone} />
            <InfoRow icon={Mail} label="الإيميل" value={reg.email} />
            <InfoRow icon={MapPin} label="المحافظة" value={reg.governorate} />
            <InfoRow icon={FileText} label="الرقم الضريبي" value={reg.taxId || '— لم يُرفق'} warn={!reg.taxId} />
            <InfoRow icon={FileText} label="السجل التجاري" value={reg.commercialRegister || '— لم يُرفق'} warn={!reg.commercialRegister} />
            <InfoRow icon={Clock} label="تاريخ الطلب" value={formatDate(reg.requestedAt)} />
          </div>

          {reg.notes && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
              <p className="text-xs font-bold text-amber-800 mb-1">ملاحظات</p>
              <p className="text-xs text-amber-700">{reg.notes}</p>
            </div>
          )}

          {!reg.taxId || !reg.commercialRegister ? (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3">
              <p className="text-xs font-bold text-rose-700">⚠️ مستندات ناقصة</p>
              <p className="text-xs text-rose-600 mt-1">
                {!reg.taxId && 'البطاقة الضريبية لم تُرفق. '}
                {!reg.commercialRegister && 'السجل التجاري لم يُرفق. '}
                يُفضل طلبها قبل الموافقة.
              </p>
            </div>
          ) : null}

          {/* Status + Actions */}
          <div className="flex items-center gap-2 pt-2">
            {reg.status === 'pending' ? (
              <>
                <button
                  onClick={() => onApprove(reg.id)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 text-sm font-bold transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  موافقة
                </button>
                <button
                  onClick={() => onReject(reg.id)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white py-2.5 text-sm font-bold transition-colors cursor-pointer"
                >
                  <XCircle className="h-4 w-4" />
                  رفض
                </button>
              </>
            ) : (
              <StatusBadgeLarge status={reg.status} />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function InfoRow({ icon: Icon, label, value, warn }: { icon: React.ElementType; label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className={`h-4 w-4 shrink-0 ${warn ? 'text-amber-500' : 'text-slate-400'}`} />
      <div className="flex-1 min-w-0">
        <span className="text-[10px] text-slate-400 block">{label}</span>
        <span className={`text-xs font-semibold ${warn ? 'text-amber-600' : 'text-gray-800'}`}>{value}</span>
      </div>
    </div>
  );
}

function StatusBadgeLarge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: '✅ تمت الموافقة' },
    rejected: { bg: 'bg-rose-100', text: 'text-rose-700', label: '❌ تم الرفض' },
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: '⏳ قيد المراجعة' },
  };
  const s = map[status] || map['pending'];
  return <div className={`flex-1 text-center py-2.5 rounded-xl text-sm font-bold ${s.bg} ${s.text}`}>{s.label}</div>;
}

// ===== Company Detail Drawer =====
function CompanyDrawer({ company, onClose, onToggle }: { company: AdminCompany; onClose: () => void; onToggle: (id: string) => void }) {
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" />
      <aside className="fixed inset-y-0 left-0 z-50 w-full sm:w-[440px] bg-white shadow-2xl border-r border-slate-200 overflow-y-auto">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-sm font-bold text-gray-900">تفاصيل الشركة</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Company Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f2d4a] text-white font-bold text-xl">
              {company.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base">{company.name}</h4>
              <p className="text-xs text-gray-500">{company.category} • {company.governorate}</p>
              <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${company.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {company.active ? 'مفعّل' : 'مُعطَّل'}
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-2">
            <MiniStat label="التجار المرتبطين" value={`${company.merchantsLinked}`} color="blue" />
            <MiniStat label="المنتجات" value={`${company.productsCount}`} color="purple" />
            <MiniStat label="الطلبات" value={`${company.ordersCount}`} color="emerald" />
            <MiniStat label="إجمالي الإيراد" value={formatCurrency(company.totalRevenue)} color="amber" />
          </div>

          {/* Info grid */}
          <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
            <InfoRow icon={Users} label="صاحب الشركة" value={company.ownerName} />
            <InfoRow icon={Phone} label="الهاتف" value={company.phone} />
            <InfoRow icon={Mail} label="الإيميل" value={company.email} />
            <InfoRow icon={MapPin} label="المحافظة" value={company.governorate} />
            <InfoRow icon={FileText} label="الرقم الضريبي" value={company.taxId} />
            <InfoRow icon={FileText} label="السجل التجاري" value={company.commercialRegister} />
            <InfoRow icon={Clock} label="تاريخ الانضمام" value={company.joinedAt} />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => onToggle(company.id)}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-colors cursor-pointer ${
                company.active
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {company.active ? (
                <>
                  <XCircle className="h-4 w-4" />
                  إيقاف الحساب
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  تفعيل الحساب
                </>
              )}
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
              <Phone className="h-4 w-4" />
              تواصل
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
  };
  return (
    <div className={`rounded-xl border p-3 text-center ${colors[color]}`}>
      <p className="text-[10px] font-semibold opacity-70">{label}</p>
      <p className="text-sm font-black mt-0.5">{value}</p>
    </div>
  );
}

// =====================
// MAIN PAGE
// =====================
export default function AdminOwnerDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const overview = getAdminOverview();
  const [registrations, setRegistrations] = useState<Registration[]>(getAdminRegistrations());
  const [companies, setCompanies] = useState<AdminCompany[]>(getAdminCompanies());
  const [merchants, setMerchants] = useState<AdminMerchant[]>(getAdminMerchants());
  const [complaints, setComplaints] = useState<Complaint[]>(getAdminComplaints());
  const settings = getAdminSettings();
  const salesTeam = getAdminSalesTeam();

  // Drawers
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<AdminCompany | null>(null);

  // Searches
  const [companySearch, setCompanySearch] = useState('');
  const [merchantSearch, setMerchantSearch] = useState('');

  // Filters
  const [regFilter, setRegFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Handlers
  const approveReg = (id: string) => {
    setRegistrations(prev => prev.map(r => (r.id === id ? { ...r, status: 'approved' as const } : r)));
    setSelectedReg(prev => (prev && prev.id === id ? { ...prev, status: 'approved' as const } : prev));
    console.log('✅ Approved:', id);
  };
  const rejectReg = (id: string) => {
    setRegistrations(prev => prev.map(r => (r.id === id ? { ...r, status: 'rejected' as const } : r)));
    setSelectedReg(prev => (prev && prev.id === id ? { ...prev, status: 'rejected' as const } : prev));
    console.log('❌ Rejected:', id);
  };
  const toggleCompany = (id: string) => {
    setCompanies(prev => prev.map(c => (c.id === id ? { ...c, active: !c.active } : c)));
    setSelectedCompany(prev => (prev && prev.id === id ? { ...prev, active: !prev.active } : prev));
  };
  const toggleMerchant = (id: string) => {
    setMerchants(prev => prev.map(m => (m.id === id ? { ...m, active: !m.active } : m)));
  };

  // Filtered data
  const filteredRegs = useMemo(() => {
    if (regFilter === 'all') return registrations;
    return registrations.filter(r => r.status === regFilter);
  }, [registrations, regFilter]);

  const filteredCompanies = useMemo(() => {
    if (!companySearch.trim()) return companies;
    return companies.filter(c => c.name.includes(companySearch) || c.ownerName.includes(companySearch));
  }, [companies, companySearch]);

  const filteredMerchants = useMemo(() => {
    if (!merchantSearch.trim()) return merchants;
    return merchants.filter(m => m.name.includes(merchantSearch) || m.governorate.includes(merchantSearch));
  }, [merchants, merchantSearch]);

  const pendingCount = registrations.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-gray-900 flex flex-col" dir="rtl">
      {/* ====== Header ====== */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 py-2 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#0f2d4a] text-white shadow-xs font-black text-xs sm:text-base">
              ت
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-base font-black tracking-tight text-[#0f2d4a] leading-none">توريد</span>
              <span className="text-[8px] sm:text-[10px] text-slate-400 font-medium">لوحة تحكم المشرف</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {pendingCount > 0 && (
              <button
                onClick={() => { setActiveTab('registrations'); setRegFilter('pending'); }}
                className="flex items-center gap-1 rounded-xl bg-amber-100 text-amber-800 px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold hover:bg-amber-200 transition-colors cursor-pointer"
              >
                <Clock className="h-3 w-3" />
                <span className="hidden xs:inline">{pendingCount} تسجيل جديد</span>
                <span className="xs:hidden">{pendingCount}</span>
              </button>
            )}
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#0f2d4a] text-white text-[10px] sm:text-xs font-bold">
              م
            </div>
          </div>
        </div>
      </header>

      {/* ====== Tab Bar (scrollable on mobile) ====== */}
      <div className="border-b border-slate-200 bg-white sticky top-[44px] sm:top-[52px] z-20">
        <div className="mx-auto max-w-7xl px-0 sm:px-6 overflow-x-auto scrollbar-none">
          <div className="flex min-w-max">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 px-2.5 sm:px-4 pt-1.5 pb-1 sm:py-2.5 text-[8px] sm:text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'border-[#0f2d4a] text-[#0f2d4a]'
                      : 'border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4 sm:h-3.5 sm:w-3.5 shrink-0" />
                  <span className="leading-none">{tab.label.length > 4 ? tab.label.split(' ')[0] : tab.label}</span>
                  {tab.key === 'registrations' && pendingCount > 0 && (
                    <span className="absolute top-1 left-0.5 bg-amber-500 text-white text-[7px] min-w-[14px] h-[14px] flex items-center justify-center rounded-full font-bold">{pendingCount}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ====== Main Content ====== */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 space-y-5">

        {/* ============================== */}
        {/* TAB: نظرة عامة */}
        {/* ============================== */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              <OverviewCard icon={Building2} label="الشركات المسجلة" value={`${overview.companiesCount}`} color="blue" />
              <OverviewCard icon={Users} label="التجار المسجلين" value={`${overview.merchantsCount}`} color="emerald" />
              <OverviewCard icon={UserPlus} label="تسجيلات اليوم" value={`${overview.newRegistrationsToday}`} color="purple" />
              <OverviewCard icon={UserPlus} label="تسجيلات الأسبوع" value={`${overview.newRegistrationsWeek}`} color="amber" />
              <OverviewCard icon={ShoppingCart} label="إجمالي الطلبات" value={`${overview.ordersCount}`} color="blue" />
              <OverviewCard icon={Link2} label="عمليات الربط" value={`${overview.connectionsCount}`} color="emerald" />
              <OverviewCard icon={TrendingUp} label="إجمالي الإيرادات" value={formatCurrency(overview.totalRevenue)} color="purple" />
              <OverviewCard icon={Clock} label="تسجيلات قيد المراجعة" value={`${pendingCount}`} color="amber" badge={pendingCount > 0} />
            </div>

            {/* Quick Registrations Preview */}
            {pendingCount > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">🔔 تسجيلات تحتاج موافقتك</h3>
                  <button onClick={() => { setActiveTab('registrations'); setRegFilter('pending'); }} className="text-[10px] sm:text-xs text-blue-600 font-bold hover:underline cursor-pointer">
                    عرض الكل ←
                  </button>
                </div>
                <div className="space-y-2">
                  {registrations.filter(r => r.status === 'pending').slice(0, 3).map(r => (
                    <div key={r.id} className="flex flex-col gap-2 bg-slate-50 rounded-xl p-2.5">
                      {/* Company info row */}
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-bold text-xs">
                          {r.companyName.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-gray-900 truncate">{r.companyName}</p>
                          <p className="text-[9px] text-gray-500 truncate">{r.ownerName} • {r.governorate} • {formatDate(r.requestedAt)}</p>
                        </div>
                      </div>
                      {/* Actions row — full width on mobile */}
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setSelectedReg(r)}
                          className="flex-1 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-[10px] font-bold hover:bg-slate-300 cursor-pointer"
                        >
                          تفاصيل
                        </button>
                        <button
                          onClick={() => approveReg(r.id)}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 cursor-pointer"
                        >
                          ✓ قبول
                        </button>
                        <button
                          onClick={() => rejectReg(r.id)}
                          className="flex-1 py-1.5 rounded-lg bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700 cursor-pointer"
                        >
                          ✕ رفض
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Companies by Revenue */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">🏆 أعلى الشركات إيراداً</h3>
              <div className="space-y-2">
                {[...companies].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5).map((c, i) => (
                  <div key={c.id} className="flex items-center justify-between bg-slate-50 rounded-xl p-3 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => setSelectedCompany(c)}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0f2d4a] text-white text-[10px] font-bold">{i + 1}</span>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{c.name}</p>
                        <p className="text-[10px] text-gray-500">{c.merchantsLinked} تاجر • {c.ordersCount} طلب</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-700">{formatCurrency(c.totalRevenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ============================== */}
        {/* TAB: مراجعة التسجيلات */}
        {/* ============================== */}
        {activeTab === 'registrations' && (
          <>
            {/* Filter bar */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setRegFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    regFilter === f ? 'bg-[#0f2d4a] text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f === 'all' ? 'الكل' : f === 'pending' ? '⏳ قيد المراجعة' : f === 'approved' ? '✅ مقبول' : '❌ مرفوض'}
                  {f === 'pending' && pendingCount > 0 && (
                    <span className="mr-1 bg-amber-400 text-white text-[9px] px-1.5 py-0.5 rounded-full">{pendingCount}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Registration cards */}
            <div className="space-y-2.5">
              {filteredRegs.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-emerald-300" />
                  <p className="text-sm font-bold">لا توجد تسجيلات بهذا الفلتر</p>
                </div>
              )}
              {filteredRegs.map(r => (
                <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-4 flex flex-col gap-2.5 hover:shadow-md transition-shadow">
                  {/* Top: avatar + info */}
                  <div className="flex items-start gap-2.5">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm ${
                      r.status === 'pending' ? 'bg-amber-100 text-amber-700' : r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {r.companyName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">{r.companyName}</h4>
                      <p className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5">{r.ownerName} • {r.phone}</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-500">{r.governorate} • {r.category}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-[9px] text-gray-400">{formatDate(r.requestedAt)}</span>
                        {r.taxId && <span className="text-[8px] sm:text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">ضريبي ✓</span>}
                        {r.commercialRegister && <span className="text-[8px] sm:text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">سجل ✓</span>}
                        {!r.taxId && <span className="text-[8px] sm:text-[9px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded font-bold">ضريبي ✗</span>}
                      </div>
                    </div>
                  </div>
                  {/* Bottom: actions */}
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setSelectedReg(r)} className="flex-1 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-[10px] font-bold hover:bg-slate-200 cursor-pointer text-center">
                      تفاصيل
                    </button>
                    {r.status === 'pending' && (
                      <>
                        <button onClick={() => approveReg(r.id)} className="flex-1 py-1.5 rounded-xl bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 cursor-pointer text-center">
                          ✓ موافقة
                        </button>
                        <button onClick={() => rejectReg(r.id)} className="flex-1 py-1.5 rounded-xl bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700 cursor-pointer text-center">
                          ✕ رفض
                        </button>
                      </>
                    )}
                    {r.status !== 'pending' && (
                      <span className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold text-center ${
                        r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {r.status === 'approved' ? '✅ مقبول' : '❌ مرفوض'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ============================== */}
        {/* TAB: الشركات */}
        {/* ============================== */}
        {activeTab === 'companies' && (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث باسم الشركة أو صاحبها..."
                value={companySearch}
                onChange={e => setCompanySearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              />
            </div>

            {/* Companies — cards on mobile, table on desktop */}
            {/* Mobile cards */}
            <div className="flex flex-col gap-2.5 sm:hidden">
              {filteredCompanies.map(c => (
                <div key={c.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3" onClick={() => setSelectedCompany(c)}>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0f2d4a] text-white font-bold text-xs">{c.name.charAt(0)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-gray-900 leading-tight">{c.name}</p>
                      <p className="text-[9px] text-gray-500">{c.ownerName} • {c.governorate}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold ${c.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {c.active ? 'مفعّل' : 'مُعطَّل'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                    <div className="bg-blue-50 rounded-lg p-1.5 text-center">
                      <p className="text-[8px] text-blue-600 font-medium">التجار</p>
                      <p className="text-[11px] font-black text-blue-800">{c.merchantsLinked}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-1.5 text-center">
                      <p className="text-[8px] text-purple-600 font-medium">الطلبات</p>
                      <p className="text-[11px] font-black text-purple-800">{c.ordersCount}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-1.5 text-center">
                      <p className="text-[8px] text-emerald-600 font-medium">الإيراد</p>
                      <p className="text-[9px] font-black text-emerald-800">{(c.totalRevenue/1000).toFixed(0)}k ج</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setSelectedCompany(c)} className="flex-1 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold cursor-pointer">تفاصيل</button>
                    <button onClick={() => toggleCompany(c.id)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer ${c.active ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {c.active ? 'إيقاف' : 'تفعيل'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl bg-white shadow-sm border border-slate-200">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-right font-bold text-gray-700">الشركة</th>
                    <th className="p-3 text-right font-bold text-gray-700">المحافظة</th>
                    <th className="p-3 text-right font-bold text-gray-700">التصنيف</th>
                    <th className="p-3 text-right font-bold text-gray-700">التجار</th>
                    <th className="p-3 text-right font-bold text-gray-700">الطلبات</th>
                    <th className="p-3 text-right font-bold text-gray-700">إجمالي الإيراد</th>
                    <th className="p-3 text-right font-bold text-gray-700">الحالة</th>
                    <th className="p-3 text-right font-bold text-gray-700">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.map(c => (
                    <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors cursor-pointer" onClick={() => setSelectedCompany(c)}>
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0f2d4a] text-white font-bold text-[10px]">{c.name.charAt(0)}</div>
                          <div>
                            <p className="font-bold text-gray-900 text-xs">{c.name}</p>
                            <p className="text-[10px] text-gray-500">{c.ownerName} • {c.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-gray-700">{c.governorate}</td>
                      <td className="p-3"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold">{c.category}</span></td>
                      <td className="p-3 font-bold text-gray-900">{c.merchantsLinked}</td>
                      <td className="p-3 font-bold text-gray-900">{c.ordersCount}</td>
                      <td className="p-3 font-black text-emerald-700">{formatCurrency(c.totalRevenue)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {c.active ? 'مفعّل' : 'مُعطَّل'}
                        </span>
                      </td>
                      <td className="p-3" onClick={e => e.stopPropagation()}>
                        <button onClick={() => toggleCompany(c.id)} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${c.active ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>
                          {c.active ? 'إيقاف' : 'تفعيل'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ============================== */}
        {/* TAB: التجار */}
        {/* ============================== */}
        {activeTab === 'merchants' && (
          <>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث باسم التاجر أو المحافظة..."
                value={merchantSearch}
                onChange={e => setMerchantSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              />
            </div>

            {/* Merchants — cards on mobile, table on desktop */}
            {/* Mobile cards */}
            <div className="flex flex-col gap-2.5 sm:hidden">
              {filteredMerchants.map(m => (
                <div key={m.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xs">{m.name.charAt(0)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-gray-900 leading-tight">{m.name}</p>
                      <p className="text-[9px] text-gray-500">{m.phone} • {m.area}، {m.governorate}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold ${m.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {m.active ? 'مفعّل' : 'مُعطَّل'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                    <div className="bg-purple-50 rounded-lg p-1.5 text-center">
                      <p className="text-[8px] text-purple-600 font-medium">النوع</p>
                      <p className="text-[9px] font-black text-purple-800">{m.type}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-1.5 text-center">
                      <p className="text-[8px] text-blue-600 font-medium">الطلبات</p>
                      <p className="text-[11px] font-black text-blue-800">{m.ordersCount}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-1.5 text-center">
                      <p className="text-[8px] text-emerald-600 font-medium">مشتريات</p>
                      <p className="text-[9px] font-black text-emerald-800">{(m.totalSpent/1000).toFixed(0)}k ج</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleMerchant(m.id)}
                    className={`w-full py-1.5 rounded-lg text-[10px] font-bold cursor-pointer ${m.active ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}
                  >
                    {m.active ? 'إيقاف الحساب' : 'تفعيل الحساب'}
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl bg-white shadow-sm border border-slate-200">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-right font-bold text-gray-700">التاجر</th>
                    <th className="p-3 text-right font-bold text-gray-700">النوع</th>
                    <th className="p-3 text-right font-bold text-gray-700">المحافظة</th>
                    <th className="p-3 text-right font-bold text-gray-700">المنطقة</th>
                    <th className="p-3 text-right font-bold text-gray-700">شركات مرتبطة</th>
                    <th className="p-3 text-right font-bold text-gray-700">الطلبات</th>
                    <th className="p-3 text-right font-bold text-gray-700">إجمالي المشتريات</th>
                    <th className="p-3 text-right font-bold text-gray-700">الحالة</th>
                    <th className="p-3 text-right font-bold text-gray-700">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMerchants.map(m => (
                    <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-[10px]">{m.name.charAt(0)}</div>
                          <div>
                            <p className="font-bold text-gray-900 text-xs">{m.name}</p>
                            <p className="text-[10px] text-gray-500">{m.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3"><span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full text-[10px] font-bold">{m.type}</span></td>
                      <td className="p-3 text-gray-700">{m.governorate}</td>
                      <td className="p-3 text-gray-700">{m.area}</td>
                      <td className="p-3 font-bold text-gray-900">{m.linkedCompanies}</td>
                      <td className="p-3 font-bold text-gray-900">{m.ordersCount}</td>
                      <td className="p-3 font-black text-blue-700">{formatCurrency(m.totalSpent)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${m.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {m.active ? 'مفعّل' : 'مُعطَّل'}
                        </span>
                      </td>
                      <td className="p-3">
                        <button onClick={() => toggleMerchant(m.id)} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${m.active ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>
                          {m.active ? 'إيقاف' : 'تفعيل'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ============================== */}
        {/* TAB: الشكاوى */}
        {/* ============================== */}
        {activeTab === 'complaints' && (
          <div className="space-y-3">
            {complaints.map(c => (
              <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.from === 'merchant' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                      {c.from === 'merchant' ? 'تاجر' : 'شركة'}
                    </span>
                    <span className="text-xs font-bold text-gray-900">{c.fromName}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    c.status === 'open' ? 'bg-amber-100 text-amber-700' : c.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {c.status === 'open' ? 'مفتوحة' : c.status === 'in-progress' ? 'جاري المعالجة' : 'تم الحل'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">{c.subject}</h4>
                <p className="text-xs text-gray-600">{c.description}</p>
                {c.reply && (
                  <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-700 mb-1">الرد:</p>
                    <p className="text-xs text-emerald-800">{c.reply}</p>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-gray-400">{formatDate(c.createdAt)}</span>
                  {c.status !== 'resolved' && (
                    <button
                      onClick={() => {
                        setComplaints(prev => prev.map(x => x.id === c.id ? { ...x, status: 'resolved', reply: 'تم التواصل وحل المشكلة.' } : x));
                        console.log('Resolved complaint', c.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                    >
                      <MessageSquare className="h-3 w-3 inline ml-1" />
                      حل الشكوى
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================== */}
        {/* TAB: فريق السيلز */}
        {/* ============================== */}
        {activeTab === 'sales' && (
          <div className="space-y-3">
            {salesTeam.map(s => {
              const progress = Math.round((s.companiesRegistered / s.target) * 100);
              return (
                <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f2d4a] text-white font-bold text-sm">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{s.name}</h4>
                        <p className="text-[10px] text-gray-500">{s.phone}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      progress >= 80 ? 'bg-emerald-100 text-emerald-700' : progress >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {progress}% من التارجت
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <MiniStat label="تم التواصل" value={`${s.companiesContacted}`} color="blue" />
                    <MiniStat label="مهتم" value={`${s.companiesInterested}`} color="amber" />
                    <MiniStat label="سجّل" value={`${s.companiesRegistered}`} color="emerald" />
                  </div>
                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                      <span>التارجت: {s.target} شركة</span>
                      <span>تم: {s.companiesRegistered}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${progress >= 80 ? 'bg-emerald-500' : progress >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============================== */}
        {/* TAB: الإعدادات */}
        {/* ============================== */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">📦 التصنيفات</h3>
              <div className="flex flex-wrap gap-2">
                {settings.categories.map((cat, i) => (
                  <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-xs font-bold">{cat}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">📍 المناطق</h3>
              <div className="flex flex-wrap gap-2">
                {settings.regions.map((reg, i) => (
                  <span key={i} className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-bold">{reg}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ====== Drawers ====== */}
      {selectedReg && (
        <RegistrationDrawer
          reg={selectedReg}
          onClose={() => setSelectedReg(null)}
          onApprove={approveReg}
          onReject={rejectReg}
        />
      )}
      {selectedCompany && (
        <CompanyDrawer
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onToggle={toggleCompany}
        />
      )}
    </div>
  );
}

// ===== Overview Card =====
function OverviewCard({ icon: Icon, label, value, color, badge }: { icon: React.ElementType; label: string; value: string; color: string; badge?: boolean }) {
  const colorMap: Record<string, { bg: string; iconBg: string; text: string }> = {
    blue: { bg: 'bg-white border-blue-100', iconBg: 'bg-blue-600 text-white', text: 'text-blue-900' },
    emerald: { bg: 'bg-white border-emerald-100', iconBg: 'bg-emerald-600 text-white', text: 'text-emerald-900' },
    purple: { bg: 'bg-white border-purple-100', iconBg: 'bg-purple-600 text-white', text: 'text-purple-900' },
    amber: { bg: 'bg-white border-amber-100', iconBg: 'bg-amber-600 text-white', text: 'text-amber-900' },
  };
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className={`relative overflow-hidden rounded-2xl border ${c.bg} p-3 sm:p-4 shadow-xs transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="text-[10px] sm:text-[11px] font-semibold text-gray-500">{label}</p>
          <h3 className={`text-base sm:text-lg font-black tracking-tight ${c.text}`}>{value}</h3>
        </div>
        <div className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl ${c.iconBg} shadow-sm`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
      {badge && <span className="absolute top-2 left-2 h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />}
    </div>
  );
}
