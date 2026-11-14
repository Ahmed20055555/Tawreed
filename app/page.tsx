import Link from 'next/link';
import { RoleCard } from '../components/RoleCard';
import { translations } from '../lib/translations';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3.5">
          {/* Logo + Platform Name */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary text-white shadow-xs font-black text-base sm:text-lg transition-transform group-hover:scale-105">
              ت
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-primary leading-none">
                {translations.platformName}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                سوق الجملة الذكي
              </span>
            </div>
          </Link>

          {/* Login Button */}
          <Link
            href="/login"
            className="flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-700 shadow-xs transition-colors hover:border-primary hover:text-primary active:bg-slate-50"
          >
            {translations.login}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-10 md:py-14">
        <div className="w-full max-w-3xl text-center">
          
          {/* Tag Pill */}
          <div className="mb-3 sm:mb-4 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/70 px-3 py-1 text-[11px] sm:text-xs font-semibold text-primary">
            <Zap className="h-3 w-3 text-accent" />
            <span>منصة التوريد المباشر في مصر</span>
          </div>

          {/* Heading */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
            {translations.welcome}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-2 sm:mt-2.5 max-w-md text-xs sm:text-sm md:text-base text-gray-500 leading-relaxed px-2">
            {translations.subtitle}
          </p>

          {/* Two Role Cards */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-3.5 sm:gap-5 text-start md:grid-cols-2 md:gap-6">
            <RoleCard
              href="/register/company"
              icon="factory"
              title={translations.companyTitle}
              description={translations.companyDesc}
              buttonText={translations.companyBtn}
            />
            <RoleCard
              href="/register/merchant"
              icon="store"
              title={translations.merchantTitle}
              description={translations.merchantDesc}
              buttonText={translations.merchantBtn}
            />
          </div>

          {/* Login prompt under cards */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              {translations.haveAccount}{' '}
              <Link
                href="/login"
                className="font-bold text-primary underline decoration-2 underline-offset-4 hover:text-accent transition-colors"
              >
                {translations.login}
              </Link>
            </p>
          </div>

          {/* Badges */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-gray-500">
            <div className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-emerald-800 font-medium">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              <span>{translations.footerNote}</span>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-slate-600 font-medium">
              <ShieldCheck className="h-3 w-3 text-primary" />
              <span>معاملات آمنة وموثوقة</span>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 bg-white py-4 text-center text-[11px] sm:text-xs text-gray-400">
        <div className="mx-auto max-w-5xl px-4">
          © {new Date().getFullYear()} {translations.platformName} - لتسهيل حركة التجارة والتوزيع في مصر
        </div>
      </footer>
    </div>
  );
}
