import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  colorScheme?: 'blue' | 'emerald' | 'purple' | 'amber';
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50/70',
    border: 'border-blue-100',
    iconBg: 'bg-blue-600 text-white',
    text: 'text-blue-900',
  },
  emerald: {
    bg: 'bg-emerald-50/70',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-600 text-white',
    text: 'text-emerald-900',
  },
  purple: {
    bg: 'bg-purple-50/70',
    border: 'border-purple-100',
    iconBg: 'bg-purple-600 text-white',
    text: 'text-purple-900',
  },
  amber: {
    bg: 'bg-amber-50/70',
    border: 'border-amber-100',
    iconBg: 'bg-amber-600 text-white',
    text: 'text-amber-900',
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  colorScheme = 'blue',
}: StatCardProps) {
  const scheme = colorStyles[colorScheme];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${scheme.border} bg-white p-2 sm:p-3 shadow-xs transition-all hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[9px] sm:text-[11px] font-semibold text-gray-500">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-[14px] sm:text-xl font-black text-gray-900 tracking-tight">{value}</h3>
            {badge && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">{subtitle}</p>}
        </div>
        <div className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl ${scheme.iconBg} shadow-sm`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
    </div>
  );
}
