import { Skeleton } from '@/components/ui/skeleton';

export default function TableSkeleton() {
  return (
    <div>
      <div className="mt-12 px-3 space-y-6">
        <Skeleton className="h-8 lg:w-[1250px]" />
        <Skeleton className="h-8 lg:w-[1250px]" />
        <Skeleton className="h-8 lg:w-[1250px]" />
        <Skeleton className="h-8 lg:w-[1250px]" />
        <Skeleton className="h-8 lg:w-[1250px]" />
        <Skeleton className="h-8 lg:w-[1250px]" />
      </div>
    </div>
  );
}
