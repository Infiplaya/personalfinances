import React, { Suspense } from 'react';
import { Skeleton } from '../ui/skeleton';

import { CommandMenu } from './command-menu';
import UserOptions from './user-options';
export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950">
      <Suspense fallback={<Skeleton className="h-12 w-full" />}>
        <UserOptions />
      </Suspense>
    </nav>
  );
}
