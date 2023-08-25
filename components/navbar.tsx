import Link from 'next/link';
import React from 'react';
import { SignIn } from './auth/sign-in';
import { SignOut } from './auth/sign-out';
import { ThemeSwitcher } from './theme-switcher';
import MobileNavbar from './mobile-navbar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  return (
    <nav className="sticky top-0 inline-flex w-full items-center justify-end border-b border-gray-200 bg-white px-10 py-4 dark:border-gray-800 dark:bg-black">
      <div className="inline-flex space-x-8">
        {session?.user ? (
          <SignOut />
        ) : (
          <div className="inline-flex items-center space-x-4">
            <Link href="/signin">Sign In</Link> <Link href="/signup">Register</Link>
          </div>
        )}
        <ThemeSwitcher />
        <MobileNavbar />
      </div>
    </nav>
  );
}
