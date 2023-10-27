import { Skeleton } from '../ui/skeleton';

export default function CardsSkeleton() {
  return (
    <div className="grid-cols-12 space-x-4 space-y-10 lg:grid lg:space-y-0">
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
  );
}
