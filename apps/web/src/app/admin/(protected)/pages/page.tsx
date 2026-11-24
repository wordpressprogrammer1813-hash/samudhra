import Link from 'next/link';
import { listPages } from '@/lib/pages';

export default async function AdminPagesPage() {
  const pages = await listPages();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-heath">Pages</h1>
      <p className="mt-1 text-sm text-heath/55">Each page&apos;s content, section by section.</p>

      <div className="mt-8 overflow-hidden rounded-[3px] border border-heath/15">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-heath/15 bg-heath/5 px-5 py-3 text-xs font-medium tracking-[0.2em] text-heath/60 uppercase">
          <span>Page</span>
          <span>Sections</span>
          <span>Status</span>
        </div>

        {pages.map((page) => (
          <Link
            key={page.id}
            href={`/admin/pages/${page.id}`}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-heath/10 px-5 py-4 last:border-b-0 hover:bg-heath/5"
          >
            <span className="text-sm font-medium text-heath">{page.title}</span>
            <span className="text-sm text-heath/60">{page.sectionCount}</span>
            <span
              className={`text-xs font-medium tracking-[0.15em] uppercase ${
                page.isPublished ? 'text-korma' : 'text-heath/40'
              }`}
            >
              {page.isPublished ? 'Published' : 'Draft'}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
