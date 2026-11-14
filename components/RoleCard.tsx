import Link from 'next/link';
import { Factory, Store, ArrowLeft } from 'lucide-react';

interface RoleCardProps {
  href: string;
  icon: 'factory' | 'store';
  title: string;
  description: string;
  buttonText: string;
}

export function RoleCard({ href, icon, title, description, buttonText }: RoleCardProps) {
  const IconComponent = icon === 'factory' ? Factory : Store;

  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 md:p-7 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-md active:scale-[0.98] active:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label={`${title} - ${buttonText}`}
    >
      <div>
        {/* Top header inside card */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-xl bg-blue-50 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-white">
            <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200 group-hover:scale-110" />
          </div>

          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-200 group-hover:bg-primary/10 group-hover:text-primary group-hover:-translate-x-0.5">
            <ArrowLeft className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Card Title */}
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 transition-colors group-hover:text-primary">
          {title}
        </h3>

        {/* Card Description */}
        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-gray-500">
          {description}
        </p>
      </div>

      {/* Button */}
      <div className="mt-4 sm:mt-6">
        <span className="flex min-h-[40px] sm:min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-primary px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all duration-150 group-hover:bg-primary/95 group-active:brightness-95">
          <span>{buttonText}</span>
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
