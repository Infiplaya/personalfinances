'use client';

import * as React from 'react';
import { CreditCard, Dot, Settings, User } from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { links } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useIsMobile';

const settingsLinks = [
  {
    href: '/settings',
    label: 'Settings',
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
  {
    href: '/settings/profiles',
    label: 'Profiles Settings',
    icon: <User className="mr-2 h-4 w-4" />,
  },
];

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const isMobile = useIsMobile();

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Search anything...
        <kbd className="pointer-events-none ml-3 inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium text-gray-800 opacity-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." autoFocus />
        <CommandList className={isMobile ? 'max-h-full' : ''}>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {links.map((link) => (
              <CommandItem
                key={link.href}
                onSelect={() => {
                  runCommand(() => router.push(link.href));
                }}
              >
                <Dot className="mr-1 h-4 w-4" />
                <span>{link.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            {settingsLinks.map((link) => (
              <CommandItem
                key={link.href}
                onSelect={() => {
                  runCommand(() => router.push(link.href));
                }}
              >
                {link.icon}
                <span>{link.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
