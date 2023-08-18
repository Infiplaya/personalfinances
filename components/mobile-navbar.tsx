'use client';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { cn, links } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeSwitcher } from './theme-switcher';

export default function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const router = useRouter();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <HamburgerMenuIcon className="h-5 w-5 lg:hidden" />
      </SheetTrigger>
      <SheetContent className="w-full lg:hidden" side="right">
        <SheetHeader>
          <div className="flex items-center justify-between px-12">
            <SheetTitle className="text-left">
              <Link
                onClick={() => {
                  router.push('/');
                  setOpen(false);
                }}
                href="/"
              >
                Home
              </Link>
            </SheetTitle>
            <ThemeSwitcher />
          </div>
        </SheetHeader>
        <ScrollArea className="h-screen w-full p-4">
          {links.map((link) => (
            <Link
              key={link.href}
              onClick={() => {
                router.push(link.href.toString());
                setOpen(false);
              }}
              className={cn(
                'mt-4 block w-full rounded-lg py-2 pl-8 text-left text-base font-light text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-white/10',
                path === link.href &&
                  'bg-indigo-500/25 hover:bg-indigo-500/25 dark:bg-indigo-500/50 dark:hover:bg-indigo-500/50'
              )}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
