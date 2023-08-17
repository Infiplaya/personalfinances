"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { SignIn } from "./auth/sign-in";
import { SignOut } from "./auth/sign-out";
import { ThemeSwitcher } from "./theme-switcher";

export default function Navbar() {
  const { status } = useSession();
  return (
    <nav className="inline-flex border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-black items-center py-4 px-10 justify-end w-full">
      <div className="inline-flex space-x-8">
        {status === "authenticated" ? (
          <SignOut />
        ) : (
          <div className="inline-flex space-x-4 items-center">
            <SignIn /> <Link href="/signup">Register</Link>
          </div>
        )}
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
