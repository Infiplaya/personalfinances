import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function Loading() {
  return (
    <div>
      <Skeleton className="mt-8 h-24 w-64" />
      <Skeleton className="mt-3 h-4 w-36" />
      <Skeleton className="mt-12 h-24 w-full" />
    </div>
  );
}
