'use client';

import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  badge?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  badge,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center space-y-3.5">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
        <Icon className="h-7 w-7" />
      </div>

      <div className="space-y-1">
        {badge && (
          <span className="inline-block rounded-full bg-purple-100 text-purple-700 px-2.5 py-0.5 text-xs font-bold mb-1">
            {badge}
          </span>
        )}
        <h3 className="text-base sm:text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {(actionText || secondaryActionText) && (
        <div className="pt-2 flex items-center justify-center gap-2.5 flex-wrap">
          {actionText && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0f2d4a] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#163e63] transition-colors cursor-pointer"
            >
              {actionText}
            </button>
          )}

          {secondaryActionText && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {secondaryActionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
