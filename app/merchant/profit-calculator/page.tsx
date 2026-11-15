'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Printer,
  Sparkles,
  TrendingUp,
  Percent,
  Package,
  Layers,
  ArrowRight,
  Check,
  Tag,
  DollarSign,
  Info,
  Barcode,
  Store,
} from 'lucide-react';
import { PRICING_PRESETS } from '@/data/merchant-extra-mock';
import { PricingPreset } from '@/types/merchant-extra';
import { useMerchant } from '@/context/MerchantContext';

export default function ProfitCalculatorPage() {
  const { profile } = useMerchant();

  // Selected preset or custom
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRICING_PRESETS[0].id);
  const [customName, setCustomName] = useState<string>(PRICING_PRESETS[0].name);
  const [cartonPrice, setCartonPrice] = useState<number>(PRICING_PRESETS[0].cartonPrice);
  const [unitsPerCarton, setUnitsPerCarton] = useState<number>(PRICING_PRESETS[0].unitsPerCarton);
  const [unitName, setUnitName] = useState<string>(PRICING_PRESETS[0].unitName);
  const [marginPercent, setMarginPercent] = useState<number>(PRICING_PRESETS[0].defaultMarginPercent);
  const [overheadPercent, setOverheadPercent] = useState<number>(3); // 3% for electricity & store rent
  const [copiedTag, setCopiedTag] = useState(false);

  const handleSelectPreset = (preset: PricingPreset) => {
    setSelectedPresetId(preset.id);
    setCustomName(preset.name);
    setCartonPrice(preset.cartonPrice);
    setUnitsPerCarton(preset.unitsPerCarton);
    setUnitName(preset.unitName);
    setMarginPercent(preset.defaultMarginPercent);
  };

  // Calculations
  const unitCost = useMemo(() => {
    if (unitsPerCarton <= 0) return 0;
    return cartonPrice / unitsPerCarton;
  }, [cartonPrice, unitsPerCarton]);

  const overheadPerUnit = useMemo(() => {
    return (unitCost * overheadPercent) / 100;
  }, [unitCost, overheadPercent]);

  const effectiveCost = unitCost + overheadPerUnit;

  const suggestedSellingPrice = useMemo(() => {
    if (marginPercent >= 100) return 0;
    // Selling Price = effectiveCost / (1 - marginPercent / 100)
    const raw = effectiveCost * (1 + marginPercent / 100);
    // Round to nearest 0.50 EGP for Egyptian retail reality
    return Math.round(raw * 2) / 2;
  }, [effectiveCost, marginPercent]);

  const profitPerUnit = useMemo(() => {
    return Math.max(0, suggestedSellingPrice - effectiveCost);
  }, [suggestedSellingPrice, effectiveCost]);

  const profitPerCarton = useMemo(() => {
    return profitPerUnit * unitsPerCarton;
  }, [profitPerUnit, unitsPerCarton]);

  const profitTenCartons = profitPerCarton * 10;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0f2d4a] via-[#163e66] to-[#0f2d4a] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1 rounded-full text-xs font-bold">
              <Calculator className="w-3.5 h-3.5" />
              <span>حاسبة هامش الربح وتسعير الرف</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              حاسبة الأرباح والتسعير الذكي للمحل 🧮
            </h1>
            <p className="text-slate-200 text-sm sm:text-base max-w-2xl leading-relaxed">
              احسب تكلفة القطعة بدقة، حدد هامش ربحك المضمون، واطبع استيكر السعر والباركود لأرفف محلك بنقرة واحدة!
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl shadow-lg transition-all shrink-0 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة ملصق السعر للأرفف</span>
          </button>
        </div>
      </div>

      {/* Quick Presets Carousel */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          أصناف سريعة شائعة بالسوبر ماركت:
        </span>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {PRICING_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                selectedPresetId === preset.id
                  ? 'bg-[#0f2d4a] text-white border-[#0f2d4a] shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              {preset.name.split('(')[0]}
            </button>
          ))}
          <button
            onClick={() => {
              setSelectedPresetId('custom');
              setCustomName('صنف جديد');
              setCartonPrice(300);
              setUnitsPerCarton(12);
              setUnitName('قطعة');
              setMarginPercent(20);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
              selectedPresetId === 'custom'
                ? 'bg-[#0f2d4a] text-white border-[#0f2d4a]'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            + صنف مخصص
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs vs Calculation Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Main: Inputs (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span>بيانات التكلفة والتوريد</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">عدّل التكاليف لتحديث الحسبة فورياً</p>
          </div>

          {/* Product Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">اسم الصنف</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full text-sm font-semibold rounded-xl border border-slate-200 px-3.5 py-2.5 focus:border-[#0f2d4a] focus:ring-1 focus:ring-[#0f2d4a] outline-none"
            />
          </div>

          {/* Carton Price + Units */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                سعر شراء الكرتونة (ج.م)
              </label>
              <input
                type="number"
                min="1"
                value={cartonPrice}
                onChange={(e) => setCartonPrice(Number(e.target.value) || 0)}
                className="w-full text-sm font-bold font-mono rounded-xl border border-slate-200 px-3.5 py-2.5 focus:border-[#0f2d4a] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                القطع داخل الكرتونة
              </label>
              <input
                type="number"
                min="1"
                value={unitsPerCarton}
                onChange={(e) => setUnitsPerCarton(Number(e.target.value) || 1)}
                className="w-full text-sm font-bold font-mono rounded-xl border border-slate-200 px-3.5 py-2.5 focus:border-[#0f2d4a] outline-none"
              />
            </div>
          </div>

          {/* Unit Name (e.g. كيس / علبة) */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">وحدة البيع للزبون</label>
            <input
              type="text"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              placeholder="مثال: كيس، علبة، زجاجة"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2 focus:border-[#0f2d4a] outline-none"
            />
          </div>

          {/* Desired Profit Margin Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">هامش الربح المطلوب (%)</label>
              <span className="font-extrabold text-sm text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                {marginPercent}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={marginPercent}
              onChange={(e) => setMarginPercent(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>5% (سلع تموينية سريعة)</span>
              <span>20% (عادية)</span>
              <span>35%+ (سناكس ومقرمشات)</span>
            </div>
          </div>

          {/* Overhead Expenses */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>تغطية كهرباء وإيجار المحل (%)</span>
                <span title="نسبة بسيطة تضمن أن فاتورة الكهرباء والإيجار مدفوعة من هوامش الأصناف">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                </span>
              </label>
              <span className="font-semibold text-xs text-slate-600">{overheadPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={overheadPercent}
              onChange={(e) => setOverheadPercent(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Calculations & Shelf Price Tag Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <div className="text-[11px] font-bold text-slate-400">تكلفة القطعة</div>
              <div className="text-xl font-black text-slate-800 font-mono mt-1">
                {unitCost.toFixed(2)}{' '}
                <span className="text-xs font-semibold text-slate-400">ج</span>
              </div>
            </div>

            <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
              <div className="text-[11px] font-bold text-emerald-800">سعر البيع المقترح</div>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
                {suggestedSellingPrice.toFixed(2)}{' '}
                <span className="text-xs font-bold text-emerald-600">ج</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <div className="text-[11px] font-bold text-slate-400">صافي ربح القطعة</div>
              <div className="text-xl font-black text-blue-600 font-mono mt-1">
                +{profitPerUnit.toFixed(2)}{' '}
                <span className="text-xs font-semibold text-slate-400">ج</span>
              </div>
            </div>

            <div className="bg-amber-50/70 rounded-2xl border border-amber-200/80 p-4 shadow-xs">
              <div className="text-[11px] font-bold text-amber-800">ربح الكرتونة كاملة</div>
              <div className="text-xl font-black text-amber-700 font-mono mt-1">
                +{profitPerCarton.toFixed(0)}{' '}
                <span className="text-xs font-semibold text-amber-600">ج</span>
              </div>
            </div>
          </div>

          {/* Interactive Profit Projection Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>توقعات الأرباح حسب مبيعاتك اليومية والأسبوعية</span>
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                هامش صافي: {marginPercent}%
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="text-xs text-slate-500 font-medium">بيع 5 كراتين</div>
                <div className="text-lg font-black text-slate-900 font-mono mt-1">
                  {(profitPerCarton * 5).toLocaleString()} ج.م
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">صافي ربح لمحلك</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-center">
                <div className="text-xs text-blue-800 font-bold">بيع 10 كراتين</div>
                <div className="text-xl font-black text-blue-700 font-mono mt-1">
                  {profitTenCartons.toLocaleString()} ج.م
                </div>
                <div className="text-[10px] text-blue-500 mt-0.5">حجم سحب أسبوعي</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                <div className="text-xs text-emerald-800 font-bold">بيع 25 كرتونة</div>
                <div className="text-xl font-black text-emerald-700 font-mono mt-1">
                  {(profitPerCarton * 25).toLocaleString()} ج.م
                </div>
                <div className="text-[10px] text-emerald-600 mt-0.5">حجم سحب شهري</div>
              </div>
            </div>
          </div>

          {/* Shelf Price Tag / Sticker Generator (Ready for Print) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-500" />
                  <span>معاينة ملصق السعر للأرفف (Price Tag)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  جاهز للطباعة واللصق على أرفف السوبر ماركت أمام الزبائن
                </p>
              </div>

              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0f2d4a] hover:bg-slate-800 text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة الستيكر</span>
              </button>
            </div>

            {/* Printable Tag Visual Box */}
            <div className="p-6 bg-slate-100 rounded-2xl flex items-center justify-center">
              <div
                id="printable-price-tag"
                className="w-72 bg-white rounded-xl border-2 border-dashed border-slate-400 p-4 shadow-md text-slate-900 space-y-2.5 relative"
              >
                {/* Store Name Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                    <Store className="w-3 h-3 text-emerald-600" />
                    <span>{profile?.storeName || 'سوبر ماركت العمده'}</span>
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {new Date().toLocaleDateString('ar-EG')}
                  </span>
                </div>

                {/* Product Name */}
                <div className="font-black text-sm text-slate-900 truncate">
                  {customName}
                </div>
                <div className="text-[10px] text-slate-500">
                  سعر الـ {unitName} شامل الضريبة
                </div>

                {/* Big Price Display */}
                <div className="bg-slate-50 rounded-lg p-2.5 text-center border border-slate-200">
                  <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {suggestedSellingPrice.toFixed(2)}{' '}
                    <span className="text-sm font-bold">ج.م</span>
                  </div>
                </div>

                {/* Barcode Mock Visual */}
                <div className="pt-1 flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center gap-0.5 h-7 w-48 bg-slate-200/70 p-1 rounded">
                    <div className="w-1 h-full bg-slate-800" />
                    <div className="w-0.5 h-full bg-slate-800" />
                    <div className="w-1.5 h-full bg-slate-800" />
                    <div className="w-0.5 h-full bg-slate-800" />
                    <div className="w-2 h-full bg-slate-800" />
                    <div className="w-1 h-full bg-slate-800" />
                    <div className="w-0.5 h-full bg-slate-800" />
                    <div className="w-1.5 h-full bg-slate-800" />
                    <div className="w-1 h-full bg-slate-800" />
                    <div className="w-2 h-full bg-slate-800" />
                    <div className="w-0.5 h-full bg-slate-800" />
                    <div className="w-1 h-full bg-slate-800" />
                  </div>
                  <span className="text-[8px] font-mono text-slate-400 mt-0.5">
                    6221045982104
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
