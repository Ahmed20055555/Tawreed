'use client';

import React, { useState } from 'react';
import { ShoppingCart, Lock, Check, Link2, Box } from 'lucide-react';
import { SupplierProduct, Supplier } from '@/types/merchant';
import { useMerchant } from '@/context/MerchantContext';
import { QuantityStepper } from './QuantityStepper';

interface ProductCardProps {
  product: SupplierProduct;
  supplier: Supplier;
  isLinked: boolean;
}

export function ProductCard({ product, supplier, isLinked }: ProductCardProps) {
  const { addToCart, link } = useMerchant();
  const [quantity, setQuantity] = useState(product.minOrder || 1);

  const handleAdd = () => {
    if (!isLinked) return;
    addToCart(product, supplier, quantity);
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs hover:border-slate-300 transition-all">
      <div>
        {/* Product Image Placeholder */}
        <div className="relative mb-3 flex h-32 sm:h-36 w-full items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 overflow-hidden">
          <div className="flex flex-col items-center gap-1">
            <Box className="h-8 w-8 text-slate-300" />
            <span className="text-[10px] font-bold text-slate-400">{product.category}</span>
          </div>

          {product.originalPrice && isLinked && (
            <span className="absolute top-2 right-2 rounded-full bg-rose-600 px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
              خصم خاص
            </span>
          )}

          {product.sku && (
            <span className="absolute bottom-2 left-2 font-mono text-[9px] text-slate-400 bg-white/80 px-1.5 py-0.2 rounded">
              {product.sku}
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <span className="rounded-md bg-slate-100 px-1.5 py-0.2 text-[9px] font-bold text-slate-600">
            {product.category}
          </span>

          <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug line-clamp-2">
            {product.name}
          </h3>

          <p className="text-[11px] text-slate-400">
            الوحدة: <span className="font-semibold text-gray-700">{product.unit}</span>
          </p>

          <p className="text-[10px] text-slate-400">
            الحد الأدنى للطلب: <span className="font-bold text-[#0f2d4a]">{product.minOrder} كرتونة</span>
          </p>
        </div>
      </div>

      {/* Pricing & Add to Cart Area */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        {isLinked ? (
          <div className="space-y-2.5">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-base sm:text-lg font-black text-gray-900">
                  {product.price.toLocaleString()} ج.م
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-slate-400 line-through mr-1.5">
                    {product.originalPrice.toLocaleString()} ج
                  </span>
                )}
              </div>

              <span className="text-[10px] text-slate-400">شامل الضريبة</span>
            </div>

            <div className="flex items-center gap-2">
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                min={product.minOrder || 1}
              />

              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#0f2d4a] hover:bg-blue-900 py-2 px-2.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>أضف</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-center py-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 py-1.5 px-2 rounded-xl">
              <Lock className="h-3.5 w-3.5 text-amber-600" />
              <span>اربط مع الشركة لعرض الأسعار</span>
            </div>

            <button
              type="button"
              onClick={() => link(supplier.id)}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-1.5 text-xs font-bold text-[#0f2d4a] transition-colors cursor-pointer"
            >
              <Link2 className="h-3.5 w-3.5" />
              <span>ربط الآن</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
