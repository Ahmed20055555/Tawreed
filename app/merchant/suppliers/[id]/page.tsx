'use client';

import React, { useState, useMemo, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Building2,
  Package,
  Bell,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Search,
  ShoppingCart,
  ChevronRight,
  Info,
  Clock,
  Flame,
  Sparkles,
} from 'lucide-react';
import { useMerchant } from '@/context/MerchantContext';
import { getSupplierProducts } from '@/lib/mock-api';
import { LinkButton } from '@/components/merchant/LinkButton';
import { ProductCard } from '@/components/merchant/ProductCard';
import { UpdateCard } from '@/components/merchant/UpdateCard';
import { EmptyState } from '@/components/common/EmptyState';

export default function SupplierCatalogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const supplierId = resolvedParams.id;

  const { suppliers, isLinked, feed } = useMerchant();

  const [activeTab, setActiveTab] = useState<'products' | 'updates' | 'about'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('all');

  const supplier = suppliers.find((s) => s.id === supplierId || s.slug === supplierId);
  const linked = supplier ? isLinked(supplier.id) : false;

  // Products of this supplier
  const products = useMemo(() => {
    if (!supplier) return [];
    return getSupplierProducts(supplier.id);
  }, [supplier]);

  // Product categories
  const productCategories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(set)];
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedProductCategory !== 'all' && p.category !== selectedProductCategory) {
        return false;
      }
      if (productSearch.trim() !== '') {
        const q = productSearch.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase().includes(q);
        if (!matchName && !matchCategory) return false;
      }
      return true;
    });
  }, [products, selectedProductCategory, productSearch]);

  // Updates from this supplier
  const supplierUpdates = useMemo(() => {
    if (!supplier) return [];
    return feed.filter((u) => u.supplierId === supplier.id);
  }, [feed, supplier]);

  if (!supplier) {
    return (
      <div className="py-12 text-center">
        <EmptyState
          icon={Building2}
          title="لم يتم العثور على هذه الشركة"
          description="تأكد من صحة الرابط أو تصفح دليل الموردين المتاحين في توريد."
          actionText="العودة لدليل الشركات"
          onAction={() => {
            window.location.href = '/merchant/suppliers';
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/merchant/suppliers" className="hover:text-gray-900 transition-colors">
          دليل الشركات
        </Link>
        <ChevronRight className="h-3 w-3 rotate-180" />
        <span className="text-gray-800 font-bold">{supplier.name}</span>
      </div>

      {/* Supplier Profile Hero Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0f2d4a] text-white font-black text-2xl shadow-sm">
              {supplier.logo.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-xl font-black text-gray-900">{supplier.name}</h1>
                <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-700">
                  {supplier.category}
                </span>
                {supplier.rating && (
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{supplier.rating} تقييم التوريد</span>
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {supplier.description}
              </p>
            </div>
          </div>

          <div className="self-start sm:self-auto shrink-0">
            <LinkButton supplier={supplier} />
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block">الحد الأدنى للطلبية</span>
            <span className="font-black text-emerald-700 text-xs sm:text-sm">
              {supplier.minOrderValue.toLocaleString()} ج.م
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block">المنتجات بالكتالوج</span>
            <span className="font-black text-[#0f2d4a] text-xs sm:text-sm">
              {products.length} منتج
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block">التجار المربوطين</span>
            <span className="font-black text-gray-900 text-xs sm:text-sm">
              {supplier.linkedMerchantsCount} تاجر
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block">حالة الربط معك</span>
            <span
              className={`font-bold text-xs sm:text-sm ${
                linked ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {linked ? 'مربوط حالياً ✓' : 'غير مربوط'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'border-[#0f2d4a] text-[#0f2d4a]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>المنتجات والأسعار ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('updates')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'updates'
              ? 'border-[#0f2d4a] text-[#0f2d4a]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>آخر التحديثات والعروض ({supplierUpdates.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'about'
              ? 'border-[#0f2d4a] text-[#0f2d4a]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Info className="h-4 w-4" />
          <span>عن الشركة والشحن</span>
        </button>
      </div>

      {/* Tab 1: Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Warning banner if not linked */}
          {!linked && (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0" />
                <p className="text-xs sm:text-sm font-bold">
                  أنت غير مربوط حالياً مع {supplier.name}. أسعار الجملة وإمكانية الطلب تظهر للتجار المربوطين فقط.
                </p>
              </div>

              <button
                type="button"
                onClick={() => supplier && isLinked(supplier.id)}
                className="shrink-0"
              >
                <LinkButton supplier={supplier} />
              </button>
            </div>
          )}

          {/* Search & Category Filter */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="ابحث عن منتج داخل كتالوج الشركة..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-3 pr-9 py-2 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>

            <div className="w-full sm:w-auto">
              <select
                value={selectedProductCategory}
                onChange={(e) => setSelectedProductCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-gray-800 cursor-pointer focus:bg-white focus:border-[#0f2d4a] focus:outline-none"
              >
                <option value="all">كل الأقسام</option>
                {productCategories
                  .filter((c) => c !== 'all')
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <EmptyState
              icon={Package}
              title="لا توجد منتجات مطابقة"
              description="جرب البحث بكلمات أخرى أو اختر كل الأقسام لرؤية كافة المنتجات المتاحة."
              actionText="إعادة ضبط البحث"
              onAction={() => {
                setProductSearch('');
                setSelectedProductCategory('all');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  supplier={supplier}
                  isLinked={linked}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Updates Tab */}
      {activeTab === 'updates' && (
        <div className="space-y-4">
          {supplierUpdates.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="لا توجد منشورات أو عروض حالياً"
              description="ستظهر هنا أي منتجات جديدة أو عروض وخصومات وتعديلات أسعار تعلنها هذه الشركة فوراً."
            />
          ) : (
            <div className="space-y-3.5">
              {supplierUpdates.map((update) => (
                <UpdateCard key={update.id} update={update} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: About Tab */}
      {activeTab === 'about' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-gray-900">عن شركة {supplier.name}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {supplier.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#0f2d4a]" />
                <span>المحافظات والمناطق المتاح التوريد إليها:</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {supplier.deliveryAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-[#0f2d4a]" />
                <span>خدمة عملاء وتوريدات التجزئة:</span>
              </h4>
              <p className="text-xs text-slate-600 font-mono dir-ltr text-right font-bold">
                {supplier.phone}
              </p>
              <p className="text-[11px] text-slate-400">
                مواعيد استلام الطلبيات يومياً من 8 صباحاً حتى 6 مساءً
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
