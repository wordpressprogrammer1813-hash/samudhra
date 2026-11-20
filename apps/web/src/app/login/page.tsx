import Link from 'next/link';
import type { Metadata } from 'next';
import { Waves } from 'lucide-react';
import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'Sign in' };

const errorMessages: Record<string, string> = {
  suspended: 'This account has been suspended. Contact a super admin.',
  forbidden: 'Your account does not have access to the admin panel.',
  auth: 'That sign-in link is no longer valid. Try again.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const mode = params.mode === 'signup' ? 'signup' : 'signin';
  const next = params.next?.startsWith('/') ? params.next : undefined;
  const notice = params.error ? errorMessages[params.error] : undefined;

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 text-lg font-semibold">
          <Waves className="size-5 text-primary" aria-hidden />
          Samudhra
        </Link>

        <div className="mt-8 rounded-card border border-border bg-card p-6">
          <h1 className="text-xl font-semibold">
            {mode === 'signin' ? 'Sign in' : 'Create your account'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === 'signin'
              ? 'Use the email and password for your Samudhra account.'
              : 'New accounts start with the "user" role.'}
          </p>

          {notice ? (
            <p role="alert" className="mt-4 rounded-lg bg-warning/15 p-3 text-sm text-warning">
              {notice}
            </p>
          ) : null}

          <div className="mt-6">
            <LoginForm mode={mode} next={next} />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === 'signin' ? (
              <>
                No account yet?{' '}
                <Link href="/login?mode=signup" className="font-medium text-primary hover:underline">
                  Create one
                </Link>
              </>
            ) : (
              <>
                Already registered?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </main>
  );
}
