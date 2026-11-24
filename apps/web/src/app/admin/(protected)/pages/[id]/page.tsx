import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CateringEventsForm } from '@/components/catering-events-form';
import { ContactSectionForm } from '@/components/contact-section-form';
import { DiningLoungeForm } from '@/components/dining-lounge-form';
import { HeroSectionForm } from '@/components/hero-section-form';
import { MenuShowcaseForm } from '@/components/menu-showcase-form';
import { OurStoryForm } from '@/components/our-story-form';
import { PageSectionsAccordion, type SectionItem } from '@/components/page-sections-accordion';
import { WeekendThaliForm } from '@/components/weekend-thali-form';
import { listMedia } from '@/lib/media';
import {
  getPageWithSections,
  toCateringEventsContent,
  toContactContent,
  toDiningLoungeContent,
  toHeroContent,
  toMenuShowcaseContent,
  toOurStoryContent,
  toWeekendThaliContent,
} from '@/lib/pages';

export default async function AdminPageEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [page, media] = await Promise.all([getPageWithSections(id), listMedia()]);
  if (!page) notFound();

  const items: SectionItem[] = page.sections.map((section) => {
    if (section.kind === 'hero') {
      return {
        id: section.id,
        label: section.label,
        editable: true,
        form: (
          <HeroSectionForm
            pageId={page.id}
            sectionId={section.id}
            content={toHeroContent(section.content)}
            media={media}
          />
        ),
      };
    }
    if (section.kind === 'menuShowcase') {
      return {
        id: section.id,
        label: section.label,
        editable: true,
        form: (
          <MenuShowcaseForm
            pageId={page.id}
            sectionId={section.id}
            content={toMenuShowcaseContent(section.content)}
            media={media}
          />
        ),
      };
    }
    if (section.kind === 'weekendThali') {
      return {
        id: section.id,
        label: section.label,
        editable: true,
        form: (
          <WeekendThaliForm
            pageId={page.id}
            sectionId={section.id}
            content={toWeekendThaliContent(section.content)}
            media={media}
          />
        ),
      };
    }
    if (section.kind === 'diningLounge') {
      return {
        id: section.id,
        label: section.label,
        editable: true,
        form: (
          <DiningLoungeForm
            pageId={page.id}
            sectionId={section.id}
            content={toDiningLoungeContent(section.content)}
            media={media}
          />
        ),
      };
    }
    if (section.kind === 'ourStory') {
      return {
        id: section.id,
        label: section.label,
        editable: true,
        form: (
          <OurStoryForm
            pageId={page.id}
            sectionId={section.id}
            content={toOurStoryContent(section.content)}
            media={media}
          />
        ),
      };
    }
    if (section.kind === 'cateringEvents') {
      return {
        id: section.id,
        label: section.label,
        editable: true,
        form: (
          <CateringEventsForm
            pageId={page.id}
            sectionId={section.id}
            content={toCateringEventsContent(section.content)}
            media={media}
          />
        ),
      };
    }
    if (section.kind === 'contactCta') {
      return {
        id: section.id,
        label: section.label,
        editable: true,
        form: (
          <ContactSectionForm
            pageId={page.id}
            sectionId={section.id}
            content={toContactContent(section.content)}
          />
        ),
      };
    }
    return { id: section.id, label: section.label, editable: false, form: null };
  });

  return (
    <div>
      <Link href="/admin/pages" className="text-sm text-heath/60 hover:text-heath">
        ← Pages
      </Link>

      <h1 className="mt-2 mb-8 text-2xl font-semibold text-heath">{page.title}</h1>

      <PageSectionsAccordion items={items} />
    </div>
  );
}
