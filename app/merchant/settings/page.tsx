'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Settings,
  Store,
  User,
  Phone,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  Building,
} from 'lucide-react';
import { useMerchant } from '@/context/MerchantContext';
import { StoreType } from '@/types/merchant';

const STORE_TYPES: StoreType[] = [
  'سوبر ماركت',
  'هايبر ماركت',
  'محل بقالة',
  'ميني ماركت',
  'كشك',
];

const GOVERNORATES = [
  'الإسماعيلية',
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'الشرقية',
  'بورسعيد',
  'السويس',
  'الدقهلية',
  'الغربية',
  'القليوبية',
];

const settingsSchema = z.object({
  storeName: z.string().min(3, 'اسم المحل أو السوبر ماركت يجب ألا يقل عن 3 أحرف'),
  ownerName: z.string().min(3, 'اسم المسؤول يجب ألا يقل عن 3 أحرف'),
  phone: z
    .string()
    .min(10, 'رقم الهاتف غير صحيح')
    .regex(/^01[0125][0-9]{8}$/, 'يرجى إدخال رقم محمول مصري صحيح (11 رقم يبدأ بـ 01)'),
  storeType: z.enum(['سوبر ماركت', 'هايبر ماركت', 'محل بقالة', 'ميني ماركت', 'كشك'] as const),
  governorate: z.string().min(2, 'اختر المحافظة'),
  area: z.string().min(2, 'المنطقة أو الحي مطلوب'),
  address: z.string().min(5, 'العنوان بالتفصيل مطلوب لضمان وصول سيارات التوزيع'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function MerchantSettingsPage() {
  const { profile, updateProfile } = useMerchant();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SettingsFormValues, unknown, SettingsFormValues>({
    resolver: zodResolver(settingsSchema) as any,
    defaultValues: {
      storeName: profile.storeName,
      ownerName: profile.ownerName,
      phone: profile.phone,
      storeType: profile.storeType,
      governorate: profile.governorate,
      area: profile.area,
      address: profile.address,
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    console.log('[MerchantSettings] Updating profile:', data);
    // TODO(backend): replace with real API call (PUT /api/merchant/profile)
    updateProfile({
      ...profile,
      ...data,
      avatar: data.storeName.charAt(0),
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-black text-gray-900">تعديل بيانات الحساب</h1>
            <span className="rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5">
              بيانات المتجر
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            بيانات المتجر وموقع التوصيل الذي يظهر لمندوبي شركات التوريد
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Store Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              اسم المحل أو السوبر ماركت <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                {...register('storeName')}
                placeholder="مثال: سوبر ماركت الفرسان"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-3 pr-9 py-2 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
              />
              <Store className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
            {errors.storeName && (
              <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.storeName.message}</span>
              </p>
            )}
          </div>

          {/* Owner Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              اسم صاحب المحل / المسؤول <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                {...register('ownerName')}
                placeholder="مثال: أ / محمد عبد العظيم"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-3 pr-9 py-2 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
              />
              <User className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
            {errors.ownerName && (
              <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.ownerName.message}</span>
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              رقم الهاتف المحمول (واتساب المعتمد) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                dir="ltr"
                {...register('phone')}
                placeholder="01223456789"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-3 pr-9 py-2 text-xs sm:text-sm text-gray-900 font-mono text-right focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
              />
              <Phone className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
            {errors.phone && (
              <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.phone.message}</span>
              </p>
            )}
          </div>

          {/* Store Type */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              نوع النشاط التجاري <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                {...register('storeType')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs sm:text-sm text-gray-900 cursor-pointer focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
              >
                {STORE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {errors.storeType && (
              <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.storeType.message}</span>
              </p>
            )}
          </div>

          {/* Governorate */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              المحافظة <span className="text-rose-500">*</span>
            </label>
            <select
              {...register('governorate')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs sm:text-sm text-gray-900 cursor-pointer focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
            >
              {GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
            {errors.governorate && (
              <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.governorate.message}</span>
              </p>
            )}
          </div>

          {/* Area */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              المنطقة أو الحي <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                {...register('area')}
                placeholder="مثال: حي الشيخ زايد"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-3 pr-9 py-2 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
              />
              <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
            {errors.area && (
              <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.area.message}</span>
              </p>
            )}
          </div>
        </div>

        {/* Detailed Address */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            العنوان بالتفصيل وعلامة مميزة <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            {...register('address')}
            placeholder="مثال: شارع التجاري، بجوار مسجد الصالحين ومستشفى الشيخ زايد"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
          />
          {errors.address && (
            <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.address.message}</span>
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0f2d4a] hover:bg-blue-900 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
