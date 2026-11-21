import type { ApiResponse } from '@samudra/shared';

/**
 * Starter page. It calls the API so the two halves of the setup are proven
 * to talk to each other — if this says "connected", the wiring is good.
 */

interface Health {
  status: string;
  uptime: number;
  now: string;
}

async function getHealth(): Promise<Health | null> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
  try {
    const res = await fetch(`${base}/api/health`, { cache: 'no-store' });
    const body = (await res.json()) as ApiResponse<Health>;
    return body.ok ? body.data : null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const health = await getHealth();

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-8 px-6 py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Samudra</h1>
        <p className="mt-2 text-muted-foreground">
          Next.js app, Express API and a shared types package, in one repository.
        </p>
      </div>

      <div className="rounded-xl border border-border p-5">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className={`size-2.5 rounded-full ${health ? 'bg-green-500' : 'bg-amber-500'}`}
          />
          <p className="font-medium">{health ? 'API connected' : 'API not reachable'}</p>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {health ? (
            <>
              Answered in {health.uptime}s of uptime, at {new Date(health.now).toLocaleTimeString()}
              .
            </>
          ) : (
            <>
              Start both with <code className="font-mono">npm run dev</code> at the repository root,
              and check <code className="font-mono">NEXT_PUBLIC_API_URL</code>.
            </>
          )}
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        Nothing else is built yet — this is the starting point.
      </p>
    </main>
  );
}
