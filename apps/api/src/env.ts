import { z } from 'zod';

/**
 * Every environment variable the API needs, validated once at boot so a
 * missing key fails loudly on start instead of on the first request.
 *
 * Values are loaded by Node itself via --env-file-if-exists (see package.json),
 * so there is no dotenv dependency.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),

  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(10),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(10),

  /** Comma separated list of browser origins allowed to call this API. */
  CORS_ORIGINS: z.string().default('http://localhost:3000'),

  /** Used for links in invite / recovery emails. */
  SITE_URL: z.string().url().default('http://localhost:3000'),
});

const parsed = envSchema.safeParse({
  ...process.env,
  // Fall back to the NEXT_PUBLIC_* names so one root .env can feed both apps.
  SUPABASE_URL: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY:
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SITE_URL: process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL,
});

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('\n');
  console.error(`\nInvalid API environment:\n${issues}\n\nCopy .env.example to .env and fill it in.\n`);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  corsOrigins: parsed.data.CORS_ORIGINS.split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  isProd: parsed.data.NODE_ENV === 'production',
  isDev: parsed.data.NODE_ENV === 'development',
};

export type Env = typeof env;
