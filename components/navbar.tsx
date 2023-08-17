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
    <nav className="inline-flex border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-black items-center py-4 px-10 justify-between w-full">
      <ul className="inline-flex space-x-4">
        <li>
          <Link href="/transactions">Transactions</Link>
        </li>
        <li>
          <Link href="/">Home</Link>
        </li>
      </ul>

      <div className="inline-flex space-x-4">
        {status === "authenticated" ? <SignOut /> : <SignIn />}
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
