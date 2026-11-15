'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Store,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Link2,
} from 'lucide-react';
import { getSupplierById, linkSupplier, saveMerchantProfile } from '@/lib/mock-api';
import { StoreType } from '@/types/merchant';

const STORE_TYPES: StoreType[] = [
  'سوبر ماركت',
  'هايبر ماركت',
  'محل بقالة',
  'ميني ماركت',
  'كشك',
];

const GOVERNORATES = [
  'الإسماعيلية',
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'الشرقية',
  'بورسعيد',
  'السويس',
  'الدقهلية',
  'الغربية',
  'القليوبية',
];

export default function PublicSupplierJoinPage({
  params,
}: {
  params: Promise<{ supplierSlug: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const supplierSlug = resolvedParams.supplierSlug;

  const supplier = getSupplierById(supplierSlug);

  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [storeType, setStoreType] = useState<StoreType>('سوبر ماركت');
  const [governorate, setGovernorate] = useState('الإسماعيلية');
  const [area, setArea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !ownerName.trim() || !phone.trim() || !area.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (!/^01[0125][0-9]{8}$/.test(phone.trim())) {
      setError('يرجى إدخال رقم محمول مصري صحيح (11 رقم)');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Save profile locally
    const newProfile = {
      storeName: storeName.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      storeType,
      governorate,
      area: area.trim(),
      address: `${area.trim()}، ${governorate}`,
      avatar: storeName.trim().charAt(0),
    };
    saveMerchantProfile(newProfile);

    // Link with supplier
    if (supplier) {
      linkSupplier(supplier.id);
    }

    console.log('[PublicJoin] Merchant registered and linked:', {
      profile: newProfile,
      supplier: supplier?.name,
    });

    // Redirect to merchant dashboard
    setTimeout(() => {
      router.push('/merchant');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 flex flex-col justify-between" dir="rtl">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white py-3 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#0f2d4a] text-white shadow-xs font-black text-sm sm:text-base">
              ت
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-black tracking-tight text-[#0f2d4a] leading-none">
                توريد
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
                بوابة ربط المتاجر بالمصانع
              </span>
            </div>
          </Link>

          <Link
            href="/merchant"
            className="text-xs font-bold text-[#0f2d4a] hover:text-blue-700 flex items-center gap-1"
          >
            <span>دخول بوابة التاجر</span>
            <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8 sm:py-12">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          {/* Supplier Pitch Banner */}
          {supplier ? (
            <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-100 p-4 sm:p-5 text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f2d4a] text-white font-black text-2xl shadow-sm">
                {supplier.logo.charAt(0)}
              </div>

              <div>
                <span className="inline-block rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-bold mb-1">
                  دعوة ربط معتمدة
                </span>
                <h1 className="text-base sm:text-lg font-black text-gray-900">
                  ندعوك للربط مع {supplier.name}
                </h1>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                  احصل على أسعار الجملة المباشرة، عروض البونص والخصومات الحصرية، وشحن مباشر حتى باب محلك.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 text-[11px] font-bold text-slate-600 pt-1">
                <span>✓ شحن مباشر</span>
                <span>•</span>
                <span>✓ أسعار مصنع</span>
                <span>•</span>
                <span>✓ بدون وسطاء</span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <h1 className="text-base font-bold text-gray-900">تسجيل متجر جديد على منصة توريد</h1>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-sm font-bold text-gray-900 border-b border-slate-100 pb-2">
              سجّل بيانات محلك للربط الفوري:
            </h2>

            {error && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-bold">
                {error}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">اسم المحل أو السوبر ماركت *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="مثال: سوبر ماركت الفرسان"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-3 pr-9 py-2.5 text-xs text-gray-900 focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
                  />
                  <Store className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">اسم صاحب المتجر / المسؤول *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="مثال: أ / محمد عبد العظيم"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-3 pr-9 py-2.5 text-xs text-gray-900 focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
                  />
                  <User className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">رقم المحمول (واتساب المعتمد) *</label>
                <div className="relative">
                  <input
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01223456789"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-3 pr-9 py-2.5 text-xs text-gray-900 font-mono text-right focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
                  />
                  <Phone className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">نوع المحل</label>
                  <select
                    value={storeType}
                    onChange={(e) => setStoreType(e.target.value as StoreType)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-2.5 text-xs text-gray-900 cursor-pointer focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
                  >
                    {STORE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">المحافظة</label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-2.5 text-xs text-gray-900 cursor-pointer focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
                  >
                    {GOVERNORATES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">المنطقة أو الحي *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="مثال: حي الشيخ زايد"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-3 pr-9 py-2.5 text-xs text-gray-900 focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
                  />
                  <MapPin className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl bg-[#0f2d4a] hover:bg-blue-900 py-3.5 px-4 text-sm font-bold text-white shadow-md transition-all cursor-pointer"
            >
              <Link2 className="h-4 w-4" />
              <span>
                {isSubmitting
                  ? 'جاري الربط والدخول...'
                  : `سجّل واربط مع ${supplier?.name || 'الشركة'}`}
              </span>
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        منصة توريد لربط الشركات والمصانع بمحلات التجزئة في مصر © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
