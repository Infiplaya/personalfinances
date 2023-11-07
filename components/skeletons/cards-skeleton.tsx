import { Skeleton } from '../ui/skeleton';

export default function CardsSkeleton() {
  return (
    <div className="mt-6 grid-cols-12 md:space-x-4 space-y-10 md:mt-0 lg:grid lg:space-y-0">
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
