import type { Metadata } from 'next';
import { MenuPageClient } from '@/components/menu-page-client';

export const metadata: Metadata = {
  title: 'The Menu — Samudhra',
  description:
    'Explore Signature Plates, Curries, Biryani & Rice, Weekend Thali, and Bar & Cocktails at Samudhra.',
};

export default function MenuPage() {
  return <MenuPageClient />;
}
