'use client';

import { cn, NavLink } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SidebarLink({ link }: { link: NavLink }) {
  const path = usePathname();
  console.log(path);
  return (
    <Link
      href={link.href}
      className={cn(
        'block w-full rounded-md px-3 py-2 pl-6 text-sm hover:bg-gray-100 dark:hover:bg-white/10',
        path === link.href ? 'bg-indigo-500/50' : null
      )}
    >
      {link.label}
    </Link>
  );
}