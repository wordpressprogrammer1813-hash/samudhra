import type { ReactNode } from 'react';
import { ROLE_LABELS, type Role } from '@samudra/shared';
import { cn } from '@/lib/utils';

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
  className?: string;
}) {
  const tones = {
    neutral: 'bg-muted text-muted-foreground',
    brand: 'bg-zest-20 text-korma dark:text-zest',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/15 text-warning',
    danger: 'bg-destructive/10 text-destructive',
  } as const;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function RoleBadge({ role }: { role: Role }) {
  const tone = role === 'superadmin' ? 'brand' : role === 'admin' ? 'success' : 'neutral';
  return <Badge tone={tone}>{ROLE_LABELS[role]}</Badge>;
}

export function StatusBadge({ status }: { status: 'active' | 'invited' | 'suspended' }) {
  const tone = status === 'active' ? 'success' : status === 'invited' ? 'warning' : 'danger';
  return <Badge tone={tone}>{status}</Badge>;
}
