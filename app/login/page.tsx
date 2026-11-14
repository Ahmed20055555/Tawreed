import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-slate-100 text-center">
        <h1 className="text-2xl font-bold text-primary mb-3">تسجيل الدخول</h1>
        <p className="text-gray-500 text-sm mb-6">صفحة تسجيل الدخول للمستخدمين (قريباً)</p>
        <Link
          href="/"
          className="text-sm font-semibold text-primary hover:underline"
        >
          العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}
