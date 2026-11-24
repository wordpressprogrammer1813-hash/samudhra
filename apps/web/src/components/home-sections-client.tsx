'use client';

import { useEffect, useState } from 'react';
import { ActionModal, type ActionIntent } from '@/components/action-modal';
import { CateringEvents, type CateringEventsProps } from '@/components/catering-events';
import { ContactSection, type ContactSectionProps } from '@/components/contact-section';
import { DiningLounge, type DiningLoungeProps } from '@/components/dining-lounge';
import { EventInquiryModal } from '@/components/event-inquiry-modal';
import {
  LocationGate,
  type LocationGateCard,
  type LocationGateNavLink,
} from '@/components/location-gate';
import type { LocationGateSocialLinks } from '@/lib/settings';
import { OurStory, type OurStoryProps } from '@/components/our-story';
import { WeekendThali, type WeekendThaliProps } from '@/components/weekend-thali';

type WeekendThaliData = Omit<WeekendThaliProps, 'onReserveClick'>;
type DiningLoungeData = DiningLoungeProps;
type OurStoryData = Omit<OurStoryProps, 'onCtaClick'>;
type CateringEventsData = Omit<CateringEventsProps, 'onInquiryClick'>;
type ContactSectionData = Omit<
  ContactSectionProps,
  'selectedLocation' | 'onReserveClick' | 'onOrderClick'
>;

export function HomeSectionsClient({
  weekendThali,
  diningLounge,
  ourStory,
  cateringEvents,
  contact,
  locationGate,
}: {
  weekendThali?: WeekendThaliData;
  diningLounge?: DiningLoungeData;
  ourStory?: OurStoryData;
  cateringEvents?: CateringEventsData;
  contact?: ContactSectionData;
  locationGate?: {
    logoUrl?: string;
    cards?: [LocationGateCard, LocationGateCard];
    navLinks?: LocationGateNavLink[];
    socialLinks?: LocationGateSocialLinks;
  };
}) {
  const [isGateOpen, setIsGateOpen] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(
    () => locationGate?.cards?.[0]?.name ?? '',
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [actionState, setActionState] = useState<{
    isOpen: boolean;
    intent: ActionIntent;
    location: string | null;
  }>({
    isOpen: false,
    intent: 'reserve',
    location: null,
  });

  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    const handleDismissGate = () => setIsGateOpen(false);
    window.addEventListener('samudhra:dismiss-gate', handleDismissGate);
    return () => window.removeEventListener('samudhra:dismiss-gate', handleDismissGate);
  }, []);

  useEffect(() => {
    if (isGateOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isGateOpen]);

  function handleSelectLocation(location: string, index = 0) {
    setSelectedLocation(location);
    setSelectedIndex(index);
    setIsGateOpen(false);
    // Directly reveals home page with smooth exit transition.
    // Last section (ContactSection) automatically reflects the selected location.
    // No popup modal is opened, per user request.
  }

  function handleNavigate(href: string) {
    setIsGateOpen(false);
    if (typeof window !== 'undefined' && href.startsWith('#')) {
      const id = href.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  function handleOpenMenu() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('samudhra:open-menu'));
    }
  }

  function openAction(intent: ActionIntent, location: string | null = null) {
    setActionState({
      isOpen: true,
      intent,
      location: location || selectedLocation,
    });
  }

  function closeAction() {
    setActionState((prev) => ({ ...prev, isOpen: false }));
  }

  return (
    <>
      {/* 00. Initial Welcome / Location Selection Gate */}
      <LocationGate
        isOpen={isGateOpen}
        onSelectLocation={handleSelectLocation}
        onNavigate={handleNavigate}
        onOpenMenu={handleOpenMenu}
        logoUrl={locationGate?.logoUrl}
        cards={locationGate?.cards}
        navLinks={locationGate?.navLinks}
        socialLinks={locationGate?.socialLinks}
      />

      {/* 03. Weekend Thali */}
      <WeekendThali {...weekendThali} onReserveClick={() => openAction('reserve', selectedLocation)} />

      {/* 04. Dining & Lounge */}
      <DiningLounge {...diningLounge} />

      {/* 05. Our Story */}
      <OurStory {...ourStory} />

      {/* 06. Catering & Events */}
      <CateringEvents {...cateringEvents} onInquiryClick={() => setInquiryOpen(true)} />

      {/* 07. Contact & Locations */}
      <ContactSection
        {...contact}
        selectedLocation={selectedLocation}
        selectedIndex={selectedIndex}
        onReserveClick={(loc) => openAction('reserve', loc || selectedLocation)}
        onOrderClick={(loc) => openAction('order', loc || selectedLocation)}
      />

      {/* Interactive Reservation / Ordering Dialog */}
      <ActionModal
        key={`${actionState.isOpen}-${actionState.location}`}
        isOpen={actionState.isOpen}
        intent={actionState.intent}
        initialLocation={actionState.location}
        onClose={closeAction}
      />

      {/* Interactive Event Inquiry Dialog */}
      <EventInquiryModal
        key={String(inquiryOpen)}
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </>
  );
}
