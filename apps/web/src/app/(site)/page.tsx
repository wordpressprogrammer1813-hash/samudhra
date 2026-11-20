import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SectionRenderer } from '@/components/site/sections';
import { getPage } from '@/lib/content';

/** Title and description come from the page row, so the client owns the SEO. */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('home');
  if (!page) return {};
  return {
    // `absolute` so the client's own SEO title is not wrapped again by the
    // "%s | Samudhra" template in the root layout.
    title: page.seoTitle ? { absolute: page.seoTitle } : page.title,
    description: page.seoDescription ?? undefined,
  };
}

export default async function HomePage() {
  const page = await getPage('home');

  // Unpublished or missing: visitors get a 404, a signed-in super admin sees
  // the draft, because row level security decides what getPage returns.
  if (!page) notFound();

  return (
    <>
      {page.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  );
}
