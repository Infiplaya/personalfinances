import TableSkeleton from '@/components/skeletons/table-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="justify-between space-y-3 md:flex">
        <Skeleton className="h-8 md:w-24" />
        <Skeleton className="h-8 md:w-24" />
      </div>
      <TableSkeleton />
    </div>
  );
}
