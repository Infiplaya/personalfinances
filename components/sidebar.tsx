import { links } from '@/lib/utils';
import Link from 'next/link';

export function Sidebar() {
  return (
    <aside
      id="default-sidebar"
      className="fixed left-0 z-40 hidden h-screen w-64 -translate-x-full transition-transform sm:translate-x-0 lg:block"
      aria-label="Sidebar"
    >
      <div className="h-full overflow-y-auto bg-white px-4 py-4 dark:bg-black">
        <ul className="space-y-4 py-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block w-full rounded-md px-3 py-1 pl-6 hover:bg-gray-100 dark:hover:bg-white/10"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
