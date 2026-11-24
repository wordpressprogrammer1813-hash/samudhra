import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Samudhra — Contemporary Indian Dining',
  description: 'Samudhra — tradition, reinterpreted. Contemporary Indian dining.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
