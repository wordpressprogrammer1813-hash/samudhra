import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The shared workspace package ships ES modules compiled from TypeScript.
  transpilePackages: ['@samudra/shared'],

  // Cache Components changes how dynamic data has to be written (each read
  // needs its own Suspense boundary). Leave it off until the data layer is
  // settled, then turn it on together with partialPrefetching.
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
};

export default nextConfig;
