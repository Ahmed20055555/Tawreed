'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, Check, AlertCircle, Download, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { PriceTier, TierProduct } from '@/types/pricing';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tiers: PriceTier[];
  products: TierProduct[];
  onImportConfirm: (updatedProducts: TierProduct[]) => void;
}

interface ParsedRow {
  sku: string;
  name: string;
  basePrice: number;
  tierPrices: Record<string, number | null>;
  status: 'valid' | 'warning';
  message?: string;
}

export function ExcelImportModal({
  isOpen,
  onClose,
  tiers,
  products,
  onImportConfirm,
}: ExcelImportModalProps) {
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle file selection and client-side parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<Record<string, any>>(ws);

        if (!data || data.length === 0) {
          setError('الملف المرفوع فارغ أو بتنسيق غير معتمد');
          return;
        }

        // Map data against products
        const results: ParsedRow[] = [];
        data.forEach((row, idx) => {
          // Normalize keys
          const sku = String(row['كود_الصنف'] || row['SKU'] || row['sku'] || '').trim();
          const name = String(row['اسم_المنتج'] || row['Product'] || row['name'] || `صنف ${idx + 1}`).trim();
          const basePrice = Number(row['السعر_الأساسي'] || row['BasePrice'] || row['basePrice'] || 0);

          const tierPrices: Record<string, number | null> = {};
          tiers.forEach((t) => {
            const val = row[t.name] ?? row[t.id];
            tierPrices[t.id] = val !== undefined && val !== null && val !== '' ? Number(val) : null;
          });

          const matchingProduct = products.find((p) => p.sku === sku || p.name === name);

          results.push({
            sku: sku || (matchingProduct ? matchingProduct.sku : `SKU-${idx + 1}`),
            name: name || (matchingProduct ? matchingProduct.name : `منتج ${idx + 1}`),
            basePrice: basePrice || (matchingProduct ? matchingProduct.basePrice : 100),
            tierPrices,
            status: matchingProduct ? 'valid' : 'warning',
            message: matchingProduct ? 'منتج مطابق' : 'منتج جديد سيتم إضافته',
          });
        });

        setParsedRows(results);
      } catch (err) {
        console.error('Error parsing excel:', err);
        setError('حدث خطأ أثناء قراءة ملف الإكسيل. تأكد من سلامة التنسيق.');
      }
    };
    reader.readAsBinaryString(file);
  };

  // Download Sample Template
  const handleDownloadTemplate = () => {
    const sampleHeaders: Record<string, any> = {
      'كود_الصنف': 'CHP-CHZ-01',
      'اسم_المنتج': 'شيبسي عائلي بالجبنة',
      'السعر_الأساسي': 240,
    };
    tiers.forEach((t) => {
      sampleHeaders[t.name] = 200;
    });

    const ws = XLSX.utils.json_to_sheet([sampleHeaders]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'شرائح_الأسعار');
    XLSX.writeFile(wb, 'نموذج_استيراد_شرائح_الأسعار.xlsx');
  };

  const handleApply = () => {
    // Merge parsed rows with existing products
    const updated = [...products];

    parsedRows.forEach((row) => {
      const idx = updated.findIndex((p) => p.sku === row.sku || p.name === row.name);
      if (idx >= 0) {
        updated[idx] = {
          ...updated[idx],
          basePrice: row.basePrice || updated[idx].basePrice,
          tierPrices: {
            ...updated[idx].tierPrices,
            ...row.tierPrices,
          },
        };
      } else {
        // Add new
        updated.push({
          id: 'prod_' + Date.now() + Math.random().toString(36).substring(2, 5),
          name: row.name,
          sku: row.sku,
          category: 'عام',
          unit: 'كرتونة',
          basePrice: row.basePrice,
          tierPrices: row.tierPrices,
        });
      }
    });

    console.log('[ExcelImportModal] Imported rows count:', parsedRows.length);
    // TODO(backend): replace with real API call
    onImportConfirm(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-slate-50/80 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                استيراد أسعار الشرائح من ملف Excel
              </h3>
              <p className="text-xs text-gray-500">
                رفع شيت Excel (.xlsx أو .csv) لتحديث أسعار الأصناف والشريحة دفعة واحدة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Top upload area */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                  {fileName ? `تم اختيار: ${fileName}` : 'اختر ملف إكسيل من جهازك'}
                </h4>
                <p className="text-[11px] text-gray-500">
                  يقبل صيغ .xlsx أو .xls أو .csv مع أعمدة (كود الصنف، اسم المنتج، أسماء الشرائح)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>رفع الملف</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                title="تحميل شيت إكسيل كنموذج إرشادي"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span className="hidden xs:inline">تحميل نموذج</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Preview Table */}
          {parsedRows.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-800">
                  معاينة البيانات المستخرجة ({parsedRows.length} صنف):
                </span>
                <span className="text-[11px] text-emerald-700 font-bold">
                  ✓ تم التعرف على ملف الإكسيل بنجاح
                </span>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden max-h-60 overflow-x-auto">
                <table className="w-full text-right text-xs whitespace-nowrap">
                  <thead className="bg-slate-50 text-gray-600 sticky top-0 border-b border-gray-200">
                    <tr>
                      <th className="p-2.5 font-bold">كود (SKU)</th>
                      <th className="p-2.5 font-bold">اسم الصنف</th>
                      <th className="p-2.5 font-bold">السعر الأساسي</th>
                      {tiers.map((t) => (
                        <th key={t.id} className="p-2.5 font-bold text-emerald-800">
                          {t.name}
                        </th>
                      ))}
                      <th className="p-2.5 font-bold">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {parsedRows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50/70">
                        <td className="p-2.5 font-mono text-gray-500">{r.sku}</td>
                        <td className="p-2.5 font-bold text-gray-900">{r.name}</td>
                        <td className="p-2.5 font-semibold text-gray-600">{r.basePrice} ج.م</td>
                        {tiers.map((t) => (
                          <td key={t.id} className="p-2.5 font-black text-emerald-700">
                            {r.tierPrices[t.id] ? `${r.tierPrices[t.id]} ج.م` : '-'}
                          </td>
                        ))}
                        <td className="p-2.5">
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            {r.message}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="button"
              disabled={parsedRows.length === 0}
              onClick={handleApply}
              className="rounded-xl bg-[#0f2d4a] px-5 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#163e63] transition-colors shadow-sm disabled:opacity-40 flex items-center gap-1.5"
            >
              <Check className="h-4 w-4" />
              <span>اعتماد الأسعار وحفظها بالمنصة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
