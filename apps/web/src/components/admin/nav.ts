import { FileClock, LayoutDashboard, Settings, Users, Waves } from 'lucide-react';
import type { Role } from '@samudra/shared';

export interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  /** Lowest role allowed to see this item. */
  minRole: Role;
  description?: string;
}

export const adminNav: NavItem[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    minRole: 'editor',
    description: 'Overview of the site',
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users,
    minRole: 'admin',
    description: 'Accounts, roles and access',
  },
  {
    href: '/admin/audit',
    label: 'Audit log',
    icon: FileClock,
    minRole: 'admin',
    description: 'Who changed what, and when',
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
    minRole: 'superadmin',
    description: 'Site-wide configuration',
  },
];

export const brandIcon = Waves;
