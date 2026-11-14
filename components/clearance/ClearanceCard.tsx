import React, { useState } from 'react';
import { Package, MapPin, Tag, Edit3, Power, ShoppingCart, Check, AlertCircle } from 'lucide-react';
import { ClearanceListing } from '@/types/clearance';
import { ExpiryBadge } from './ExpiryBadge';

interface ClearanceCardProps {
  listing: ClearanceListing;
  mode?: 'supplier' | 'merchant';
  onEdit?: (listing: ClearanceListing) => void;
  onToggleStatus?: (id: string) => void;
  onOrder?: (listing: ClearanceListing, quantity: number) => void;
}

export function ClearanceCard({
  listing,
  mode = 'supplier',
  onEdit,
  onToggleStatus,
  onOrder,
}: ClearanceCardProps) {
  const [orderQty, setOrderQty] = useState<number>(listing.minOrderQuantity || 1);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const percentSold = Math.min(
    100,
    Math.round((listing.soldCartons / (listing.totalCartons || 1)) * 100)
  );

  const isSoldOut = listing.availableCartons <= 0 || listing.status === 'sold_out';
  const isInactive = listing.status === 'expired' || listing.status === 'sold_out';

  const handleOrderSubmit = () => {
    if (orderQty < listing.minOrderQuantity || orderQty > listing.availableCartons) return;
    if (onOrder) {
      onOrder(listing, orderQty);
    }
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 2500);
  };

  return (
    <div className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-3.5 sm:p-4 shadow-xs transition-all hover:border-gray-300 hover:shadow-md ${isInactive ? 'opacity-85' : ''}`}>
      {/* Top Banner / Discount & Expiry */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Big discount badge */}
          <div className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-2.5 py-1 text-xs sm:text-sm font-black text-white shadow-xs">
            <Tag className="h-3.5 w-3.5" />
            <span>خصم {listing.discountPercentage}%</span>
          </div>

          {/* Expiry Badge */}
          <ExpiryBadge expiryDateStr={listing.expiryDate} />
        </div>

        {/* Product Visual & Header */}
        <div className="flex items-start gap-3">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 text-slate-500 shadow-inner">
            <Package className="h-8 w-8 sm:h-9 sm:w-9 text-slate-600 group-hover:scale-105 transition-transform" />
          </div>

          <div className="flex-1 min-w-0">
            <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-slate-700">
              {listing.brand} • {listing.category}
            </span>
            <h4 className="mt-1 text-sm sm:text-base font-bold text-gray-900 line-clamp-2 leading-snug">
              {listing.productName}
            </h4>

            {/* Price Area */}
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-black text-emerald-700">
                {listing.clearancePrice.toLocaleString()} ج.م
              </span>
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                {listing.originalPrice.toLocaleString()} ج.م
              </span>
              <span className="text-[10px] text-gray-500 font-medium">/ للكرتونة</span>
            </div>
          </div>
        </div>

        {/* Quantity Progress Bar */}
        <div className="mt-4 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
          <div className="flex justify-between text-xs mb-1.5 font-medium">
            <span className="text-gray-600">
              المتاح: <strong className="text-gray-900 font-bold">{listing.availableCartons}</strong> كرتونة
            </span>
            <span className="text-slate-500 text-[11px]">
              تم بيع {listing.soldCartons} من {listing.totalCartons}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentSold > 80 ? 'bg-amber-500' : 'bg-emerald-600'
              }`}
              style={{ width: `${percentSold}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-gray-500">
            <span>الحد الأدنى للطلب: {listing.minOrderQuantity} كرتونة</span>
            <span>{percentSold}% محجوز</span>
          </div>
        </div>

        {/* Delivery Areas */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-[11px] text-gray-500 font-semibold">التوصيل إلى:</span>
          {listing.deliveryAreas.map((area) => (
            <span
              key={area}
              className="rounded-md bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700"
            >
              {area}
            </span>
          ))}
        </div>

        {listing.notes && (
          <p className="mt-2 text-[11px] text-gray-500 bg-amber-50/70 border border-amber-100 p-2 rounded-lg">
            {listing.notes}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        {mode === 'supplier' ? (
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => onEdit?.(listing)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2 px-3 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5 text-gray-500" />
              <span>تعديل</span>
            </button>

            <button
              onClick={() => onToggleStatus?.(listing.id)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition-colors ${
                listing.status === 'active'
                  ? 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                  : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <Power className="h-3.5 w-3.5" />
              <span>{listing.status === 'active' ? 'إيقاف العرض' : 'إعادة تفعيل'}</span>
            </button>
          </div>
        ) : (
          /* Merchant mode */
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                <button
                  type="button"
                  disabled={orderQty <= listing.minOrderQuantity || isSoldOut}
                  onClick={() => setOrderQty((q) => Math.max(listing.minOrderQuantity, q - 1))}
                  className="h-7 w-7 rounded-lg bg-white text-gray-700 font-bold hover:bg-gray-100 disabled:opacity-40 flex items-center justify-center text-sm shadow-xs"
                >
                  -
                </button>
                <input
                  type="number"
                  disabled={isSoldOut}
                  min={listing.minOrderQuantity}
                  max={listing.availableCartons}
                  value={orderQty}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || listing.minOrderQuantity;
                    setOrderQty(Math.min(listing.availableCartons, Math.max(listing.minOrderQuantity, val)));
                  }}
                  className="w-12 text-center text-xs font-bold bg-transparent text-gray-900 focus:outline-none"
                />
                <button
                  type="button"
                  disabled={orderQty >= listing.availableCartons || isSoldOut}
                  onClick={() => setOrderQty((q) => Math.min(listing.availableCartons, q + 1))}
                  className="h-7 w-7 rounded-lg bg-white text-gray-700 font-bold hover:bg-gray-100 disabled:opacity-40 flex items-center justify-center text-sm shadow-xs"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                disabled={isSoldOut || orderSuccess}
                onClick={handleOrderSubmit}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold text-white transition-all shadow-xs ${
                  isSoldOut
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : orderSuccess
                    ? 'bg-emerald-600'
                    : 'bg-[#0f2d4a] hover:bg-[#163e63] active:scale-[0.98]'
                }`}
              >
                {orderSuccess ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>تم طلب {orderQty} كرتونة!</span>
                  </>
                ) : isSoldOut ? (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    <span>نفدت الكمية</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    <span>اطلب الآن ({orderQty * listing.clearancePrice} ج.م)</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-500">
              الدفع عند الاستلام مع فحص البضاعة
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
