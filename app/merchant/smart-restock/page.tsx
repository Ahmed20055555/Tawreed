'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  PackageCheck,
  ShoppingCart,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  Clock,
  Building2,
  ListPlus,
  Check,
  TrendingUp,
} from 'lucide-react';
import { RESTOCK_PRESETS } from '@/data/merchant-extra-mock';
import { RestockPreset, RestockItem } from '@/types/merchant-extra';
import { useMerchant } from '@/context/MerchantContext';

export default function SmartRestockPage() {
  const { addToCart, cartCount } = useMerchant();

  // Local state for quantity modifiers inside presets: { [presetId_productId]: qty }
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    RESTOCK_PRESETS.forEach((preset) => {
      preset.items.forEach((item) => {
        initial[`${preset.id}_${item.productId}`] = item.recommendedQty;
      });
    });
    return initial;
  });

  const [addedPresets, setAddedPresets] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'presets' | 'checklist'>('presets');

  // Custom Quick Checklist State for supermarket owner
  const [customList, setCustomList] = useState<
    Array<{ id: string; name: string; unit: string; price: number; supplierName: string; supplierId: string; checked: boolean; qty: number }>
  >([
    { id: 'prod-103', name: 'أرز الأهرام عريض فاخر (1 كجم)', unit: 'بالتة 10 أكياس', price: 310, supplierName: 'شركة الأهرام', supplierId: 'sup-1', checked: true, qty: 2 },
    { id: 'prod-106', name: 'سكر أبيض نقي فاخر (1 كجم)', unit: 'ربطة 10 أكياس', price: 330, supplierName: 'شركة الأهرام', supplierId: 'sup-1', checked: true, qty: 1 },
    { id: 'prod-501', name: 'زيت ذرة ممتاز الشرق (800 مل)', unit: 'كرتونة 12 زجاجة', price: 790, supplierName: 'مصانع الشرق', supplierId: 'sup-5', checked: true, qty: 1 },
    { id: 'prod-201', name: 'حليب النيل UHT معقم (1 لتر)', unit: 'كرتونة 12 علبة', price: 430, supplierName: 'ألبان النيل', supplierId: 'sup-2', checked: false, qty: 1 },
    { id: 'prod-101', name: 'شيبسي عائلي جبنة متبلة', unit: 'كرتونة 24 كيس', price: 210, supplierName: 'شركة الأهرام', supplierId: 'sup-1', checked: false, qty: 1 },
    { id: 'prod-301', name: 'مسحوق غسيل أوتوماتيك لافندر', unit: 'كرتونة 4 أكياس', price: 490, supplierName: 'مجموعة البركة', supplierId: 'sup-3', checked: false, qty: 1 },
  ]);

  const handleQtyChange = (presetId: string, productId: string, delta: number) => {
    const key = `${presetId}_${productId}`;
    setQuantities((prev) => {
      const current = prev[key] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [key]: next };
    });
  };

  const getPresetTotal = (preset: RestockPreset) => {
    return preset.items.reduce((sum, item) => {
      const qty = quantities[`${preset.id}_${item.productId}`] ?? item.recommendedQty;
      return sum + item.price * qty;
    }, 0);
  };

  const handleAddPresetToCart = (preset: RestockPreset) => {
    preset.items.forEach((item) => {
      const qty = quantities[`${preset.id}_${item.productId}`] ?? item.recommendedQty;
      addToCart(
        {
          id: item.productId,
          supplierId: item.supplierId,
          name: item.productName,
          category: 'توريد سريع',
          unit: item.unit,
          price: item.price,
          inStock: true,
          supplierName: item.supplierName,
        },
        qty
      );
    });

    setAddedPresets((prev) => ({ ...prev, [preset.id]: true }));
    setTimeout(() => {
      setAddedPresets((prev) => ({ ...prev, [preset.id]: false }));
    }, 3000);
  };

  const handleAddCustomListToCart = () => {
    const selected = customList.filter((item) => item.checked && item.qty > 0);
    if (selected.length === 0) return;

    selected.forEach((item) => {
      addToCart(
        {
          id: item.id,
          supplierId: item.supplierId,
          name: item.name,
          category: 'نواقص سريعة',
          unit: item.unit,
          price: item.price,
          inStock: true,
          supplierName: item.supplierName,
        },
        item.qty
      );
    });

    alert(`تمت إضافة ${selected.length} أصناف من قائمة النواقص إلى سلة مشترياتك بنجاح!`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0f2d4a] via-[#163e66] to-[#0f2d4a] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>نظام الحصر الذكي للنواقص اليومية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              طلبية النواقص السريعة ⚡
            </h1>
            <p className="text-slate-200 text-sm sm:text-base max-w-2xl leading-relaxed">
              وفّر وقت كتابة الكشاكيل وانتظار المناديب! باقات متكاملة لأهم احتياجات السوبر ماركت المصري بأسعار المصنع، بضغطة زر تنزل في سلتك فوراً.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/merchant/cart"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>سلة المشتريات ({cartCount})</span>
            </Link>
          </div>
        </div>

        {/* Mini stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="text-xs text-slate-300">سعر جملة المصنع</div>
            <div className="text-lg font-bold text-emerald-400">بدون عمولة وسيط</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="text-xs text-slate-300">سرعة التحضير</div>
            <div className="text-lg font-bold text-amber-300">نقرة واحدة فقط</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="text-xs text-slate-300">توصيل المحل</div>
            <div className="text-lg font-bold text-white">خلال 24-48 ساعة</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="text-xs text-slate-300">ضمان الاسترجاع</div>
            <div className="text-lg font-bold text-emerald-300">فحص عند الاستلام</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('presets')}
          className={`pb-2.5 px-3 sm:px-4 font-bold text-xs sm:text-base border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'presets'
              ? 'border-[#0f2d4a] text-[#0f2d4a]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
          <span>باقات النواقص الجاهزة (4 باقات)</span>
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`pb-2.5 px-3 sm:px-4 font-bold text-xs sm:text-base border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'checklist'
              ? 'border-[#0f2d4a] text-[#0f2d4a]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ListPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
          <span>دفتر النواقص السريع (اختر بنفسك)</span>
        </button>
      </div>

      {/* Tab 1: Presets */}
      {activeTab === 'presets' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {RESTOCK_PRESETS.map((preset) => {
              const currentTotal = getPresetTotal(preset);
              const isAdded = !!addedPresets[preset.id];

              return (
                <div
                  key={preset.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden"
                >
                  {/* Preset Header */}
                  <div className="p-3.5 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-amber-200/70">
                        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        {preset.badge}
                      </span>
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                        {preset.itemsCount} أصناف أساسية
                      </span>
                    </div>

                    <h2 className="text-base sm:text-xl font-bold text-slate-900 mb-0.5 sm:mb-1">{preset.title}</h2>
                    <p className="text-[11px] sm:text-sm text-slate-600 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  {/* Preset Items List */}
                  <div className="p-3 sm:p-6 space-y-2 sm:space-y-3.5 flex-1">
                    <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      محتويات الباقة وإمكانية تعديل الكميات:
                    </div>

                    {preset.items.map((item) => {
                      const qty = quantities[`${preset.id}_${item.productId}`] ?? item.recommendedQty;
                      const lineTotal = item.price * qty;

                      return (
                        <div
                          key={item.productId}
                          className="flex items-center justify-between gap-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {item.productName}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500 mt-0.5">
                              <span className="inline-flex items-center gap-0.5 text-slate-600">
                                <Building2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400" />
                                {item.supplierName}
                              </span>
                              <span>•</span>
                              <span>{item.unit}</span>
                            </div>
                          </div>

                          {/* Stepper + Price */}
                          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <div className="flex items-center bg-white rounded-lg sm:rounded-xl border border-slate-200 shadow-xs px-0.5 py-0.5">
                              <button
                                onClick={() => handleQtyChange(preset.id, item.productId, -1)}
                                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                                title="إنقاص"
                              >
                                <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              </button>
                              <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-bold text-slate-800">
                                {qty}
                              </span>
                              <button
                                onClick={() => handleQtyChange(preset.id, item.productId, 1)}
                                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                                title="زيادة"
                              >
                                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              </button>
                            </div>

                            <div className="text-left w-16 sm:w-20">
                              <div className="text-xs sm:text-sm font-bold text-slate-900">
                                {lineTotal.toLocaleString()} ج
                              </div>
                              <div className="text-[9px] text-slate-400">
                                ({item.price} ج/وحدة)
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Preset Footer Action */}
                  <div className="p-3.5 sm:p-6 pt-3 sm:pt-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    <div className="w-full sm:w-auto flex items-center justify-between sm:block">
                      <div className="text-[10px] sm:text-xs text-slate-500 font-medium">إجمالي الباقة التقديري:</div>
                      <div className="text-lg sm:text-2xl font-black text-[#0f2d4a]">
                        {currentTotal.toLocaleString()}{' '}
                        <span className="text-xs sm:text-sm font-bold text-slate-600">ج.م</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddPresetToCart(preset)}
                      className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#0f2d4a] hover:bg-[#163e66] text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>تمت الإضافة للسلة!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>أضف الباقة بالكامل للسلة</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Custom Checklist */}
      {activeTab === 'checklist' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                دفتر حصر النواقص السريع لمحلك 📝
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                علّم على النواقص اللي محتاجها حالياً وحدد الكميات وسجلها في طلبيتك دفعة واحدة.
              </p>
            </div>

            <button
              onClick={handleAddCustomListToCart}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>إضافة الأصناف المحددة للسلة</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {customList.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 px-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setCustomList((prev) =>
                        prev.map((it) => (it.id === item.id ? { ...it, checked } : it))
                      );
                    }}
                    className="w-5 h-5 text-emerald-600 rounded-lg border-slate-300 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <h3 className={`font-bold text-sm sm:text-base ${item.checked ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                      {item.name}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{item.supplierName}</span>
                      <span>•</span>
                      <span>{item.unit}</span>
                      <span>•</span>
                      <span className="font-semibold text-emerald-700">{item.price} ج.م</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="flex items-center bg-white rounded-xl border border-slate-200 px-1 py-0.5">
                    <button
                      onClick={() => {
                        setCustomList((prev) =>
                          prev.map((it) =>
                            it.id === item.id ? { ...it, qty: Math.max(1, it.qty - 1) } : it
                          )
                        );
                      }}
                      className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-lg"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-slate-800">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => {
                        setCustomList((prev) =>
                          prev.map((it) =>
                            it.id === item.id ? { ...it, qty: it.qty + 1 } : it
                          )
                        );
                      }}
                      className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-lg"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-left w-24">
                    <div className="font-bold text-sm text-slate-900">
                      {(item.price * item.qty).toLocaleString()} ج.م
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
