import { FileText, Settings, UserCog, Waves } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: typeof FileText;
  description?: string;
}

/**
 * The whole panel. It exists for one person — the client editing their own
 * site — so there is no user management and no role switching here.
 */
export const adminNav: NavItem[] = [
  {
    href: '/admin',
    label: 'Pages',
    icon: FileText,
    description: 'Edit the content of each page',
  },
  {
    href: '/admin/settings',
    label: 'Site settings',
    icon: Settings,
    description: 'Name, contact details, maintenance mode',
  },
  {
    href: '/admin/account',
    label: 'Account',
    icon: UserCog,
    description: 'Your own details',
  },
];

export const brandIcon = Waves;
