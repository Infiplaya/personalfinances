import { getCurrentProfile, getUserProfiles } from '@/db/queries/auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { getCurrencies, getCurrentCurrency } from '@/db/queries/currencies';
import { ProfileSwitcher } from '../profile/profile-switcher';
import { ThemeSwitcher } from './theme-switcher';
import MobileNavbar from './mobile-navbar';
import Link from 'next/link';
import { CurrencyDropdown } from './currency-dropdown';
import { ProfileDropdown } from '../profile/profile-dropdown';
import { Home } from 'lucide-react';
import { CommandMenu } from './command-menu';

export default async function UserOptions() {
  const session = await getServerSession(authOptions);
  const currenciesData = await getCurrencies();
  const currentCurrency = await getCurrentCurrency();
  const userProfiles = await getUserProfiles();
  const currentProfile = await getCurrentProfile();

  return (
    <>
      <div className="ml-auto hidden items-center space-x-8 lg:inline-flex">
        <CommandMenu />
        <ProfileSwitcher
          profiles={userProfiles}
          currentProfile={currentProfile}
          currencies={currenciesData}
          currentCurrency={currentCurrency}
        />
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
          <Home className="h-5 w-5 dark:text-gray-300" />
        </Link>
        <ProfileSwitcher
          profiles={userProfiles}
          currentProfile={currentProfile}
          currencies={currenciesData}
          currentCurrency={currentCurrency}
        />

        <MobileNavbar>
          <CurrencyDropdown
            currencies={currenciesData}
            currentCurrency={currentCurrency}
          />
        </MobileNavbar>
      </div>
    </>
  );
}
