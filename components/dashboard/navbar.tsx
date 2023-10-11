import React, { Suspense } from 'react';

import { CommandMenu } from './command-menu';
import UserOptions from './user-options';
export function Navbar() {
  return (
    <nav className="sticky top-0 inline-flex w-full items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-950 md:px-16 md:pl-72">
      <Suspense fallback={'Loading...'}>
        <UserOptions />
      </Suspense>
    </nav>
  );
}
