"use client";

import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { SignIn } from "./sign-in";
import { ThemeSwitcher } from "./theme-switcher";

export default function Navbar() {
  return (
    <nav className="inline-flex items-center py-4 px-10 justify-between w-full">
      <ul className="inline-flex space-x-4">
        <li>
          <Link href="/transactions">Transactions</Link>
        </li>
        <li>
          <Link href="/">Home</Link>
        </li>
      </ul>

      <div className="inline-flex space-x-4">
        <SignIn />
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
