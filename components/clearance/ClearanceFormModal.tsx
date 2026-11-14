'use client';

import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Sparkles, AlertCircle, Percent, Calendar, Box, Tag } from 'lucide-react';
import { ClearanceFormData, ClearanceListing } from '@/types/clearance';

const AREA_OPTIONS = ['الإسماعيلية', 'السويس', 'بورسعيد', 'الشرقية', 'القاهرة', 'الجيزة'];

// Zod Schema
const clearanceSchema = z
  .object({
    productName: z.string().min(3, 'اسم المنتج يجب ألا يقل عن 3 أحرف'),
    brand: z.string().min(2, 'الشركة المنتجة مطلوبة'),
    category: z.string().min(2, 'التصنيف مطلوب'),
    originalPrice: z.coerce.number().positive('السعر الأصلي يجب أن يكون أكبر من صفر'),
    clearancePrice: z.coerce.number().positive('سعر التصفية يجب أن يكون أكبر من صفر'),
    totalCartons: z.coerce.number().int().positive('الكمية يجب أن تكون كرتونة واحدة على الأقل'),
    minOrderQuantity: z.coerce.number().int().positive('الحد الأدنى للطلب كرتونة واحدة على الأقل'),
    expiryDate: z.string().refine((val) => {
      if (!val) return false;
      const target = new Date(val);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return target > now;
    }, 'تاريخ الانتهاء يجب أن يكون في المستقبل'),
    deliveryAreas: z.array(z.string()).min(1, 'اختر منطقة توصيل واحدة على الأقل'),
    notes: z.string().optional(),
  })
  .refine((data) => data.clearancePrice < data.originalPrice, {
    message: 'سعر التصفية يجب أن يكون أقل من السعر الأصلي',
    path: ['clearancePrice'],
  })
  .refine((data) => data.minOrderQuantity <= data.totalCartons, {
    message: 'الحد الأدنى لا يمكن أن يتجاوز إجمالي الكمية المعروضة',
    path: ['minOrderQuantity'],
  });

type FormValues = z.infer<typeof clearanceSchema>;

interface ClearanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClearanceFormData) => void;
  initialData?: ClearanceListing | null;
}

