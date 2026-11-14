'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Lock,
  User,
  Phone,
  MapPin,
  Briefcase,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'القليوبية',
  'الشرقية',
  'الدقهلية',
  'الغربية',
  'المنوفية',
  'البحيرة',
  'كفر الشيخ',
  'دمياط',
  'بورسعيد',
  'الإسماعيلية',
  'السويس',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'البحر الأحمر',
  'مطروح',
];

export default function RegisterCompanyPage() {
  const router = useRouter();

  // Pure frontend state
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [phone, setPhone] = useState('');

  // Login credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Front-end validations
    if (!companyName.trim()) {
      setError('يرجى إدخال اسم الشركة');
      return;
    }
    if (!industry.trim()) {
      setError('يرجى كتابة مجال التوريد');
      return;
    }
    if (!governorate) {
      setError('يرجى اختيار المحافظة');
      return;
    }
    if (!phone.trim()) {
      setError('يرجى إدخال رقم الهاتف');
      return;
    }
    if (!username.trim()) {
      setError('يرجى إدخال اسم المستخدم');
      return;
    }
    if (!password) {
      setError('يرجى إدخال كلمة المرور');
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقين');
      return;
    }

    // Pure frontend storage
    const companyData = {
      role: 'company',
      companyName: companyName.trim(),
      industry: industry.trim(),
      governorate,
      phone: phone.trim(),
      username: username.trim().toLowerCase(),
      password,
      registeredAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('tawreed_company_user', JSON.stringify(companyData));
      localStorage.setItem(
        'tawreed_active_session',
        JSON.stringify({
          username: companyData.username,
          role: 'company',
          name: companyData.companyName,
          isLoggedIn: true,
        })
      );
    }

    // Direct frontend redirect to dashboard immediately
    router.push('/dashboard/company');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col justify-between">
      {/* Header - متجاوب وخفيف على الموبايل */}
      <header className="w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-3 sm:px-6 py-2 sm:py-3">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-primary text-white shadow-xs font-black text-sm sm:text-base transition-transform group-hover:scale-105">
              ت
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-black tracking-tight text-primary leading-none">
                توريد
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
                سوق الجملة الذكي
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <span className="text-slate-400 hidden xs:inline text-[11px] sm:text-xs">مسجل بالفعل؟</span>
            <Link
              href="/login"
              className="font-bold text-primary hover:text-accent transition-colors underline underline-offset-4 text-xs sm:text-sm"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container - هوامش ومقاسات مدروسة للموبايل والشاشات الكبيرة */}
      <main className="flex-1 py-3 sm:py-8 md:py-10 px-3 sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-lg">
          {/* Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-7 shadow-xs">
            {/* Header info */}
            <div className="text-center pb-3.5 sm:pb-4 mb-3.5 sm:mb-4 border-b border-slate-100">
              <div className="mx-auto mb-2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-50 text-primary">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50/70 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-primary mb-1.5">
                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-accent" />
                <span>حساب شركة / مورّد</span>
              </div>
              <h1 className="text-base sm:text-xl font-black text-gray-900 tracking-tight">
                سجّل شركتك وابدأ التوريد
              </h1>
              <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500">
                أدخل بياناتك للانتقال فوراً للوحة التحكم
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-3.5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-[11px] sm:text-xs text-red-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
              {/* 1. اسم الشركة */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-gray-700 mb-1">
                  اسم الشركة أو المصنع <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="مثال: شركة الهدى للصناعات الغذائية"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-8 pr-3 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-[11px] sm:placeholder:text-xs placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-right"
                    required
                  />
                  <Building2 className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 2. مجال التوريد + المحافظة (صف واحد على الشاشات الكبيرة وفوق بعض بشكل مريح على الموبايل) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {/* مجال التوريد */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-gray-700 mb-1">
                    مجال التوريد <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="مثال: مواد غذائية، ألبان، حلويات..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-8 pr-3 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-[11px] sm:placeholder:text-xs placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-right"
                      required
                    />
                    <Briefcase className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* المحافظة */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-gray-700 mb-1">
                    المحافظة <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-8 pr-3 py-2 text-xs sm:text-sm text-gray-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="">اختر المحافظة...</option>
                      {GOVERNORATES.map((gov) => (
                        <option key={gov} value={gov}>
                          {gov}
                        </option>
                      ))}
                    </select>
                    <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* 3. رقم الهاتف */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-gray-700 mb-1">
                  رقم الهاتف أو واتساب <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-8 pr-3 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-[11px] sm:placeholder:text-xs placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-right font-mono"
                    required
                  />
                  <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* خط فاصل أنيق ومضغوط */}
              <div className="pt-2 pb-0.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-bold text-slate-600">
                  بيانات تسجيل الدخول لحسابك:
                </span>
                <span className="text-[10px] text-slate-400">
                  للدخول مستقبلاً
                </span>
              </div>

              {/* 4. اسم المستخدم */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-gray-700 mb-1">
                  اسم المستخدم (Username) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    dir="ltr"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))}
                    placeholder="company_user"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-8 pr-3 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-[11px] sm:placeholder:text-xs placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-right font-mono"
                    required
                  />
                  <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 5. كلمة المرور وتأكيدها */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-gray-700 mb-1">
                    كلمة المرور <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      dir="ltr"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-8 pr-3 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-2.5 top-2 text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
                      aria-label="إظهار/إخفاء كلمة المرور"
                    >
                      {showPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-gray-700 mb-1">
                    تأكيد كلمة المرور <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      dir="ltr"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-8 pr-3 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                      required
                    />
                    <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* زر التسجيل - مقاس وكلام مضبوط تماماً بدون قص على الموبايل */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-primary/95 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span>إنشاء حساب الشركة</span>
                  <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                </button>
              </div>

              <p className="text-[10px] sm:text-[11px] text-center text-slate-400 pt-0.5 leading-tight">
                بالضغط على إنشاء الحساب، أنت توافق على شروط الاستخدام في منصة توريد.
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-2.5 text-center text-[10px] sm:text-xs text-slate-400">
        © {new Date().getFullYear()} توريد - سوق الجملة الذكي
      </footer>
    </div>
  );
}
