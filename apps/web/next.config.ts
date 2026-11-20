import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The shared workspace package ships ES modules compiled from TS.
  transpilePackages: ['@samudra/shared'],

  // Auth state is read from cookies on almost every admin route, which fights
  // with Cache Components (each dynamic read then needs its own Suspense
  // boundary). Turn both of these on together once the data layer settles:
  //   cacheComponents: true, partialPrefetching: true
  // https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents
  cacheComponents: false,

  // Keep the floating Next.js badge off the page, including local production
  // runs, so what we look at is what a visitor sees.
  devIndicators: false,

  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },

  images: {
    remotePatterns: [
      // Supabase Storage public buckets.
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
};

export default nextConfig;
