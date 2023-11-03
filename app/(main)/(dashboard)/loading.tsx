import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function DashboardLoading() {
  return (
    <main className="space-y-12">
      <div className="grid-cols-12 md:gap-x-4 space-y-10 md:grid md:space-y-0">
        <div className="md:col-span-4">
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="md:col-span-4">
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="md:col-span-4">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
      <div className="grid gap-x-4 md:grid-cols-6">
        <div className="md:col-span-4">
          <Skeleton className="h-72 w-full" />
        </div>
        <div className="mt-12 md:col-span-2 md:mt-0">
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
      <Skeleton className="h-72 w-full" />
    </main>
  );
}
