'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminNav({ items }: { items: { label: string; href: string }[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col px-3 sm:flex-col" aria-label="Admin sections">
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-[3px] px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
              active ? 'bg-serenade/12 text-zest' : 'text-serenade/80 hover:text-serenade'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
