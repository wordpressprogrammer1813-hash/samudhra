import Link from 'next/link';
import type { Metadata } from 'next';
import { Wordmark } from '@/components/site/primitives';
import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'Sign in' };

const errorMessages: Record<string, string> = {
  suspended: 'This account has been suspended.',
  forbidden: 'That account cannot open the admin panel.',
  auth: 'That sign-in link is no longer valid. Try again.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith('/') ? params.next : undefined;
  const notice = params.error ? errorMessages[params.error] : undefined;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-serenade px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex justify-center" aria-label="Samudhra, home">
          <Wordmark className="text-4xl" />
        </Link>

        <div className="mt-8 rounded-card border border-border bg-card p-6">
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The admin panel for editing the Samudhra website.
          </p>

          {notice ? (
            <p role="alert" className="mt-4 rounded-lg bg-warning/15 p-3 text-sm text-warning">
              {notice}
            </p>
          ) : null}

          <div className="mt-6">
            <LoginForm next={next} />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">
            Back to the website
          </Link>
        </p>
      </div>
    </main>
  );
}
