import type { Metadata } from 'next';
import { ContactPageClient } from '@/components/contact-page-client';

export const metadata: Metadata = {
  title: 'Contact & Reservations — Samudhra',
  description:
    'Make a reservation, find our New Jersey and New York locations, view opening hours, or order takeaway online.',
};

export default function ContactPage() {
  return <ContactPageClient />;
}
