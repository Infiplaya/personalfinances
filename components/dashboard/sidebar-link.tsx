'use client';

import { cn, NavLink } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SidebarLink({ link }: { link: NavLink }) {
  const path = usePathname();
  return (
    <Link
      href={link.href}
      className={cn(
        'block w-full rounded-md px-3 py-2 pl-6 text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900',
        path === link.href
          ? 'bg-violet-600 text-neutral-50 hover:bg-violet-600 dark:hover:bg-violet-600'
          : null
      )}
    >
      {link.label}
    </Link>
  );
}
