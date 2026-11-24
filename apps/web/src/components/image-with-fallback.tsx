'use client';

import { useState } from 'react';

export function ImageWithFallback({
  src,
  alt,
  className,
  loading,
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}) {
  const [broken, setBroken] = useState(!src);

  if (broken) {
    return (
      <div className={`grid place-items-center bg-heath/10 ${className ?? ''}`} aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="size-[28%] text-heath/25"
        >
          <rect x="3" y="4" width="18" height="16" rx="1.5" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="m4 17 5-5 3 3 4-4 4 4" />
        </svg>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary external/storage URL with a fallback placeholder
    <img src={src} alt={alt} loading={loading} className={className} onError={() => setBroken(true)} />
  );
}
