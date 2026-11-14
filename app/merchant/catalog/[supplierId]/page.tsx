'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Package,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  Tag,
  Building2,
  Store,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';
import {
  getTierProducts,
  getPriceTiers,
  getCurrentMerchantSession,
} from '@/lib/mock-api';
import { TierProduct, PriceTier, PricingMerchant } from '@/types/pricing';

export default function MerchantCatalogPage() {
  const params = useParams();
  const supplierId = params?.supplierId as string || 'default';

  const [products, setProducts] = useState<TierProduct[]>([]);
  const [tiers, setTiers] = useState<PriceTier[]>([]);
  const [merchant, setMerchant] = useState<PricingMerchant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  // Cart state: Record<productId, quantity>
  const [cart, setCart] = useState<Record<string, number>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setProducts(getTierProducts());
    setTiers(getPriceTiers());
    setMerchant(getCurrentMerchantSession());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // The merchant's tier (strictly isolated)
  const myTier = useMemo(() => {
    if (!merchant?.tierId) return null;
    return tiers.find((t) => t.id === merchant.tierId) || null;
  }, [merchant, tiers]);

  // Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ['الكل', ...Array.from(set)];
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'الكل' || p.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Cart quantity controls
  const handleQtyChange = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    } else {
      setCart((prev) => ({
        ...prev,
        [productId]: qty,
      }));
    }
  };

  // Cart totals calculation
  const cartSummary = useMemo(() => {
    let totalItems = 0;
    let totalPrice = 0;

    Object.entries(cart).forEach(([prodId, qty]) => {
      const prod = products.find((p) => p.id === prodId);
      if (!prod) return;

      // Special override or Tier price ONLY
      const specialPrice = merchant?.specialPrices?.[prodId];
      const tierPrice = myTier ? prod.tierPrices[myTier.id] : null;
      const finalPrice = specialPrice !== undefined ? specialPrice : tierPrice;

      if (finalPrice !== null && finalPrice !== undefined) {
        totalItems += qty;
        totalPrice += finalPrice * qty;
      }
    });

    return { totalItems, totalPrice };
  }, [cart, products, merchant, myTier]);

  const handleCheckout = () => {
    if (myTier?.minOrderValue && cartSummary.totalPrice < myTier.minOrderValue) {
      showToast(
        `تنبيه: الحد الأدنى لقيمة الطلب لشريحتك هو ${myTier.minOrderValue.toLocaleString()} ج.م`
      );
      return;
    }

    console.log('[MerchantCatalog] Order placed by merchant:', {
      merchantId: merchant?.id,
      supplierId,
      cart,
      totalPrice: cartSummary.totalPrice,
    });
    // TODO(backend): replace with real API call
    showToast(`تم إرسال طلبك بنجاح بإجمالي ${cartSummary.totalPrice.toLocaleString()} ج.م!`);
    setCart({});
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-gray-900 flex flex-col font-sans" dir="rtl">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs sm:text-sm text-white shadow-xl animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Merchant Header */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#0f2d4a] text-white shadow-xs font-black text-sm sm:text-base">
                ت
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-base font-black tracking-tight text-[#0f2d4a] leading-none">
                  توريد
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
                  كتالوج أسعار الجملة المباشرة
                </span>
              </div>
            </Link>
          </div>

          {/* Merchant Identity & Assigned Tier */}
          <div className="flex items-center gap-2 sm:gap-3">
            {merchant && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 sm:px-3 py-1 rounded-xl">
                <Store className="h-3.5 w-3.5 text-[#0f2d4a]" />
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-gray-900">{merchant.name}</span>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    {myTier ? myTier.name : 'بدون شريحة أسعار'}
                  </span>
                </div>
              </div>
            )}

            <Link
              href="/supplier/price-tiers"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span>لوحة المورد</span>
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-28">
        {/* Tier Banner for this merchant */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-[#0f2d4a] to-[#1e4e79] text-white p-5 sm:p-6 shadow-md">
          <div className="relative z-10 max-w-2xl space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>أسعار الجملة الحصرية لحسابك</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              كتالوج شركة الأهرام للصناعات الغذائية
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              جميع الأسعار المعروضة أدناه مخصصة حصرياً لك وفقاً لـ (
              <strong className="text-white font-bold">{myTier ? myTier.name : 'شريحة حسابك'}</strong>
              ). الدفع عند الاستلام مع فحص البضاعة.
            </p>

            {myTier?.minOrderValue && (
              <div className="pt-2 text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                <span>الحد الأدنى للطلبية: {myTier.minOrderValue.toLocaleString()} ج.م</span>
              </div>
            )}
          </div>
        </div>

        {/* Filter bar */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث بالاسم أو كود الصنف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-slate-50/70 pr-10 pl-4 py-2 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'الكل' ? 'جميع التصنيفات' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
          {filteredProducts.map((prod) => {
            // STRICTLY compute ONLY this merchant's price
            const specialPrice = merchant?.specialPrices?.[prod.id];
            const tierPrice = myTier ? prod.tierPrices[myTier.id] : null;
            const finalPrice = specialPrice !== undefined ? specialPrice : tierPrice;
            const isUnpriced = finalPrice === null || finalPrice === undefined;

            const inCartQty = cart[prod.id] || 0;

            return (
              <div
                key={prod.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-4 transition-all bg-white shadow-xs ${
                  isUnpriced
                    ? 'border-dashed border-gray-300 opacity-70'
                    : 'border-slate-200/90 hover:shadow-md hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Category and SKU */}
                  <div className="flex items-center justify-between text-[11px] mb-2 text-gray-400">
                    <span>{prod.category}</span>
                    <span className="font-mono">{prod.sku}</span>
                  </div>

                  {/* Visual placeholder */}
                  <div className="flex h-20 w-full items-center justify-center rounded-xl bg-slate-100 text-slate-500 mb-3 border border-slate-200">
                    <Package className="h-10 w-10 text-slate-400" />
                  </div>

                  <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug">
                    {prod.name}
                  </h3>
                  <span className="text-[11px] text-gray-500 mt-1 block">
                    التعبئة: {prod.unit}
                  </span>

                  {specialPrice !== undefined && (
                    <span className="inline-block mt-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      ★ سعر حصري خاص بمتجرك
                    </span>
                  )}
                </div>

                {/* Price & Cart Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {isUnpriced ? (
                    <div className="text-center py-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <span className="text-xs font-bold text-gray-400 block">
                        السعر غير محدد
                      </span>
                      <span className="text-[10px] text-gray-400">
                        غير متاح للطلب حالياً
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] text-gray-500 font-medium">سعرك:</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-emerald-700">
                            {finalPrice.toLocaleString()}
                          </span>
                          <span className="text-[11px] text-gray-500">ج.م / كرتونة</span>
                        </div>
                      </div>

                      {/* Quantity input & Add to Cart button */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                          <button
                            type="button"
                            onClick={() => handleQtyChange(prod.id, Math.max(0, inCartQty - 1))}
                            className="h-7 w-7 rounded-lg bg-white text-gray-700 font-bold hover:bg-gray-100 flex items-center justify-center text-sm shadow-xs"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={inCartQty}
                            onChange={(e) => {
                              const val = Math.max(0, parseInt(e.target.value) || 0);
                              handleQtyChange(prod.id, val);
                            }}
                            className="w-10 text-center text-xs font-bold bg-transparent text-gray-900 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleQtyChange(prod.id, inCartQty + 1)}
                            className="h-7 w-7 rounded-lg bg-white text-gray-700 font-bold hover:bg-gray-100 flex items-center justify-center text-sm shadow-xs"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (inCartQty === 0) {
                              handleQtyChange(prod.id, 1);
                              showToast(`تمت إضافة 1 كرتونة من ${prod.name} للسلة`);
                            } else {
                              showToast(`تم تحديث كمية ${prod.name} إلى ${inCartQty} كرتونة`);
                            }
                          }}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition-all shadow-xs ${
                            inCartQty > 0
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#0f2d4a] hover:bg-[#163e63] text-white'
                          }`}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          <span>{inCartQty > 0 ? `في السلة (${inCartQty})` : 'أضف للسلة'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Bottom Cart Bar */}
      {cartSummary.totalItems > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 shadow-2xl animate-in slide-in-from-bottom">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-sm shadow-xs">
                {cartSummary.totalItems}
              </div>
              <div>
                <span className="text-[11px] text-gray-500 font-medium block">
                  إجمالي طلبك ({cartSummary.totalItems} كرتونة):
                </span>
                <span className="text-base sm:text-xl font-black text-emerald-800">
                  {cartSummary.totalPrice.toLocaleString()} ج.م
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCart({})}
                className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                تفريغ السلة
              </button>

              <button
                type="button"
                onClick={handleCheckout}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0f2d4a] hover:bg-[#163e63] px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all active:scale-[0.98]"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>إرسال الطلب للمورد</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
