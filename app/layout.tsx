import './globals.css';
import { Cairo } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0A3D62',
};

export const metadata: Metadata = {
  title: 'توريد | منصة ربط الشركات والموردين بالتجار في مصر',
  description: 'منصة B2B تربط الشركات بالمحلات والسوبر ماركت لتسهيل طلب البضائع والتوريد السريع.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} scroll-smooth`}>
      <head />
      <body className="font-sans antialiased bg-slate-50 text-gray-900 min-h-screen selection:bg-accent/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
