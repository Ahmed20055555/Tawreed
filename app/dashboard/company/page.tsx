'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  MapPin,
  Phone,
  ShieldCheck,
  Plus,
  LogOut,
  Bell,
  CheckCircle2,
  Clock,
  ChevronLeft,
  Store,
  Layers,
  Settings,
  Menu,
  Briefcase,
  Sparkles,
  Search,
  Tag,
  Check,
  X,
  MessageCircle,
  Percent,
  Trash2,
  Send,
  Truck,
  AlertCircle,
  Flame,
  Radar,
  Megaphone,
} from 'lucide-react';
import { getClients } from '@/lib/mock-api';

interface CompanyData {
  companyName: string;
  industry: string;
  governorate: string;
  phone: string;
  username: string;
  registeredAt?: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  priceCarton: number;
  piecesPerCarton: number;
  pricePieceSuggested: number;
  minOrder: number;
  inStock: boolean;
}

interface Merchant {
  id: string;
  name: string;
  owner: string;
  type: string;
  governorate: string;
  area: string;
  phone: string;
  ordersCount: number;
  joinedDate: string;
}

interface Order {
  id: string;
  merchantName: string;
  area: string;
  governorate: string;
  itemsSummary: string;
  cartonsCount: number;
  totalPrice: number;
  status: 'pending' | 'shipping' | 'delivered';
  date: string;
}

interface Offer {
  id: string;
  title: string;
  discountText: string;
  minCartons: number;
  validUntil: string;
  active: boolean;
}

