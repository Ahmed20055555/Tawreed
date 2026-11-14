'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  X,
  Upload,
  Sparkles,
  Package,
  Tag,
  TrendingDown,
  Megaphone,
  Calendar,
  Clock,
  Users,
  AlertCircle,
  Eye,
  Check,
} from 'lucide-react';
import { SupplierUpdate, UpdateType, AudienceType, UpdateFormData } from '@/types/updates';
import { LinkedClient } from '@/types/clients';
import { UpdatePreview } from './UpdatePreview';

interface UpdateComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updateData: SupplierUpdate) => void;
  clients: LinkedClient[];
  initialData?: SupplierUpdate | null;
}

const updateSchema = z.object({
  type: z.enum(['new_product', 'offer', 'price_change', 'announcement']),
  title: z.string().min(3, 'عنوان التحديث يجب ألا يقل عن 3 أحرف'),
  description: z.string().min(5, 'تفاصيل التحديث مطلوبة'),
  productName: z.string().optional(),
  price: z.coerce.number().optional(),
  unit: z.string().optional(),
  discountPercentage: z.coerce.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  oldPrice: z.coerce.number().optional(),
  newPrice: z.coerce.number().optional(),
  audienceType: z.enum(['all', 'custom']),
  scheduleType: z.enum(['now', 'scheduled']),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
});

type FormValues = z.infer<typeof updateSchema>;

