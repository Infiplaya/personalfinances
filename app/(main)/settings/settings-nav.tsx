'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const settingsLinks = [
  {
    link: '',
    label: 'Profile',
  },
  {
    link: '/profiles',
    label: 'Other Profiles',
  },
];

export function SettingsNav() {
  const path = usePathname();
  return (
    <nav className="w-full space-x-7 border-b py-1 dark:border-gray-800">
      {settingsLinks.map((link) => (
        <Link
          key={link.link}
          href={`/settings/${link.link}`}
          className={cn(
            'py-[6px] text-sm font-semibold hover:border-b-2 hover:border-indigo-500',
            path === '/settings' + link.link
              ? 'border-b-2 border-indigo-500'
              : null
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
