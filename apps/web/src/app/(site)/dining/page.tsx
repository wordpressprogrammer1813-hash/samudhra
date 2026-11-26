import type { Metadata } from 'next';
import { DiningPageClient } from '@/components/dining-page-client';

export const metadata: Metadata = {
  title: 'Dining & Lounge — Samudhra',
  description:
    'Explore The Dining Room, The Lounge, Private Dining, and our Photo Gallery at Samudhra.',
};

export default function DiningPage() {
  return <DiningPageClient />;
}
