'use client';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import React, { ReactNode, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { cn, links } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, Settings } from 'lucide-react';
import { ThemeSwitcher } from './theme-switcher';
import { Button } from '../ui/button';

export default function MobileNavbar({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const router = useRouter();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="lg:hidden">
        <HamburgerMenuIcon className="h-5 w-5 dark:text-gray-300" />
      </SheetTrigger>
      <SheetContent className="w-full lg:hidden" side="right">
        <SheetHeader>
          <SheetTitle className="flex text-left">
            <Link
              onClick={() => {
                router.push('/');
                setOpen(false);
              }}
              href="/"
            >
              <Home className="h-5 w-5 dark:text-gray-300" />
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col justify-between">
          <ScrollArea className="h-[400px] w-full py-6">
            {links.map((link) => (
              <Link
                key={link.href}
                onClick={() => {
                  router.push(link.href.toString());
                  setOpen(false);
                }}
                className={cn(
                  'mt-4 block w-full rounded-lg py-2 pl-8 text-left text-sm font-semibold text-gray-900 dark:text-gray-100',
                  path === link.href && 'bg-indigo-500/75 dark:bg-indigo-500/75'
                )}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </ScrollArea>
          <div className="ml-auto flex items-center space-x-3 pb-20">
            {children}
            <ThemeSwitcher />
            <Link
              href="/settings"
              onClick={() => {
                router.push('/settings');
                setOpen(false);
              }}
            >
              <Button size="icon" variant="outline">
                <Settings className="h-5 w-5 dark:text-gray-300" />
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}