export default function CompanyDashboardPage() {
  const router = useRouter();

  // Company profile
  const [company, setCompany] = useState<CompanyData>({
    companyName: 'شركة النيل للصناعات الغذائية',
    industry: 'مواد غذائية ومشروبات',
    governorate: 'القاهرة',
    phone: '01012345678',
    username: 'nile_foods',
    registeredAt: new Date().toISOString(),
  });

  // Active tab & Sidebar Drawer state
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'merchants' | 'orders' | 'offers' | 'profile'>('products');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Products state (حقيقي يبدأ فارغاً ويُحفظ محلياً)
  const [products, setProducts] = useState<Product[]>([]);

  // Categories state (حقيقي يبدأ فارغاً ويُحفظ محلياً)
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchProductQuery, setSearchProductQuery] = useState('');

  // Add Category modal
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Add product modal
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductCartonPrice, setNewProductCartonPrice] = useState('');
  const [newProductPieces, setNewProductPieces] = useState('24');
  const [newProductMinOrder, setNewProductMinOrder] = useState('1');
  const [newProductSuggestedPrice, setNewProductSuggestedPrice] = useState('');

  // Merchants directory
  const [merchants, setMerchants] = useState<Merchant[]>([
    {
      id: 'm1',
      name: 'سوبر ماركت الفرسان',
      owner: 'أ / محمد عبد العظيم',
      type: 'سوبر ماركت كبير',
      governorate: 'الإسماعيلية',
      area: 'حي الشيخ زايد',
      phone: '01223456789',
      ordersCount: 18,
      joinedDate: 'منذ شهرين',
    },
    {
      id: 'm2',
      name: 'أسواق أولاد رجب للتجارة',
      owner: 'أ / سامح عادل',
      type: 'تجارة جملة وتجزئة',
      governorate: 'الإسماعيلية',
      area: 'الشارع التجاري',
      phone: '01098765432',
      ordersCount: 42,
      joinedDate: 'منذ 5 شهور',
    },
    {
      id: 'm3',
      name: 'ماركت البركة',
      owner: 'أ / محمود شريف',
      type: 'ميني ماركت وبقالة',
      governorate: 'الإسماعيلية',
      area: 'حي الأفرنج',
      phone: '01112233445',
      ordersCount: 9,
      joinedDate: 'منذ أسبوعين',
    },
    {
      id: 'm4',
      name: 'هايبر ماركت مصر الخير',
      owner: 'أ / إبراهيم خليل',
      type: 'هايبر ماركت',
      governorate: 'الإسماعيلية',
      area: 'المحطة الجديدة',
      phone: '01555443322',
      ordersCount: 31,
      joinedDate: 'منذ 3 شهور',
    },
    {
      id: 'm5',
      name: 'سوبر ماركت الصفا والمروة',
      owner: 'أ / وائل النجار',
      type: 'سوبر ماركت 24 ساعة',
      governorate: 'الشرقية',
      area: 'الزقازيق - القومية',
      phone: '01033445566',
      ordersCount: 24,
      joinedDate: 'منذ 4 شهور',
    },
    {
      id: 'm6',
      name: 'زاد ماركت للمواد الغذائية',
      owner: 'أ / شريف البدري',
      type: 'ميني ماركت',
      governorate: 'القاهرة',
      area: 'مدينة نصر - الحي السابع',
      phone: '01277889900',
      ordersCount: 55,
      joinedDate: 'منذ 6 شهور',
    },
  ]);

  const [merchantGovFilter, setMerchantGovFilter] = useState('الكل');
  const [merchantSearchQuery, setMerchantSearchQuery] = useState('');

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);

  // Offers state
  const [offers, setOffers] = useState<Offer[]>([]);

  // Read saved data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('tawreed_company_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setCompany(parsed);
        } catch {
          // ignore
        }
      }

      const savedCategories = localStorage.getItem('tawreed_company_categories');
      if (savedCategories) {
        try {
          setCategories(JSON.parse(savedCategories));
        } catch {
          // ignore
        }
      }

      const savedProducts = localStorage.getItem('tawreed_company_products');
      if (savedProducts) {
        try {
          setProducts(JSON.parse(savedProducts));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tawreed_active_session');
    }
    router.push('/login');
  };

  // Add Category Handler
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      alert('يرجى إدخال اسم التصنيف');
      return;
    }
    if (categories.includes(trimmed)) {
      alert('هذا التصنيف موجود بالفعل!');
      return;
    }
    const updated = [...categories, trimmed];
    setCategories(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tawreed_company_categories', JSON.stringify(updated));
    }
    setSelectedCategory(trimmed);
    setNewCategoryName('');
    setIsAddCategoryOpen(false);
    showToast(`تمت إضافة التصنيف "${trimmed}" بنجاح!`);
  };

  // Add Product Handler
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !newProductCartonPrice) {
      alert('يرجى كتابة اسم المنتج وسعر الكرتونة');
      return;
    }

    const cat = newProductCategory.trim() || 'عام';
    const newProd: Product = {
      id: 'p_' + Date.now(),
      name: newProductName.trim(),
      category: cat,
      priceCarton: Number(newProductCartonPrice),
      piecesPerCarton: Number(newProductPieces) || 24,
      pricePieceSuggested: Number(newProductSuggestedPrice) || Math.round((Number(newProductCartonPrice) / (Number(newProductPieces) || 24)) * 1.25),
      minOrder: Number(newProductMinOrder) || 1,
      inStock: true,
    };

    const updatedProducts = [newProd, ...products];
    setProducts(updatedProducts);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tawreed_company_products', JSON.stringify(updatedProducts));
    }

    if (!categories.includes(cat) && cat !== 'الكل') {
      const updatedCats = [...categories, cat];
      setCategories(updatedCats);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tawreed_company_categories', JSON.stringify(updatedCats));
      }
    }

    setIsAddProductOpen(false);
    setNewProductName('');
    setNewProductCartonPrice('');
    setNewProductSuggestedPrice('');
    showToast(`تمت إضافة منتج "${newProd.name}" بنجاح!`);
  };

  // Toggle inStock
  const toggleStock = (id: string) => {
    const updated = products.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p));
    setProducts(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tawreed_company_products', JSON.stringify(updated));
    }
    showToast('تم تحديث حالة توفر المنتج');
  };

  // Delete product
  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف منتج "${name}" من القائمة؟`)) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tawreed_company_products', JSON.stringify(updated));
      }
      showToast(`تم حذف "${name}"`);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = (orderId: string, nextStatus: 'pending' | 'shipping' | 'delivered') => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    const statusLabels = {
      pending: 'قيد المراجعة',
      shipping: 'جاري التوصيل والشحن',
      delivered: 'تم التسليم واستلام المبلغ',
    };
    showToast(`تم تحديث حالة الطلب إلى (${statusLabels[nextStatus]})`);
  };

  // Send Catalog to Merchant
  const handleSendCatalog = (merchant: Merchant) => {
    showToast(`تم إرسال كتالوج أسعار ${company.companyName} إلى "${merchant.name}" بنجاح!`);
  };

  // Calculations for stats
  const totalDeliveredRevenue = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const pendingOrdersCount = orders.filter((o) => o.status !== 'delivered').length;

  // Filtered categories & products
  const productCategories = ['الكل', ...Array.from(new Set([...categories, ...products.map((p) => p.category)]))];
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'الكل' || p.category === selectedCategory;
    const matchQuery =
      searchProductQuery === '' ||
      p.name.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchProductQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  // Filtered merchants
  const filteredMerchants = merchants.filter((m) => {
    const matchGov =
      merchantGovFilter === 'الكل' ||
      (merchantGovFilter === 'same' && m.governorate === company.governorate) ||
      m.governorate === merchantGovFilter;
    const matchQuery =
      merchantSearchQuery === '' ||
      m.name.toLowerCase().includes(merchantSearchQuery.toLowerCase()) ||
      m.area.toLowerCase().includes(merchantSearchQuery.toLowerCase()) ||
      m.owner.toLowerCase().includes(merchantSearchQuery.toLowerCase());
    return matchGov && matchQuery;
  });

  // Navigation Items for the Sidebar
  const navItems = [
    { id: 'products', label: 'المنتجات والأسعار', icon: Package, count: products.length },
    { id: 'merchants', label: 'المحلات والتجار المسجلين', icon: Store, count: merchants.length, isNew: true },
    { id: 'orders', label: 'الطلبات الواردة', icon: ShoppingCart, count: orders.length },
    { id: 'offers', label: 'عروض الجملة والخصومات', icon: Percent, count: offers.length },
    { id: 'overview', label: 'بيانات الشركة', icon: Layers },
    { id: 'profile', label: 'تعديل الحساب', icon: Settings },
  ] as const;

  const currentTabItem = navItems.find((item) => item.id === activeTab) || navItems[0];

  return (
    <div className="min-h-screen bg-slate-100/70 text-gray-900 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm text-white shadow-xl animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar - ناعم ومضبوط للموبايل */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 py-2 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
              <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-primary text-white shadow-xs font-black text-xs sm:text-base">
                ت
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-base font-black tracking-tight text-primary leading-none">
                  توريد
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
                  بوابة الموردين
                </span>
              </div>
            </Link>

            <span className="hidden md:inline-block h-4 w-[1px] bg-slate-200" />

            <div className="hidden xs:flex items-center gap-1.5 rounded-lg bg-slate-100 px-2 sm:px-3 py-1 text-[10px] sm:text-xs">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <span className="font-bold text-gray-800 truncate max-w-[130px] sm:max-w-none">{company.companyName}</span>
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                نشط
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* زر فتح القائمة الجانبية */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-1.5 rounded-lg sm:rounded-xl bg-primary/10 hover:bg-primary hover:text-white text-primary px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold transition-all cursor-pointer"
              title="فتح أقسام لوحة التحكم"
            >
              <Menu className="h-4 w-4" />
              <span>القائمة الجانبية</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('لا توجد إشعارات جديدة')}
              className="relative p-1.5 sm:p-2 text-slate-500 hover:text-primary hover:bg-slate-50 rounded-lg sm:rounded-xl transition-colors cursor-pointer"
              title="الإشعارات"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-accent" />
            </button>

            <div className="hidden sm:flex flex-col text-left border-l border-slate-200 pl-2.5 ml-0.5">
              <span className="text-xs font-bold text-gray-800 text-right font-mono">@{company.username}</span>
              <span className="text-[10px] text-slate-400 text-right">{company.governorate}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 rounded-lg sm:rounded-xl border border-slate-200 bg-white px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container - هوامش ومقاسات مدروسة للشاشات الصغيرة */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-3 sm:py-6 space-y-3 sm:space-y-5">
        {/* Header Card - أنيق وخفيف */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-6 shadow-xs">
          <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-blue-50/40 to-transparent pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-[#0f4c75] text-white shadow-xs font-black text-sm sm:text-xl">
                {company.companyName.trim().charAt(0) || 'ش'}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-0.5">
                  <h1 className="text-sm sm:text-lg md:text-xl font-black text-gray-900 tracking-tight">
                    {company.companyName}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-2 py-0.2 text-[9px] sm:text-[10px] font-bold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    حساب نشط
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] sm:text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-slate-700 font-semibold">
                    <Briefcase className="h-3 w-3 text-primary" />
                    <span>{company.industry}</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span>{company.governorate}</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-slate-400 text-[10px] dir-ltr">
                    @{company.username}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Quick Stats Grid - مقاسات ناعمة على الموبايل */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5">
          <div
            onClick={() => setActiveTab('orders')}
            className="rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-2.5 sm:p-4 shadow-xs cursor-pointer hover:border-emerald-300 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500">إجمالي المبيعات</span>
              <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-sm sm:text-xl font-black text-gray-900">
              {totalDeliveredRevenue.toLocaleString()} ج.م
            </div>
            <span className="text-[9px] sm:text-[10px] text-emerald-600 font-medium mt-0.5 block">
              من الطلبات المسلّمة
            </span>
          </div>

          <div
            onClick={() => setActiveTab('orders')}
            className="rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-2.5 sm:p-4 shadow-xs cursor-pointer hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500">الطلبات النشطة</span>
              <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-blue-50 text-primary">
                <ShoppingCart className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-sm sm:text-xl font-black text-gray-900">
              {pendingOrdersCount} طلب
            </div>
            <span className="text-[9px] sm:text-[10px] text-blue-600 font-medium mt-0.5 block">
              قيد التجهيز
            </span>
          </div>

          <div
            onClick={() => setActiveTab('products')}
            className="rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-2.5 sm:p-4 shadow-xs cursor-pointer hover:border-amber-300 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500">الأصناف بالكتالوج</span>
              <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Package className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-sm sm:text-xl font-black text-gray-900">
              {products.length} صنف
            </div>
            <span className="text-[9px] sm:text-[10px] text-accent font-semibold mt-0.5 block">
              معروض للتجار
            </span>
          </div>

          <div
            onClick={() => setActiveTab('merchants')}
            className="rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-2.5 sm:p-4 shadow-xs cursor-pointer hover:border-purple-300 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500">المحلات المتاحة</span>
              <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <Store className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-sm sm:text-xl font-black text-gray-900">
              {merchants.length} محل
            </div>
            <span className="text-[9px] sm:text-[10px] text-purple-600 font-medium mt-0.5 block">
              جاهزون للطلب
            </span>
          </div>
        </div>

        {/* Section Header with Quick Sidebar Toggle Button - شريط رشيق بسطر واحد على الموبايل */}
        <div className="flex items-center justify-between bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 px-2.5 sm:px-4 py-2 sm:py-2.5 shadow-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
              <currentTabItem.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <h2 className="text-[11px] sm:text-sm font-bold text-gray-900 truncate">
              {currentTabItem.label}
            </h2>
            {'count' in currentTabItem && (
              <span className="text-[9px] sm:text-[10px] font-bold text-primary bg-blue-50 px-1.5 py-0.2 rounded-full shrink-0">
                {currentTabItem.count}
              </span>
            )}
          </div>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-1 rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold text-slate-700 transition-all cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Menu className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
            <span>الأقسام</span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: PRODUCTS & CATEGORIES
           ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-2.5 sm:space-y-4">
            {/* Action Bar - متجاوب تماماً وبدون أي خروج عن الحواف */}
            <div className="flex flex-col gap-2 bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchProductQuery}
                  onChange={(e) => setSearchProductQuery(e.target.value)}
                  placeholder="ابحث عن اسم الصنف..."
                  className="w-full rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50/70 pl-3 pr-7 py-1.5 text-[10px] sm:text-xs text-gray-900 placeholder:text-[10px] sm:placeholder:text-xs focus:border-primary focus:bg-white focus:outline-none"
                />
                <Search className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400" />
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsAddCategoryOpen(true)}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 py-1.5 px-2 text-[10px] sm:text-xs font-bold text-slate-700 shadow-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  <Tag className="h-3 w-3 text-primary shrink-0" />
                  <span>+ تصنيف (Category)</span>
                </button>

                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg sm:rounded-xl bg-primary py-1.5 px-2 text-[10px] sm:text-xs font-bold text-white shadow-xs hover:bg-primary/95 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Plus className="h-3 w-3 shrink-0" />
                  <span>+ إضافة منتج</span>
                </button>
              </div>
            </div>

            {/* Category Pills Filter */}
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 ml-0.5">التصنيفات:</span>
              <button
                onClick={() => setSelectedCategory('الكل')}
                className={`flex items-center gap-1 rounded-md sm:rounded-xl px-2 py-0.5 text-[9px] sm:text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === 'الكل'
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>الكل</span>
                <span
                  className={`text-[8px] sm:text-[9px] px-1 rounded-full font-bold ${
                    selectedCategory === 'الكل'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {products.length}
                </span>
              </button>

              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-1 rounded-md sm:rounded-xl px-2 py-0.5 text-[9px] sm:text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[8px] sm:text-[9px] px-1 rounded-full font-bold ${
                        selectedCategory === cat
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}

              <button
                onClick={() => setIsAddCategoryOpen(true)}
                className="flex items-center gap-1 rounded-md sm:rounded-xl border border-dashed border-primary/40 bg-blue-50/40 hover:bg-blue-50 px-1.5 py-0.5 text-[9px] sm:text-xs font-bold text-primary transition-colors cursor-pointer"
                title="إضافة تصنيف جديد"
              >
                <Plus className="h-2.5 w-2.5" />
                <span>تصنيف جديد</span>
              </button>
            </div>

            {/* Products Empty State or Grid */}
            {products.length === 0 ? (
              <div className="py-10 sm:py-16 text-center bg-white rounded-xl sm:rounded-2xl border border-dashed border-slate-300 p-6">
                <div className="mx-auto mb-2.5 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-xl bg-blue-50 text-primary">
                  <Package className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h3 className="font-bold text-gray-900 text-xs sm:text-sm">لا توجد منتجات مسجلة حتى الآن</h3>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                  ابدأ بإضافة تصنيفاتك وأسعار جملة الكراتين لتبدأ محلات السوبر ماركت بالطلب منك.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => setIsAddCategoryOpen(true)}
                    className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-[11px] sm:text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <Tag className="h-3.5 w-3.5 text-primary" />
                    <span>إضافة تصنيف</span>
                  </button>
                  <button
                    onClick={() => setIsAddProductOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-[11px] sm:text-xs font-bold text-white shadow-xs hover:bg-primary/95 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>إضافة أول منتج</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col justify-between rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-primary">
                          {product.category}
                        </span>

                        <button
                          onClick={() => toggleStock(product.id)}
                          className={`rounded-full px-2 py-0.2 text-[9px] font-bold cursor-pointer transition-colors ${
                            product.inStock
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {product.inStock ? '✓ متوفر بالمخزن' : '✕ غير متوفر'}
                        </button>
                      </div>

                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                        {product.name}
                      </h3>

                      <div className="mt-2.5 space-y-1.5 rounded-lg sm:rounded-xl bg-slate-50/80 p-2.5 border border-slate-100 text-[10px] sm:text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">سعر جملة الكرتونة:</span>
                          <span className="text-xs sm:text-sm font-black text-primary">
                            {product.priceCarton} ج.م
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-slate-600">
                          <span>محتوى الكرتونة:</span>
                          <span className="font-semibold">{product.piecesPerCarton} قطعة</span>
                        </div>

                        <div className="flex items-center justify-between text-slate-600">
                          <span>السعر المقترح للقطعة:</span>
                          <span className="font-semibold text-emerald-700">
                            {product.pricePieceSuggested} ج.م
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/70 text-[10px]">
                          <span>الحد الأدنى للطلب:</span>
                          <span className="font-bold text-gray-800">{product.minOrder} كراتين</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => toggleStock(product.id)}
                        className="font-semibold text-slate-600 hover:text-primary cursor-pointer"
                      >
                        {product.inStock ? 'تحديد كـ "غير متوفر"' : 'تحديد كـ "متوفر"'}
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer p-0.5"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal: Add New Category */}
        {isAddCategoryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3">
            <div className="w-full max-w-sm rounded-2xl bg-white p-4 sm:p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-primary" />
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">إضافة تصنيف منتجات (Category)</h3>
                </div>
                <button
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddCategory} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    اسم التصنيف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="مثال: عصائر ومشروبات، ألبان، حلويات..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-gray-900 focus:bg-white focus:border-primary focus:outline-none"
                    autoFocus
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddCategoryOpen(false)}
                    className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary/95 cursor-pointer"
                  >
                    حفظ التصنيف
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add New Product */}
        {isAddProductOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3">
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-primary" />
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">إضافة صنف ومنتج جديد</h3>
                </div>
                <button
                  onClick={() => setIsAddProductOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    اسم المنتج والصنف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="مثال: شيبسي عائلي بالجبنة المتبلة"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-gray-900 focus:bg-white focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      الكاتيجوري / التصنيف <span className="text-red-500">*</span>
                    </label>
                    {categories.length > 0 ? (
                      <select
                        value={newProductCategory}
                        onChange={(e) => {
                          if (e.target.value === '__NEW__') {
                            const custom = prompt('اكتب اسم التصنيف الجديد:');
                            if (custom && custom.trim()) {
                              if (!categories.includes(custom.trim())) {
                                const updated = [...categories, custom.trim()];
                                setCategories(updated);
                                if (typeof window !== 'undefined') {
                                  localStorage.setItem('tawreed_company_categories', JSON.stringify(updated));
                                }
                              }
                              setNewProductCategory(custom.trim());
                            }
                          } else {
                            setNewProductCategory(e.target.value);
                          }
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-gray-900 focus:bg-white focus:border-primary focus:outline-none cursor-pointer"
                        required
                      >
                        <option value="">اختر التصنيف...</option>
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                        <option value="__NEW__">+ إضافة تصنيف جديد...</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={newProductCategory}
                        onChange={(e) => setNewProductCategory(e.target.value)}
                        placeholder="مثال: مقرمشات، ألبان..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-gray-900 focus:bg-white focus:border-primary focus:outline-none"
                        required
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      سعر جملة الكرتونة (ج.م) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newProductCartonPrice}
                      onChange={(e) => setNewProductCartonPrice(e.target.value)}
                      placeholder="180"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-gray-900 focus:bg-white focus:border-primary focus:outline-none text-right font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-600 mb-1">
                      قطع الكرتونة
                    </label>
                    <input
                      type="number"
                      value={newProductPieces}
                      onChange={(e) => setNewProductPieces(e.target.value)}
                      placeholder="24"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-1.5 text-xs text-gray-900 text-right font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-gray-600 mb-1">
                      سعر بيع القطعة
                    </label>
                    <input
                      type="number"
                      value={newProductSuggestedPrice}
                      onChange={(e) => setNewProductSuggestedPrice(e.target.value)}
                      placeholder="10"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-1.5 text-xs text-gray-900 text-right font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-gray-600 mb-1">
                      أقل طلب (كرتونة)
                    </label>
                    <input
                      type="number"
                      value={newProductMinOrder}
                      onChange={(e) => setNewProductMinOrder(e.target.value)}
                      placeholder="1"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-1.5 text-xs text-gray-900 text-right font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary/95 cursor-pointer"
                  >
                    حفظ المنتج
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: MERCHANTS & STORES DIRECTORY
           ======================================================== */}
        {activeTab === 'merchants' && (
          <div className="space-y-3 sm:space-y-4">
            <div className="rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                <div>
                  <h2 className="text-xs sm:text-base font-bold text-gray-900">
                    محلات التجزئة والسوبر ماركت المتاحة
                  </h2>
                  <p className="text-[10px] sm:text-xs text-slate-400">
                    تواصل مباشرة مع أصحاب المحلات في منطقتك لتوريد منتجاتك
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500">المحافظة:</span>
                  <select
                    value={merchantGovFilter}
                    onChange={(e) => setMerchantGovFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-gray-800 cursor-pointer"
                  >
                    <option value="الكل">كل المحافظات</option>
                    <option value="same">نفس المحافظة ({company.governorate})</option>
                    <option value="الإسماعيلية">الإسماعيلية</option>
                    <option value="الشرقية">الشرقية</option>
                    <option value="القاهرة">القاهرة</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={merchantSearchQuery}
                  onChange={(e) => setMerchantSearchQuery(e.target.value)}
                  placeholder="ابحث باسم المحل، المنطقة..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-3 pr-8 py-1.5 sm:py-2 text-[11px] sm:text-xs text-gray-900 focus:border-primary focus:bg-white focus:outline-none"
                />
                <Search className="absolute right-2.5 top-2 sm:top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
              {filteredMerchants.map((merchant) => (
                <div
                  key={merchant.id}
                  className="flex flex-col justify-between rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs hover:border-purple-200 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="rounded-md bg-purple-50 px-1.5 py-0.2 text-[10px] font-bold text-purple-700">
                        {merchant.type}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {merchant.joinedDate}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                      {merchant.name}
                    </h3>

                    <div className="mt-2 space-y-1 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1 font-medium">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        <span>{merchant.governorate} - {merchant.area}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">المسؤول:</span>
                        <span className="font-semibold text-gray-800">{merchant.owner}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">الطلبات:</span>
                        <span className="font-bold text-emerald-600">{merchant.ordersCount} طلب منجز</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5">
                    <a
                      href={`https://wa.me/20${merchant.phone.replace(/^0+/, '')}?text=${encodeURIComponent(
                        `مرحباً ${merchant.owner}، نحن ${company.companyName} لمجال ${company.industry}. نود عرض قائمة منتجاتنا وأسعار الجملة لمتجركم (${merchant.name}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>واتساب</span>
                    </a>

                    <button
                      onClick={() => handleSendCatalog(merchant)}
                      className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      <Send className="h-3 w-3 text-primary" />
                      <span>الكتالوج</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: ORDERS MANAGEMENT
           ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xs">
              <div>
                <h2 className="text-xs sm:text-base font-bold text-gray-900">سجل الطلبات الواردة</h2>
                <p className="text-[10px] sm:text-xs text-slate-400">
                  طلبات محلات السوبر ماركت المسجلة في توريد
                </p>
              </div>

              <span className="text-[11px] font-semibold text-primary bg-blue-50 px-2.5 py-0.5 rounded-full">
                {orders.length} طلبات
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="py-10 text-center bg-white rounded-xl sm:rounded-2xl border border-dashed border-slate-300 p-6">
                <ShoppingCart className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-gray-800 text-xs sm:text-sm">لا توجد طلبات واردة حالياً</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ستظهر هنا الطلبات فور قيام محلات السوبر ماركت بالطلب من كتالوج منتجاتك.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-4 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-mono text-[10px] text-slate-400">{order.id}</span>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900">{order.merchantName}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500">{order.itemsSummary}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">الإجمالي:</span>
                        <span className="text-xs sm:text-sm font-black text-gray-900">
                          {order.totalPrice.toLocaleString()} ج.م
                        </span>
                      </div>

                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'shipping')}
                          className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs cursor-pointer"
                        >
                          <Truck className="h-3 w-3" />
                          <span>شحن الطلب</span>
                        </button>
                      )}

                      {order.status === 'shipping' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                          className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs cursor-pointer"
                        >
                          <Check className="h-3 w-3" />
                          <span>تم التسليم</span>
                        </button>
                      )}

                      {order.status === 'delivered' && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                          مكتمل ✓
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 4: OFFERS & B2B DEALS
           ======================================================== */}
        {activeTab === 'offers' && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xs">
              <div>
                <h2 className="text-xs sm:text-base font-bold text-gray-900">عروض وخصومات الجملة</h2>
                <p className="text-[10px] sm:text-xs text-slate-400">
                  أطلق عروض بونص لتحفيز المحلات على زيادة حجم الطلبيات
                </p>
              </div>

              <button
                onClick={() => {
                  const title = prompt('عنوان العرض:');
                  if (title) {
                    const desc = prompt('تفاصيل الخصم (مثال: كرتونة هدية لكل 10 كراتين):');
                    setOffers([
                      {
                        id: 'of_' + Date.now(),
                        title: title.trim(),
                        discountText: desc || 'عرض ترويجي خاص',
                        minCartons: 5,
                        validUntil: 'نهاية الشهر',
                        active: true,
                      },
                      ...offers,
                    ]);
                    showToast('تم إطلاق العرض بنجاح!');
                  }
                }}
                className="flex items-center justify-center gap-1 rounded-xl bg-accent px-3 py-1.5 sm:py-2 text-xs font-bold text-gray-900 shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>إطلاق عرض جديد</span>
              </button>
            </div>

            {offers.length === 0 ? (
              <div className="py-10 text-center bg-white rounded-xl sm:rounded-2xl border border-dashed border-slate-300 p-6">
                <Percent className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-gray-800 text-xs sm:text-sm">لا توجد عروض نشطة حالياً</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  يمكنك إطلاق عروض بونص أو خصومات في أي وقت لتظهر للتجار.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="flex flex-col justify-between rounded-xl sm:rounded-2xl border border-amber-200/90 bg-gradient-to-b from-amber-50/40 to-white p-3.5 sm:p-4 shadow-xs"
                  >
                    <div>
                      <span className="rounded-full bg-amber-100 px-1.5 py-0.2 text-[9px] font-black text-amber-900 inline-block mb-1">
                        عرض نشط
                      </span>
                      <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug">
                        {offer.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-600">{offer.discountText}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-amber-100 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-700 font-semibold text-[10px]">يظهر للمحلات ✓</span>
                      <button
                        onClick={() => {
                          setOffers(offers.filter((o) => o.id !== offer.id));
                          showToast('تم إيقاف العرض');
                        }}
                        className="text-rose-500 hover:text-rose-700 text-[10px] cursor-pointer"
                      >
                        إيقاف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 5: COMPANY PROFILE OVERVIEW
           ======================================================== */}
        {activeTab === 'overview' && (
          <div className="rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-5 shadow-xs max-w-2xl mx-auto">
            <h2 className="text-xs sm:text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-primary" />
              <span>بيانات الشركة المسجلة بالمنظومة</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] mb-0.5">اسم الشركة</span>
                <span className="font-bold text-gray-900">{company.companyName}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] mb-0.5">اسم المستخدم (Username)</span>
                <span className="font-mono font-bold text-primary dir-ltr">@{company.username}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] mb-0.5">مجال التوريد</span>
                <span className="font-semibold text-gray-800">{company.industry}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] mb-0.5">المحافظة</span>
                <span className="font-semibold text-gray-800">{company.governorate}</span>
              </div>

              <div className="sm:col-span-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] mb-0.5">رقم الهاتف</span>
                <span className="font-semibold text-gray-800 dir-ltr text-right font-mono">{company.phone}</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: EDIT ACCOUNT
           ======================================================== */}
        {activeTab === 'profile' && (
          <div className="rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs max-w-lg mx-auto">
            <h2 className="text-xs sm:text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <Settings className="h-4 w-4 text-slate-500" />
              <span>تعديل بيانات الحساب</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1 text-[11px]">اسم المستخدم</label>
                <input
                  type="text"
                  disabled
                  value={company.username}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 font-mono text-slate-500 text-xs"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1 text-[11px]">اسم الشركة</label>
                <input
                  type="text"
                  defaultValue={company.companyName}
                  onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1 text-[11px]">مجال التوريد</label>
                <input
                  type="text"
                  defaultValue={company.industry}
                  onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1 text-[11px]">رقم الهاتف</label>
                <input
                  type="text"
                  defaultValue={company.phone}
                  onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-gray-900 text-right font-mono"
                  dir="ltr"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('tawreed_company_user', JSON.stringify(company));
                    }
                    showToast('تم حفظ التعديلات بنجاح');
                  }}
                  className="w-full rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/95 cursor-pointer shadow-xs"
                >
                  حفظ التعديلات
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Slide-over Side Drawer Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        />
      )}

      {/* Slide-over Side Drawer (الشريط الجانبي المنزلق) */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 sm:w-80 bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div>
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white font-black text-sm">
                ت
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-primary leading-none">توريد</span>
                <span className="text-[9px] text-slate-400">بوابة الموردين</span>
              </div>
            </Link>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              aria-label="إغلاق القائمة"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Company Mini Card in Drawer */}
          <div className="p-3 m-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white font-black text-xs">
              {company.companyName.trim().charAt(0) || 'ش'}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-xs font-bold text-gray-900 truncate">{company.companyName}</h3>
              <p className="text-[10px] text-slate-400">{company.governorate} • @{company.username}</p>
            </div>
          </div>

          {/* Navigation Links list */}
          <nav className="p-3 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider block mb-1">
              أقسام لوحة التحكم
            </span>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComponent className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {'isNew' in item && item.isNew && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
                      }`}>
                        جديد
                      </span>
                    )}

                    {'count' in item && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {/* New Features: سوق التصفية & رادار المحلات */}
            <div className="pt-2 border-t border-slate-100 mt-2 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider block mb-1">
                خدمات حصرية
              </span>

              {/* عملائي */}
              <Link
                href="/supplier/clients"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span>عملائي</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-purple-100 text-purple-700">
                    جديد
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                    {typeof window !== 'undefined' ? getClients().length : 12}
                  </span>
                </div>
              </Link>

              {/* النشر للعملاء */}
              <Link
                href="/supplier/updates"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Megaphone className="h-4 w-4 text-purple-600" />
                  <span>النشر للعملاء</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-purple-100 text-purple-700">
                  جديد
                </span>
              </Link>

              {/* سوق التصفية */}
              <Link
                href="/supplier/clearance"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="h-4 w-4 text-purple-600" />
                  <span>سوق التصفية</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-purple-100 text-purple-700">
                  جديد
                </span>
              </Link>

              {/* رادار المحلات */}
              <Link
                href="/supplier/radar"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Radar className="h-4 w-4 text-purple-600" />
                  <span>رادار المحلات</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-purple-100 text-purple-700">
                  جديد
                </span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
