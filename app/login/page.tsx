'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) {
      setError('يرجى إدخال اسم المستخدم');
      return;
    }
    if (!password) {
      setError('يرجى إدخال كلمة المرور');
      return;
    }

    setIsLoading(true);

    try {
      if (typeof window !== 'undefined') {
        const savedData = localStorage.getItem('tawreed_company_user');
        if (savedData) {
          const user = JSON.parse(savedData);
          if (
            user.username?.toLowerCase() === cleanUsername &&
            user.password === password
          ) {
            // Success
            localStorage.setItem(
              'tawreed_active_session',
              JSON.stringify({
                username: user.username,
                role: 'company',
                name: user.companyName,
                isLoggedIn: true,
              })
            );
            setIsSuccess(true);
            setTimeout(() => {
              router.push('/dashboard/company');
            }, 800);
            return;
          }
        }

        // Demo fallback or incorrect credentials
        if (cleanUsername === 'admin' && password === 'admin123') {
          setIsSuccess(true);
          setTimeout(() => {
            router.push('/dashboard/company');
          }, 800);
          return;
        }

        setError('اسم المستخدم أو كلمة المرور غير صحيحة. يرجى التأكد من البيانات أو تسجيل حساب جديد.');
        setIsLoading(false);
      }
    } catch {
      setError('حدث خطأ أثناء تسجيل الدخول');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col justify-between">
      {/* Header */}
      <header className="w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-xs font-black text-base transition-transform group-hover:scale-105">
              ت
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-primary leading-none">
                توريد
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                سوق الجملة الذكي
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
          >
            الرئيسية
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200/90">
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-primary">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              تسجيل الدخول
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              أدخل اسم المستخدم وكلمة المرور الخاصة بحسابك
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>تم تسجيل الدخول بنجاح! جاري تحويلك...</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                اسم المستخدم (Username)
              </label>
              <div className="relative">
                <input
                  type="text"
                  dir="ltr"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="company_user"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-right font-mono"
                  required
                />
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                كلمة المرور (Password)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-10 text-xs sm:text-sm text-gray-900 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-primary/95 transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري التحقق...</span>
                </>
              ) : (
                <>
                  <span>دخول إلى لوحة التحكم</span>
                  <ArrowLeft className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              ليس لديك حساب بعد؟{' '}
              <Link
                href="/register/company"
                className="font-bold text-primary underline underline-offset-2 hover:text-accent transition-colors"
              >
                سجّل شركتك الآن
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} توريد - سوق الجملة الذكي
      </footer>
    </div>
  );
}
