import { AdminLoginForm } from '@/components/admin-login-form';
import { getPublicSiteSettings } from '@/lib/settings';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const [{ next }, site] = await Promise.all([searchParams, getPublicSiteSettings()]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-serenade px-6 text-heath">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          {site.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary storage URL, not a next/image case yet
            <img src={site.logoUrl} alt="Samudhra" className="h-10 w-auto" />
          ) : (
            <p className="text-lg font-medium tracking-wide">Samudhra</p>
          )}
          <div>
            <p className="text-sm font-medium tracking-[0.2em] uppercase">Admin</p>
            <p className="mt-2 text-sm text-heath/70">Enter the superadmin key to continue.</p>
          </div>
        </div>
        <AdminLoginForm next={next ?? '/admin'} />
      </div>
    </main>
  );
}