export function UpdateComposer({
  isOpen,
  onClose,
  onSubmit,
  clients,
  initialData,
}: UpdateComposerProps) {
  const [activeTabType, setActiveTabType] = useState<UpdateType>(
    initialData?.type || 'new_product'
  );
  const [audienceType, setAudienceType] = useState<AudienceType>(
    initialData?.audience.type || 'all'
  );
  const [selectedAreas, setSelectedAreas] = useState<string[]>(
    initialData?.audience.areas || []
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    initialData?.audience.types || []
  );
  const [scheduleType, setScheduleType] = useState<'now' | 'scheduled'>(
    initialData?.scheduleType || 'now'
  );
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    initialData?.imageUrl
  );
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Available unique areas & types from clients
  const areasList = useMemo(() => {
    const set = new Set<string>();
    clients.forEach((c) => set.add(c.area));
    return Array.from(set);
  }, [clients]);

  const typesList = useMemo(() => {
    const set = new Set<string>();
    clients.forEach((c) => set.add(c.type));
    return Array.from(set);
  }, [clients]);

  // Live calculation of target audience count
  const targetClientsCount = useMemo(() => {
    if (audienceType === 'all') {
      return clients.length;
    }
    return clients.filter((c) => {
      const matchArea = selectedAreas.length === 0 || selectedAreas.includes(c.area);
      const matchType = selectedTypes.length === 0 || selectedTypes.includes(c.type);
      return matchArea && matchType;
    }).length;
  }, [clients, audienceType, selectedAreas, selectedTypes]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues, any, FormValues>({
    resolver: zodResolver(updateSchema) as any,
    defaultValues: {
      type: initialData?.type || 'new_product',
      title: initialData?.title || '',
      description: initialData?.description || '',
      productName: initialData?.productName || '',
      price: initialData?.price || undefined,
      unit: initialData?.unit || 'كرتونة 24 قطعة',
      discountPercentage: initialData?.discountPercentage || 15,
      startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
      endDate: initialData?.endDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      oldPrice: initialData?.oldPrice || undefined,
      newPrice: initialData?.newPrice || undefined,
      audienceType: initialData?.audience.type || 'all',
      scheduleType: initialData?.scheduleType || 'now',
      scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      scheduledTime: '10:00',
    },
  });

  useEffect(() => {
    setValue('type', activeTabType);
  }, [activeTabType, setValue]);

  if (!isOpen) return null;

  // Handle image upload preview (client-side FileReader)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data: FormValues) => {
    console.log('[UpdateComposer] Submitting update form:', data);

    const updateObj: SupplierUpdate = {
      id: initialData ? initialData.id : 'upd_' + Date.now(),
      type: activeTabType,
      title: data.title,
      description: data.description,
      imageUrl: imagePreview,
      productName: activeTabType === 'new_product' || activeTabType === 'price_change' ? data.productName : undefined,
      price: activeTabType === 'new_product' ? data.price : undefined,
      unit: activeTabType === 'new_product' ? data.unit : undefined,
      discountPercentage: activeTabType === 'offer' ? data.discountPercentage : undefined,
      startDate: activeTabType === 'offer' ? data.startDate : undefined,
      endDate: activeTabType === 'offer' ? data.endDate : undefined,
      oldPrice: activeTabType === 'price_change' ? data.oldPrice : undefined,
      newPrice: activeTabType === 'price_change' ? data.newPrice : undefined,
      audience: {
        type: audienceType,
        targetCount: targetClientsCount,
        areas: audienceType === 'custom' ? selectedAreas : undefined,
        types: audienceType === 'custom' ? selectedTypes : undefined,
      },
      scheduleType,
      scheduledFor: scheduleType === 'scheduled' ? `${data.scheduledDate}T${data.scheduledTime || '10:00'}` : undefined,
      status: scheduleType === 'scheduled' ? 'scheduled' : 'published',
      publishedAt: new Date().toISOString(),
      reachCount: scheduleType === 'scheduled' ? 0 : targetClientsCount,
      viewsCount: 0,
    };

    // TODO(backend): replace with real API call
    onSubmit(updateObj);
    reset();
    onClose();
  };

  const watchedTitle = watch('title');
  const watchedDesc = watch('description');
  const watchedProductName = watch('productName');
  const watchedPrice = watch('price');
  const watchedUnit = watch('unit');
  const watchedDiscount = watch('discountPercentage');
  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');
  const watchedOldPrice = watch('oldPrice');
  const watchedNewPrice = watch('newPrice');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-slate-50/90 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f2d4a] text-white shadow-xs">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                {initialData ? 'تعديل التحديث' : 'إنشاء ونشر تحديث جديد للعملاء'}
              </h3>
              <p className="text-xs text-gray-500">
                سيصل هذا التحديث لجميع التجار المربوطين بحساب شركتك فوراً
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMobilePreview(!showMobilePreview)}
              className="lg:hidden inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{showMobilePreview ? 'إخفاء المعاينة' : 'معاينة'}</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split Form + Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[82vh] overflow-y-auto">
          {/* Form Side */}
          <div className="lg:col-span-7 p-5 space-y-4 border-l border-slate-100">
            {/* Segmented Type Control */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                نوع التحديث:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-2xl">
                {[
                  { id: 'new_product' as UpdateType, label: 'منتج جديد', icon: Package },
                  { id: 'offer' as UpdateType, label: 'عرض وخصم', icon: Tag },
                  { id: 'price_change' as UpdateType, label: 'تغيير سعر', icon: TrendingDown },
                  { id: 'announcement' as UpdateType, label: 'إعلان عام', icon: Megaphone },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTabType === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTabType(tab.id)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white text-gray-900 shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                عنوان التحديث <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="مثال: وصول كرتونة جديدة من شيبسي، عرض خاص لنهاية الأسبوع..."
                {...register('title')}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:border-[#0f2d4a] focus:outline-none"
              />
              {errors.title && (
                <p className="mt-1 text-[11px] text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                تفاصيل التحديث / الرسالة <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="اكتب رسالتك الموجهة للتجار، وضح المزايا ومدة العرض أو الكميات المتاحة..."
                {...register('description')}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:border-[#0f2d4a] focus:outline-none"
              />
              {errors.description && (
                <p className="mt-1 text-[11px] text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Image Upload (Preview only) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                صورة للمنتج أو البوستر الإعلاني (اختياري)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-slate-50 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-slate-100 cursor-pointer">
                  <Upload className="h-3.5 w-3.5 text-gray-500" />
                  <span>اختر صورة</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {imagePreview && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-emerald-700 font-bold">✓ تم اختيار الصورة</span>
                    <button
                      type="button"
                      onClick={() => setImagePreview(undefined)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      حذف
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic fields by Type */}
            {activeTabType === 'new_product' && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 space-y-3">
                <span className="text-xs font-bold text-emerald-900 block">بيانات المنتج الجديد:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">اسم الصنف:</label>
                    <input
                      type="text"
                      placeholder="مثال: شيبسي عائلي سوبر"
                      {...register('productName')}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">سعر الجملة (ج.م):</label>
                    <input
                      type="number"
                      placeholder="260"
                      {...register('price')}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTabType === 'offer' && (
              <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-3.5 space-y-3">
                <span className="text-xs font-bold text-rose-900 block">تفاصيل العرض والخصم:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">نسبة الخصم (%):</label>
                    <input
                      type="number"
                      placeholder="15"
                      {...register('discountPercentage')}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-black text-rose-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">تاريخ البدء:</label>
                    <input
                      type="date"
                      {...register('startDate')}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">تاريخ الانتهاء:</label>
                    <input
                      type="date"
                      {...register('endDate')}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTabType === 'price_change' && (
              <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-3.5 space-y-3">
                <span className="text-xs font-bold text-amber-900 block">تعديل سعر صنف:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">اسم الصنف:</label>
                    <input
                      type="text"
                      placeholder="مثال: زيت عافية ذرة"
                      {...register('productName')}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">السعر السابق (ج.م):</label>
                    <input
                      type="number"
                      placeholder="960"
                      {...register('oldPrice')}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">السعر الجديد (ج.م):</label>
                    <input
                      type="number"
                      placeholder="890"
                      {...register('newPrice')}
                      className="w-full rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-black text-amber-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Audience Section */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-[#0f2d4a]" />
                  <span>الجمهور المستهدف:</span>
                </label>
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-bold">
                  سيصل إلى {targetClientsCount} عميل
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="aud"
                    checked={audienceType === 'all'}
                    onChange={() => setAudienceType('all')}
                    className="accent-[#0f2d4a]"
                  />
                  <span>كل العملاء المربوطين ({clients.length})</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="aud"
                    checked={audienceType === 'custom'}
                    onChange={() => setAudienceType('custom')}
                    className="accent-[#0f2d4a]"
                  />
                  <span>عملاء محددين (حسب المنطقة أو النشاط)</span>
                </label>
              </div>

              {audienceType === 'custom' && (
                <div className="pt-2 border-t border-slate-200/80 space-y-2 text-xs">
                  <div>
                    <span className="text-[11px] font-semibold text-gray-500 block mb-1">
                      فلترة بالمناطق:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {areasList.map((area) => {
                        const isSelected = selectedAreas.includes(area);
                        return (
                          <button
                            key={area}
                            type="button"
                            onClick={() => {
                              setSelectedAreas(
                                isSelected ? selectedAreas.filter((a) => a !== area) : [...selectedAreas, area]
                              );
                            }}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                              isSelected
                                ? 'bg-[#0f2d4a] text-white'
                                : 'bg-white border border-gray-200 text-gray-700'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {area}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-gray-500 block mb-1">
                      فلترة بنوع النشاط:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {typesList.map((type) => {
                        const isSelected = selectedTypes.includes(type);
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setSelectedTypes(
                                isSelected ? selectedTypes.filter((t) => t !== type) : [...selectedTypes, type]
                              );
                            }}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                              isSelected
                                ? 'bg-purple-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-700'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Publishing schedule */}
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-2">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#0f2d4a]" />
                <span>موعد النشر:</span>
              </label>

              <div className="flex items-center gap-4 text-xs font-bold">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sched"
                    checked={scheduleType === 'now'}
                    onChange={() => setScheduleType('now')}
                    className="accent-[#0f2d4a]"
                  />
                  <span>نشر الآن فوراً</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sched"
                    checked={scheduleType === 'scheduled'}
                    onChange={() => setScheduleType('scheduled')}
                    className="accent-[#0f2d4a]"
                  />
                  <span>جدولة لوقت لاحق</span>
                </label>
              </div>

              {scheduleType === 'scheduled' && (
                <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">التاريخ:</label>
                    <input
                      type="date"
                      {...register('scheduledDate')}
                      className="w-full rounded-lg border border-gray-200 px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">الوقت:</label>
                    <input
                      type="time"
                      {...register('scheduledTime')}
                      className="w-full rounded-lg border border-gray-200 px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-slate-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSubmit(handleFormSubmit)}
                className="rounded-xl bg-[#0f2d4a] px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#163e63] transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" />
                <span>
                  {scheduleType === 'scheduled' ? 'حفظ وجدولة النشر' : 'نشر للعملاء الآن'}
                </span>
              </button>
            </div>
          </div>

          {/* Live Preview Side (Always visible on lg, toggled on mobile) */}
          <div
            className={`lg:col-span-5 p-5 bg-slate-100/60 flex flex-col justify-center items-center ${
              showMobilePreview ? 'block' : 'hidden lg:flex'
            }`}
          >
            <div className="mb-2 text-center">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5 justify-center">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span>معاينة حية لشاشة التاجر:</span>
              </span>
              <p className="text-[11px] text-gray-400">
                هكذا سيظهر التحديث في إشعارات وخلاصة التاجر
              </p>
            </div>

            <UpdatePreview
              type={activeTabType}
              title={watchedTitle}
              description={watchedDesc}
              imageUrl={imagePreview}
              productName={watchedProductName}
              price={watchedPrice}
              unit={watchedUnit}
              discountPercentage={watchedDiscount}
              startDate={watchedStartDate}
              endDate={watchedEndDate}
              oldPrice={watchedOldPrice}
              newPrice={watchedNewPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
