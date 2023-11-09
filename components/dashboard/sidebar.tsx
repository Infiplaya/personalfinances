import { links } from '@/lib/utils';
import { SidebarBottomPanel } from './sidebar-bottom-panel';
import { SidebarLink } from './sidebar-link';

export function Sidebar() {
  return (
    <aside
      className="-tranneutral-x-full sm:tranneutral-x-0 fixed left-0 top-4 hidden h-screen w-64 transition-transform lg:block"
      aria-label="Sidebar"
    >
      <nav className="flex h-full flex-col justify-between overflow-y-auto border-r border-r-neutral-100 bg-white px-4 py-4 dark:border-r-neutral-800 dark:bg-neutral-950">
        <ul className="space-y-4 py-16">
          {links.map((link) => (
            <li key={link.href}>
              <SidebarLink link={link} />
            </li>
          ))}
        </ul>
        <SidebarBottomPanel />
      </nav>
    </aside>
  );
}
