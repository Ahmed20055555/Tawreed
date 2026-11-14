'use client';

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { StoreLocation } from '@/types/store';
import { ISMAILIA_CENTER } from '@/data/stores-mock';
import { MapPin, Store, Navigation, Send, CheckCircle2 } from 'lucide-react';

// Custom DivIcons for Leaflet
function createCustomIcon(status: 'registered' | 'unregistered', invited?: boolean) {
  let bgColor = '#64748b'; // Slate / Gray for unregistered
  let ringColor = 'rgba(100, 116, 139, 0.2)';
  let label = 'محل';

  if (status === 'registered') {
    bgColor = '#10b981'; // Green for registered
    ringColor = 'rgba(16, 185, 129, 0.3)';
  } else if (invited) {
    bgColor = '#8b5cf6'; // Purple for invited
    ringColor = 'rgba(139, 92, 246, 0.3)';
  }

  const html = `
    <div style="
      background-color: ${bgColor};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 10px ${ringColor}, 0 2px 4px rgba(0,0,0,0.15);
      border: 2px solid white;
      transform: translate(-50%, -50%);
      cursor: pointer;
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
        <path d="M2 7h20"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

// Controller to auto pan map to selected store
function MapController({ center }: { center?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, Math.max(map.getZoom(), 14), { animate: true });
    }
  }, [center, map]);
  return null;
}

interface StoreMapLeafletProps {
  stores: StoreLocation[];
  selectedStore: StoreLocation | null;
  onSelectStore: (store: StoreLocation) => void;
  onInviteStore: (store: StoreLocation) => void;
}

export default function StoreMapLeaflet({
  stores,
  selectedStore,
  onSelectStore,
  onInviteStore,
}: StoreMapLeafletProps) {
  const centerPos: [number, number] = selectedStore
    ? [selectedStore.lat, selectedStore.lng]
    : [ISMAILIA_CENTER.lat, ISMAILIA_CENTER.lng];

  return (
    <div className="relative w-full h-[380px] sm:h-[600px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs z-0">
      <MapContainer
        center={[ISMAILIA_CENTER.lat, ISMAILIA_CENTER.lng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapController center={selectedStore ? [selectedStore.lat, selectedStore.lng] : undefined} />
        
        {/* Free OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Company Base Location Marker */}
        <Marker
          position={[ISMAILIA_CENTER.lat, ISMAILIA_CENTER.lng]}
          icon={L.divIcon({
            className: 'custom-company-marker',
            html: `
              <div style="
                background: #0f2d4a;
                color: white;
                padding: 4px 8px;
                border-radius: 8px;
                font-weight: bold;
                font-size: 11px;
                border: 2px solid white;
                box-shadow: 0 4px 10px rgba(15, 45, 74, 0.4);
                white-space: nowrap;
                transform: translate(-50%, -50%);
              ">
                🏢 مقر الشركة
              </div>
            `,
            iconSize: [80, 30],
            iconAnchor: [40, 15],
          })}
        >
          <Popup>
            <div className="text-right p-1 font-sans" dir="rtl">
              <strong className="text-xs font-bold text-gray-900 block">مقر شركتك (نقطة الانطلاق)</strong>
              <span className="text-[11px] text-gray-500">شارع شبين الكوم، الإسماعيلية</span>
            </div>
          </Popup>
        </Marker>

        {/* Store Markers */}
        {stores.map((store) => {
          const icon = createCustomIcon(store.status, store.invited);
          return (
            <Marker
              key={store.id}
              position={[store.lat, store.lng]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectStore(store),
              }}
            >
              <Popup>
                <div className="text-right p-1 font-sans min-w-[200px]" dir="rtl">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {store.type}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        store.status === 'registered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : store.invited
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {store.status === 'registered'
                        ? 'مسجل على المنصة'
                        : store.invited
                        ? 'تمت دعوته'
                        : 'غير مسجل بعد'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-gray-900">{store.name}</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    {store.area} • يبعد {store.distanceKm} كم
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    المالك: {store.ownerName}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-gray-100">
                    {store.status === 'registered' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>عميل مسجل ونشط</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onInviteStore(store);
                        }}
                        className="w-full inline-flex items-center justify-center gap-1 rounded-lg bg-[#0f2d4a] py-1 px-2 text-[11px] font-bold text-white hover:bg-[#163e63] transition-colors"
                      >
                        <Send className="h-3 w-3" />
                        <span>{store.invited ? 'إعادة إرسال دعوة' : 'إرسال دعوة الآن'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend */}
      <div className="absolute bottom-3 right-3 z-[1000] rounded-xl bg-white/95 backdrop-blur-xs p-2.5 shadow-md border border-slate-200/90 text-[11px] space-y-1">
        <span className="font-bold text-gray-800 block text-[10px] mb-1">دليل الخريطة</span>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500 border border-white shadow-xs" />
          <span className="text-gray-700 font-medium">مسجل على المنصة</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-slate-500 border border-white shadow-xs" />
          <span className="text-gray-700 font-medium">غير مسجل بعد</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-purple-500 border border-white shadow-xs" />
          <span className="text-gray-700 font-medium">تمت دعوته</span>
        </div>
      </div>
    </div>
  );
}