export function ClearanceFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ClearanceFormModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(clearanceSchema),
    defaultValues: initialData
      ? {
          productName: initialData.productName,
          brand: initialData.brand,
          category: initialData.category,
          originalPrice: initialData.originalPrice,
          clearancePrice: initialData.clearancePrice,
          totalCartons: initialData.availableCartons || initialData.totalCartons,
          minOrderQuantity: initialData.minOrderQuantity,
          expiryDate: initialData.expiryDate,
          deliveryAreas: initialData.deliveryAreas,
          notes: initialData.notes || '',
        }
      : {
          productName: '',
          brand: '',
          category: 'مواد غذائية',
          originalPrice: 100,
          clearancePrice: 70,
          totalCartons: 50,
          minOrderQuantity: 5,
          expiryDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
          deliveryAreas: ['الإسماعيلية'],
          notes: '',
        },
  });

  const originalPrice = watch('originalPrice');
  const clearancePrice = watch('clearancePrice');
  const selectedAreas = watch('deliveryAreas') || [];

  // Live discount percentage calculation
  const discountPercent = useMemo(() => {
    if (!originalPrice || !clearancePrice || clearancePrice >= originalPrice) return 0;
    return Math.round(((originalPrice - clearancePrice) / originalPrice) * 100);
  }, [originalPrice, clearancePrice]);

  if (!isOpen) return null;

  const handleFormSubmit = (data: FormValues) => {
    console.log('[ClearanceFormModal] Submitting data:', data);
    // TODO(backend): replace with real API call
    onSubmit(data);
    reset();
    onClose();
  };

  const toggleArea = (area: string) => {
    if (selectedAreas.includes(area)) {
      setValue(
        'deliveryAreas',
        selectedAreas.filter((a) => a !== area),
        { shouldValidate: true }
      );
    } else {
      setValue('deliveryAreas', [...selectedAreas, area], { shouldValidate: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-slate-50/80 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                {initialData ? 'تعديل عرض التصفية' : 'إضافة عرض تصفية جديد'}
              </h3>
              <p className="text-xs text-gray-500">
                اعرض بضاعتك قريبة الصلاحية لتجار التجزئة بخصم جذاب
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

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              اسم المنتج والتعبئة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="مثال: شيبسي عائلي بالجبنة (كرتونة 24 كيس)"
              {...register('productName')}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
            {errors.productName && (
              <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.productName.message}
              </p>
            )}
          </div>

          {/* Brand & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                الشركة / البراند <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="مثال: شيبسي، جهينة، كادبوري"
                {...register('brand')}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
              {errors.brand && (
                <p className="mt-1 text-[11px] text-red-500">{errors.brand.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                القسم / التصنيف <span className="text-red-500">*</span>
              </label>
              <select
                {...register('category')}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white"
              >
                <option value="شيبسي ومقرمشات">شيبسي ومقرمشات</option>
                <option value="ألبان وجبن">ألبان وجبن</option>
                <option value="عصائر ومشروبات">عصائر ومشروبات</option>
                <option value="شوكولاتة وبسكويت">شوكولاتة وبسكويت</option>
                <option value="معلبات وزيوت">معلبات وزيوت</option>
                <option value="منظفات ومستلزمات">منظفات ومستلزمات</option>
              </select>
            </div>
          </div>

          {/* Pricing Row with Live Discount Calculation */}
          <div className="rounded-xl bg-purple-50/50 border border-purple-100 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-purple-600" />
                <span>تسعير التصفية والخصم</span>
              </span>
              {discountPercent > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-0.5 text-xs font-black text-white shadow-xs">
                  <Percent className="h-3 w-3" />
                  خصم محسوب: {discountPercent}%
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  سعر الكرتونة الأصلي (ج.م) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  {...register('originalPrice')}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm text-gray-900 font-bold focus:border-purple-600 focus:outline-none"
                />
                {errors.originalPrice && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.originalPrice.message}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  سعر التصفية المخفض (ج.م) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  {...register('clearancePrice')}
                  className="w-full rounded-lg border border-purple-300 bg-white px-3 py-2 text-xs sm:text-sm text-purple-900 font-black focus:border-purple-600 focus:outline-none"
                />
                {errors.clearancePrice && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.clearancePrice.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quantities & Expiry */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Box className="h-3.5 w-3.5 text-gray-500" />
                <span>إجمالي الكراتين</span>
              </label>
              <input
                type="number"
                {...register('totalCartons')}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs sm:text-sm text-gray-900 focus:border-purple-600 focus:outline-none"
              />
              {errors.totalCartons && (
                <p className="mt-1 text-[11px] text-red-500">{errors.totalCartons.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                أقل كمية للطلب
              </label>
              <input
                type="number"
                {...register('minOrderQuantity')}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs sm:text-sm text-gray-900 focus:border-purple-600 focus:outline-none"
              />
              {errors.minOrderQuantity && (
                <p className="mt-1 text-[11px] text-red-500">{errors.minOrderQuantity.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                <span>تاريخ انتهاء الصلاحية</span>
              </label>
              <input
                type="date"
                {...register('expiryDate')}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs sm:text-sm text-gray-900 focus:border-purple-600 focus:outline-none"
              />
              {errors.expiryDate && (
                <p className="mt-1 text-[11px] text-red-500">{errors.expiryDate.message}</p>
              )}
            </div>
          </div>

          {/* Delivery Areas Multi-select */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              مناطق التوصيل المتاحة <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AREA_OPTIONS.map((area) => {
                const isSelected = selectedAreas.includes(area);
                return (
                  <button
                    type="button"
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {area}
                  </button>
                );
              })}
            </div>
            {errors.deliveryAreas && (
              <p className="mt-1 text-[11px] text-red-500">{errors.deliveryAreas.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              ملاحظات إضافية للتجار (اختياري)
            </label>
            <textarea
              rows={2}
              placeholder="مثال: البضاعة بحالة ممتازة ومخزنة بمخازن مكيفة، تسليم فوري"
              {...register('notes')}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs sm:text-sm text-gray-900 focus:border-purple-600 focus:outline-none"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#0f2d4a] px-5 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#163e63] transition-colors shadow-sm disabled:opacity-50"
            >
              {initialData ? 'حفظ التعديلات' : 'نشر عرض التصفية الآن'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
