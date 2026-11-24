import { HeroSection } from '@/components/hero-section';
import { HomeSectionsClient } from '@/components/home-sections-client';
import { SignatureDishes } from '@/components/signature-dishes';
import {
  getPublicSectionContent,
  toCateringEventsContent,
  toContactContent,
  toDiningLoungeContent,
  toHeroContent,
  toMenuShowcaseContent,
  toOurStoryContent,
  toWeekendThaliContent,
  type DishCard,
} from '@/lib/pages';
import { flattenMenuLinks, getPublicMenuById } from '@/lib/menus';
import { getPublicLocationGateSettings, getPublicSiteSettings } from '@/lib/settings';

function str(value: string): string | undefined {
  return value || undefined;
}

const DEFAULT_DISH_CARDS: DishCard[] = [
  {
    numeral: 'i.',
    title: 'Curries',
    description: 'Rooted in tradition, rich with spice.',
    image: '/images/curry-bowl.webp',
    href: '#menu',
    linkLabel: 'View menu',
  },
  {
    numeral: 'ii.',
    title: 'Signature Plates',
    description: 'Familiar flavours, refined for the table.',
    image: '/images/beetroot-dish.jpg',
    href: '#menu',
    linkLabel: 'View menu',
  },
  {
    numeral: 'iii.',
    title: 'Biryani',
    description: 'Fresh, vibrant and distinctly Samudhra.',
    image: '/images/biryani-dish.jpg',
    href: '#menu',
    linkLabel: 'View menu',
  },
];

export default async function HomePage() {
  const [heroRaw, menuRaw, thaliRaw, diningRaw, storyRaw, cateringRaw, contactRaw, locationGate, site] =
    await Promise.all([
      getPublicSectionContent('home', 'hero'),
      getPublicSectionContent('home', 'menu-showcase'),
      getPublicSectionContent('home', 'weekend-thali'),
      getPublicSectionContent('home', 'dining-lounge'),
      getPublicSectionContent('home', 'our-story'),
      getPublicSectionContent('home', 'catering-events'),
      getPublicSectionContent('home', 'contact'),
      getPublicLocationGateSettings(),
      getPublicSiteSettings(),
    ]);
  const hero = toHeroContent(heroRaw ?? {});
  const menu = toMenuShowcaseContent(menuRaw ?? {});
  const thali = toWeekendThaliContent(thaliRaw ?? {});
  const dining = toDiningLoungeContent(diningRaw ?? {});
  const story = toOurStoryContent(storyRaw ?? {});
  const catering = toCateringEventsContent(cateringRaw ?? {});
  const contact = toContactContent(contactRaw ?? {});

  // Fallbacks from design specification if database has empty fields
  const heroEyebrow = hero.eyebrow || 'Contemporary Indian Dining';
  const heroTitleLine1 = hero.titleLine1 || 'Traditional';
  const heroTitleLine2 = hero.titleLine2 || 'Reinterpreted';
  const heroSubtitle = hero.subtitle || 'A contemporary expression of Indian warmth';
  const heroBg = hero.backgroundImage || '/images/beetroot-dish.jpg';
  const heroActions = hero.actions.some((a) => a.label)
    ? hero.actions
    : [
        { label: 'Reserve a Table', href: '#contact' },
        { label: 'Order Online', href: '#contact' },
        { label: 'Private Events', href: '#catering' },
      ];

  const menuCards = menu.cards.length > 0 ? menu.cards : DEFAULT_DISH_CARDS;
  const menuEyebrow = menu.eyebrow || 'Our Menu';
  const menuHeading = menu.heading || 'From the Samudhra kitchen';
  const menuBody =
    menu.body ||
    'Each dish begins with the traditions, spices and regional flavours that shape Indian cooking — interpreted through a modern dining experience.';
  const menuStarImage = menu.starImage || '/images/star-shape.png';
  const menuCtaLabel = menu.ctaLabel || 'Order Online';
  const menuCtaHref = menu.ctaHref || '#contact';

  const thaliFigures = Object.values(thali.figureImages).some(Boolean) ? thali.figureImages : undefined;

  const cateringCard1 = catering.card1.image || catering.card1.titleLine1 ? catering.card1 : undefined;
  const cateringCard2 = catering.card2.image || catering.card2.titleLine1 ? catering.card2 : undefined;

  const contactLocations = contact.locations.some((loc) => loc.name) ? contact.locations : undefined;

  const gateMenu = locationGate.menuId ? await getPublicMenuById(locationGate.menuId) : null;
  const gateNavLinks = gateMenu ? flattenMenuLinks(gateMenu.items) : undefined;

  return (
    <main>
      {/* 01. Hero Section (Untouched) */}
      <HeroSection
        eyebrow={heroEyebrow}
        titleLine1={heroTitleLine1}
        titleLine2={heroTitleLine2}
        subtitle={heroSubtitle}
        backgroundImage={heroBg}
        actions={heroActions}
      />

      {/* 02. Signature Dishes (Untouched) */}
      <SignatureDishes
        eyebrow={menuEyebrow}
        heading={menuHeading}
        body={menuBody}
        starImage={menuStarImage}
        ctaLabel={menuCtaLabel}
        ctaHref={menuCtaHref}
        cards={menuCards}
      />

      {/* 03-07. Generated Sections & Interactive Dialogs */}
      <HomeSectionsClient
        weekendThali={{
          eyebrow: str(thali.eyebrow),
          titleLine1: str(thali.titleLine1),
          titleLine2: str(thali.titleLine2),
          description: str(thali.description),
          reserveLabel: str(thali.reserveLabel),
          reserveHref: str(thali.reserveHref),
          menuLabel: str(thali.menuLabel),
          menuHref: str(thali.menuHref),
          plateImage: str(thali.plateImage),
          figureImages: thaliFigures,
        }}
        diningLounge={{
          eyebrow: str(dining.eyebrow),
          heading: str(dining.heading),
          intro: str(dining.intro),
          rows: dining.rows.some((row) => row.title) ? dining.rows : undefined,
        }}
        ourStory={{
          kicker: str(story.kicker),
          heading: str(story.heading),
          quote: str(story.quote),
          body: str(story.body),
          ctaLabel: str(story.ctaLabel),
          ctaHref: str(story.ctaHref),
          image: str(story.image),
        }}
        cateringEvents={{
          eyebrow: str(catering.eyebrow),
          headingLine1: str(catering.headingLine1),
          headingLine2: str(catering.headingLine2),
          headingLine3: str(catering.headingLine3),
          description: str(catering.description),
          card1: cateringCard1,
          card2: cateringCard2,
        }}
        contact={{
          eyebrow: str(contact.eyebrow),
          heading: str(contact.heading),
          intro: str(contact.intro),
          reserveCtaLabel: str(contact.reserveCtaLabel),
          reserveCtaHref: str(contact.reserveCtaHref),
          orderCtaLabel: str(contact.orderCtaLabel),
          orderCtaHref: str(contact.orderCtaHref),
          locations: contactLocations,
        }}
        locationGate={{
          logoUrl: str(site.logoUrl ?? ''),
          cards: locationGate.cards,
          navLinks: gateNavLinks,
          socialLinks: locationGate.socialLinks,
        }}
      />
    </main>
  );
}
