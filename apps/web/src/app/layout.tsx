import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

// The whole Figma file uses Montserrat ("font family/Font 1").
const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Samudhra | Contemporary Indian Dining',
    template: '%s | Samudhra',
  },
  description:
    'Samudhra is a contemporary Indian restaurant - tradition, reinterpreted. Dining, lounge, catering and events in New Jersey and New York.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} min-h-dvh antialiased`}>{children}</body>
    </html>
  );
}
