import { z } from 'zod';

/**
 * Every environment variable the API needs, validated once at boot so a
 * missing or malformed value fails loudly on start rather than on the first
 * request. Values are loaded by Node itself via --env-file-if-exists, so
 * there is no dotenv dependency.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),

  /** Comma separated list of browser origins allowed to call this API. */
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('\n');
  console.error(`\nInvalid API environment:\n${issues}\n\nCopy .env.example to .env.\n`);
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
