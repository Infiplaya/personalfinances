import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function DashboardLoading() {
  return (
    <main className="space-y-12">
      <div className="grid-cols-12 gap-x-4 space-y-10 lg:grid lg:space-y-0">
        <div className="lg:col-span-4">
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
      <div className="grid gap-x-4 lg:grid-cols-6">
        <div className="lg:col-span-4">
          <Skeleton className="h-72 w-full" />
        </div>
        <div className="mt-12 lg:col-span-2 lg:mt-0">
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
      <Skeleton className="h-72 w-full" />
    </main>
  );
}
