import React, { Suspense } from 'react';
import { Skeleton } from '../ui/skeleton';

import UserOptions from './user-options';
export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-950">
      <Suspense fallback={<Skeleton className="h-14 w-[200px]" />}>
        <UserOptions />
      </Suspense>
    </nav>
  );
}
