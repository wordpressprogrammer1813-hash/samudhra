import Link from 'next/link';
import { ArrowRight, LayoutDashboard, ShieldCheck, Waves } from 'lucide-react';
import { getSessionUser } from '@/lib/auth';
import { canAccessAdmin } from '@samudra/shared';

/**
 * Placeholder landing page. The real marketing site gets built from the
 * Figma file - this exists so `npm run dev` shows something meaningful and
 * so the admin entry point is reachable.
 */
export default async function HomePage() {
  const session = await getSessionUser();
  const showAdminLink = canAccessAdmin(session?.profile.role);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 py-10 sm:px-6">
      <header className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-lg font-semibold">
          <Waves className="size-5 text-zest" aria-hidden />
          Samudhra
        </span>

        <nav className="flex items-center gap-2 text-sm">
          {showAdminLink ? (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 font-medium text-primary-foreground transition-colors hover:bg-creole"
            >
              <LayoutDashboard className="size-4" aria-hidden />
              Admin panel
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 font-medium transition-colors hover:bg-muted"
            >
              Sign in
            </Link>
          )}
        </nav>
      </header>

      <section className="flex flex-1 flex-col justify-center py-16">
        <p className="text-sm font-medium text-zest">Project scaffold ready</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Next.js + Node API + Supabase, wired together
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
          The frontend, the Express API, the shared types package and the database schema with
          roles, row level security and an audit trail are all in place. The next step is to build
          the real screens from the Figma design.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-creole"
          >
            Open the admin panel
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ShieldCheck className="size-4" aria-hidden />
            Sign in
          </Link>
        </div>
      </section>

      <footer className="border-t border-border pt-6 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Samudhra
      </footer>
    </main>
  );
}
