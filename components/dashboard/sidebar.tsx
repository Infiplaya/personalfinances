import { links } from '@/lib/utils';
import { SidebarLink } from './sidebar-link';

export function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-4 hidden h-screen w-64 -translate-x-full transition-transform sm:translate-x-0 lg:block"
      aria-label="Sidebar"
    >
      <nav className="h-full overflow-y-auto border-r border-r-gray-100 bg-white px-4 py-4 dark:border-r-gray-800 dark:bg-gray-950">
        <ul className="space-y-4 py-16">
          {links.map((link) => (
            <li key={link.href}>
              <SidebarLink link={link} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
