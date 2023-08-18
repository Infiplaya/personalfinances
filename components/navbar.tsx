'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { SignIn } from './auth/sign-in';
import { SignOut } from './auth/sign-out';
import { ThemeSwitcher } from './theme-switcher';
import MobileNavbar from './mobile-navbar';

export default function Navbar() {
  const { status } = useSession();
  return (
    <nav className="sticky top-0 inline-flex w-full items-center justify-end border-b border-gray-200 bg-white px-10 py-4 dark:border-gray-800 dark:bg-black">
      <div className="inline-flex space-x-8">
        {status === 'authenticated' ? (
          <SignOut />
        ) : (
          <div className="inline-flex items-center space-x-4">
            <SignIn /> <Link href="/signup">Register</Link>
          </div>
        )}
        <ThemeSwitcher />
        <MobileNavbar />
      </div>
    </nav>
  );
}
