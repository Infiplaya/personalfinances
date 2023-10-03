import Link from 'next/link';
import React from 'react';
import { ThemeSwitcher } from './theme-switcher';
import MobileNavbar from './mobile-navbar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { CurrencyDropdown } from './currency-dropdown';
import { getCurrencies, getCurrentCurrency } from '@/db/queries/currencies';
import { ProfileSwitcher } from './dashboard/profile-switcher';
import { getCurrentProfile, getUserProfiles } from '@/db/queries/auth';
import { ProfileDropdown } from './dashboard/profile-dropdown';
import { NewProfileModal } from './dashboard/new-profile-modal';
import { Button } from './ui/button';
import { Home } from 'lucide-react';

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const currenciesData = await getCurrencies();
  const currentCurrency = await getCurrentCurrency();
  const userProfiles = await getUserProfiles();
  const currentProfile = await getCurrentProfile();

  return (
    <nav className="sticky top-0 inline-flex w-full items-center justify-end border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-950 lg:px-16">
      <div className="ml-auto hidden items-center space-x-8 lg:inline-flex">
        <ProfileSwitcher
          profiles={userProfiles}
          currentProfile={currentProfile}
        >
          <NewProfileModal />
        </ProfileSwitcher>
        {session?.user ? null : (
          <div className="inline-flex items-center space-x-4 text-xs">
            <Link href="/signin">Sign In</Link>{' '}
            <Link href="/signup">Register</Link>
          </div>
        )}
        <CurrencyDropdown
          currencies={currenciesData}
          currentCurrency={currentCurrency}
        />
        <ThemeSwitcher />
        <ProfileDropdown
          userImg={session?.user.image}
          username={session?.user.name}
        />
      </div>
      <div className="mr-auto flex w-full justify-between lg:hidden">
        <Link href="/">
          <Button size="icon" variant="outline">
            <Home className="h-5 w-5 dark:text-gray-300" />
          </Button>
        </Link>
        <ProfileSwitcher
          profiles={userProfiles}
          currentProfile={currentProfile}
        >
          <NewProfileModal />
        </ProfileSwitcher>
        <MobileNavbar>
          <CurrencyDropdown
            currencies={currenciesData}
            currentCurrency={currentCurrency}
          />
        </MobileNavbar>
      </div>
    </nav>
  );
}
