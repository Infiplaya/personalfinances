import { getCurrentProfile, getUserProfiles } from '@/db/queries/auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { ProfileSwitcher } from '../profile/profile-switcher';
import { ThemeSwitcher } from './theme-switcher';
import { MobileNavbar } from './mobile-navbar';
import Link from 'next/link';
import { CurrencyDropdown } from './currency-dropdown';
import { ProfileDropdown } from '../profile/profile-dropdown';
import { Home } from 'lucide-react';
import { CommandMenu } from './command-menu';
import { TransactionModal } from '../transactions/transaction-modal';
import { getTransactionFormData } from '@/db/queries/transactions';

export async function UserOptions() {
  const session = await getServerSession(authOptions);
  const userProfiles = await getUserProfiles();
  const currentProfile = await getCurrentProfile();
  const { currencies, currentCurrency, categories } =
    await getTransactionFormData();

  return (
    <>
      <div className="ml-auto hidden w-full items-center justify-between space-x-8 lg:inline-flex">
        <div>
          <ProfileSwitcher
            profiles={userProfiles}
            currentProfile={currentProfile}
            currencies={currencies}
            currentCurrency={currentCurrency}
          />
        </div>
        <div>
          <CommandMenu />
        </div>
        <div className="lg:flex lg:items-center lg:space-x-8">
          <TransactionModal
            categories={categories}
            currencies={currencies}
            currentCurrency={currentCurrency}
          />
          <CurrencyDropdown />
          <ThemeSwitcher />
          <ProfileDropdown
            userImg={session?.user.image}
            username={session?.user.name}
          />
        </div>
      </div>
      <div className="mr-auto flex w-full items-center justify-between lg:hidden">
        <Link href="/" className="block">
          <Home className="h-5 w-5 dark:text-neutral-300" />
        </Link>
        <CommandMenu />
        <MobileNavbar
          currencies={currencies}
          currentCurrency={currentCurrency}
          currentProfile={currentProfile}
          profiles={userProfiles}
        />
      </div>
    </>
  );
}
