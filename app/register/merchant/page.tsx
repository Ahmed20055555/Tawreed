'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Store,
  Lock,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { saveMerchantProfile } from '@/lib/mock-api';
import { StoreType } from '@/types/merchant';

const GOVERNORATES = [
  'الإسماعيلية',
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'الشرقية',
  'الدقهلية',
  'القليوبية',
  'الغربية',
  'المنوفية',
  'البحيرة',
  'كفر الشيخ',
  'دمياط',
  'بورسعيد',
  'السويس',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
];

const STORE_TYPES: StoreType[] = [
  'سوبر ماركت',
  'ميني ماركت',
  'محل بقالة',
  'هايبر ماركت',
  'كشك',
];

export default function RegisterMerchantPage() {
  const router = useRouter();

  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [storeType, setStoreType] = useState<StoreType>('سوبر ماركت');
  const [governorate, setGovernorate] = useState('الإسماعيلية');
  const [area, setArea] = useState('شبين');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!storeName.trim() || !ownerName.trim() || !phone.trim() || !password.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (phone.length < 11) {
      setError('رقم الهاتف يجب أن يتكون من 11 رقماً');
      return;
    }

    setIsLoading(true);

    // Save profile to local storage for instant sync with /merchant
    const newProfile = {
      storeName: storeName.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      storeType,
      governorate,
      area: area.trim() || 'شبين',
      address: address.trim() || `${area}، ${governorate}`,
      avatar: storeName.trim().charAt(0) || 'ت',
      isVerified: true,
      memberSince: 'نوفمبر 2024',
    };

    saveMerchantProfile(newProfile);

    setTimeout(() => {
      setIsLoading(false);
      // Redirect to the merchant dashboard
      router.push('/merchant');
    }, 700);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100/70 to-slate-200/50 flex flex-col justify-center py-8 px-3 sm:px-6" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f2d4a] text-white shadow-md font-black text-lg">
              ت
            </div>
            <span className="text-2xl font-black text-[#0f2d4a]">توريد</span>
          </Link>
        </div>

        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>تسجيل مجاني لأصحاب السوبر ماركت والمتاجر</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            انضم لمنظومة توريد وابدأ الشراء بسعر المصنع
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            اربط محلك مع كبرى شركات الأغذية والمشروبات واطلب بضاعة محلك بأسعار الجملة المباشرة
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-10 shadow-lg rounded-3xl border border-slate-200/90 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Store Name & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم السوبر ماركت / المحل *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <Store className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سوبر ماركت العمده"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-[#0f2d4a] focus:ring-1 focus:ring-[#0f2d4a] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نوع النشاط التجاري
                </label>
                <select
                  value={storeType}
                  onChange={(e) => setStoreType(e.target.value as StoreType)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-[#0f2d4a] outline-none bg-white font-medium"
                >
                  {STORE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Owner Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم صاحب المحل / المسؤول *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أحمد عادل"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-[#0f2d4a] focus:ring-1 focus:ring-[#0f2d4a] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رقم الهاتف المحمول (واتساب) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={11}
                    placeholder="010xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-[#0f2d4a] outline-none font-mono transition-all text-left"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* Governorate & Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المحافظة
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-[#0f2d4a] outline-none bg-white font-medium"
                >
                  {GOVERNORATES.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المنطقة / الحي *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="مثال: شبين، حي السلام، وسط البلد"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-[#0f2d4a] outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                عنوان المحل بالتفصيل (لتوصيل سيارات المصانع)
              </label>
              <input
                type="text"
                placeholder="مثال: شارع الجمهورية، بجوار مسجد النور، شبين"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-[#0f2d4a] outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                كلمة المرور *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-9 pl-10 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-[#0f2d4a] outline-none transition-all text-left"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Micro Guarantees */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Truck className="h-3.5 w-3.5 text-emerald-600" />
                <span>توصيل مجاني لباب المحل</span>
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>الدفع كاش عند الاستلام</span>
              </span>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-md text-white bg-[#0f2d4a] hover:bg-blue-900 font-bold text-sm transition-all cursor-pointer disabled:opacity-50 mt-4"
            >
              {isLoading ? (
                <span>جاري إنشاء الحساب والدخول...</span>
              ) : (
                <>
                  <span>تسجيل الحساب وبدء التوريد</span>
                  <ArrowRight className="h-4 w-4 rotate-180" />
                </>
              )}
            </button>
          </form>

          {/* Direct Entry Shortcut */}
          <div className="border-t border-slate-100 pt-4 text-center space-y-2">
            <p className="text-xs text-slate-500">
              مسجل بالفعل أو تريد الدخول للوحة التحكم مباشرة؟
            </p>
            <Link
              href="/merchant"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0f2d4a] hover:text-blue-700 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl transition-all"
            >
              <span>الدخول المباشر لبوابة التاجر</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
