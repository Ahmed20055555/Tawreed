'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Wallet,
  Sparkles,
  Ticket,
  Copy,
  Check,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Percent,
  Clock,
  ChevronLeft,
  Truck,
  CreditCard,
  Headphones,
  Zap,
} from 'lucide-react';
import { WALLET_COUPONS, WALLET_TRANSACTIONS } from '@/data/merchant-extra-mock';
import { useMerchant } from '@/context/MerchantContext';

export default function RewardsPage() {
  const { profile } = useMerchant();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* VIP Loyalty Hero Card */}
      <div className="bg-gradient-to-br from-[#0f2d4a] via-[#1a446c] to-[#0a1e32] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400/20 to-amber-500/10 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>نادي كبار تجار الجملة VIP</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black">
                محفظة الكاش باك والمكافآت 💰
              </h1>
              <p className="text-slate-300 text-sm mt-1">
                كل طلبية تطلبها لمحلك بترجعلك كاش باك ونقاط خصم حقيقية تخصمها من فواتيرك القادمة.
              </p>
            </div>

            {/* Merchant Tier Badge */}
            <div className="flex items-center gap-2 pt-1">
              <span className="bg-amber-400 text-[#0f2d4a] font-extrabold text-xs px-3 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                <Award className="w-3.5 h-3.5" />
                رتبة تاجر ذهبي VIP
              </span>
              <span suppressHydrationWarning className="text-xs text-slate-300 font-medium">
                {profile?.storeName || 'العمده'} ({profile?.area || 'شبين، الإسماعيلية'})
              </span>
            </div>
          </div>

          {/* Wallet Balance Display */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-6 w-full lg:w-80 shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Wallet className="w-4 h-4 text-emerald-400" />
                رصيد الكاش باك المتاح
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                جاهز للخصم
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight my-2">
              1,480 <span className="text-lg font-bold text-amber-300">ج.م</span>
            </div>
            <div className="text-xs text-slate-300 flex items-center justify-between pt-2 border-t border-white/10">
              <span>إجمالي وفوراتك التاريخية:</span>
              <span className="font-bold text-emerald-400">4,920 ج.م</span>
            </div>
          </div>
        </div>

        {/* Tier Progress Bar */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-200">الترقية إلى تاجر بلاتيني 💎 (كاش باك 5% وتوصيل مجاني دائم)</span>
            <span className="font-bold text-amber-300">75% مكتمل</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: '75%' }}
            />
          </div>
          <p className="text-[11px] text-slate-300 mt-2">
            باقي لك طلبيتين فقط بقيمة 3,500 ج.م للوصول للمستوى البلاتيني والاستمتاع بأعلى ميزات المنصة.
          </p>
        </div>
      </div>

      {/* VIP Merchant Privileges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-200/80 shadow-xs flex items-start gap-2.5 sm:gap-4">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Percent className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="font-bold text-xs sm:text-sm text-slate-900">كاش باك 3% فوري</h2>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 leading-snug">
              ينزل رصيدك تلقائياً في المحفظة بعد فحص كل طلبية.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-200/80 shadow-xs flex items-start gap-2.5 sm:gap-4">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="font-bold text-xs sm:text-sm text-slate-900">أولوية الشحن</h2>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 leading-snug">
              سيارات مصانع التوريد تفرغ بضاعتك أولاً بمنطقتك.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-200/80 shadow-xs flex items-start gap-2.5 sm:gap-4">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="font-bold text-xs sm:text-sm text-slate-900">تسهيلات دفع آجل</h2>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 leading-snug">
              حد ائتماني ومرونة سداد مع كبرى المصانع لانتظامك.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-200/80 shadow-xs flex items-start gap-2.5 sm:gap-4">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Headphones className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="font-bold text-xs sm:text-sm text-slate-900">مدير حساب مخصص</h2>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 leading-snug">
              خط مباشر عبر الواتساب لحل أي استفسار أو طلب كميات.
            </p>
          </div>
        </div>
      </div>

      {/* Coupons Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm p-4 sm:p-8 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full mb-1">
              <Ticket className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>كوبونات وخصومات التوريد</span>
            </div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900">
              كوبونات حصرية لمحلك 🎟️
            </h2>
            <p className="text-[11px] sm:text-sm text-slate-500 mt-0.5">
              انسخ كود الخصم وطبّقه مباشرة عند إتمام الطلبية لخصم المبلغ من الفاتورة.
            </p>
          </div>

          <Link
            href="/merchant/cart"
            className="text-xs sm:text-sm font-bold text-[#0f2d4a] hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>استخدم في سلة الطلب</span>
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {WALLET_COUPONS.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-gradient-to-br from-slate-50 to-white rounded-xl sm:rounded-2xl border border-dashed border-slate-300 p-3.5 sm:p-5 flex flex-col justify-between hover:border-amber-400 hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    {coupon.supplierName}
                  </span>
                  <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200/60 font-bold px-2 py-0.5 rounded-full">
                    {coupon.expiresIn}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {coupon.discountValue}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    للطلبيات التي تزيد عن {coupon.minOrder.toLocaleString()} ج.م
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="font-mono text-sm font-black text-[#0f2d4a] bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 tracking-wider">
                  {coupon.code}
                </div>

                <button
                  onClick={() => handleCopy(coupon.code)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    copiedCode === coupon.code
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ الكود</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions History */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            سجل حركات الكاش باك والمكافآت 📜
          </h2>
          <span className="text-xs text-slate-400">آخر 4 حركات</span>
        </div>

        <div className="divide-y divide-slate-100">
          {WALLET_TRANSACTIONS.map((tx) => (
            <div
              key={tx.id}
              className="py-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 px-3 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    tx.type === 'earn'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {tx.type === 'earn' ? '+' : '-'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{tx.description}</h4>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                    {tx.orderNumber && <span>طلب رقم: {tx.orderNumber}</span>}
                    {tx.orderNumber && <span>•</span>}
                    <span>{tx.date}</span>
                  </div>
                </div>
              </div>

              <div
                className={`font-black text-base sm:text-lg ${
                  tx.type === 'earn' ? 'text-emerald-600' : 'text-slate-800'
                }`}
              >
                {tx.amount > 0 ? `+${tx.amount}` : tx.amount} ج.م
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
