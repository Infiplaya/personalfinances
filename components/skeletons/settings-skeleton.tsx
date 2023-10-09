import React from 'react';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';

export default function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-full" />
      </div>
      <Separator />
      <div className="max-w-lg">
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}
