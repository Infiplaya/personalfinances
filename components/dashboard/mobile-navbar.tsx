'use client';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { cn, links } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { Home, LogOut, Settings, X } from 'lucide-react';
import { ThemeSwitcher } from './theme-switcher';
import { Button } from '../ui/button';
import { ProfileSwitcher } from '../profile/profile-switcher';
import { Currency } from '@/db/schema/finances';
import { Profile } from '@/db/queries/auth';
import { CurrencyDropdown } from './currency-dropdown';
import { signOut } from 'next-auth/react';

export function MobileNavbar({
  currencies,
  currentCurrency,
  profiles,
  currentProfile,
}: {
  currencies: Currency[];
  currentCurrency: Currency['code'];
  profiles: Profile[];
  currentProfile: Profile;
}) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const router = useRouter();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="lg:hidden">
        <HamburgerMenuIcon className="h-5 w-5 dark:text-neutral-300" />
      </SheetTrigger>
      <SheetContent className="w-full lg:hidden" side="right">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <Link
              onClick={() => {
                router.push('/');
                setOpen(false);
              }}
              href="/"
            >
              <Home className="h-5 w-5 dark:text-neutral-300" />
            </Link>
            <ProfileSwitcher
              profiles={profiles}
              currentProfile={currentProfile}
              currentCurrency={currentCurrency}
              currencies={currencies}
            />
            <SheetClose>
              <X />
            </SheetClose>
          </SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col justify-between">
          <div className="mt-8">
            {links.map((link) => (
              <Link
                key={link.href}
                onClick={() => {
                  router.push(link.href.toString());
                  setOpen(false);
                }}
                className={cn(
                  'mt-4 block w-full rounded-lg py-2 pl-8 text-left text-sm font-semibold text-neutral-900 dark:text-neutral-100',
                  path === link.href &&
                    'bg-violet-500 text-gray-50 dark:bg-violet-500'
                )}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="ml-auto flex items-center space-x-3 pb-20">
            <CurrencyDropdown />
            <ThemeSwitcher />
            <Link
              href="/settings"
              onClick={() => {
                router.push('/settings');
                setOpen(false);
              }}
            >
              <Button size="icon" variant="outline">
                <Settings className="h-5 w-5 dark:text-neutral-300" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                signOut({ callbackUrl: '/?signedOut=true' });
              }}
            >
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
