import { Skeleton } from '@/components/ui/skeleton';

export default function TableSkeleton() {
  const skeletonElements = Array.from({ length: 8 }, (_, index) => (
    <Skeleton key={index} className="h-8 w-full" />
  ));
  return (
    <div>
      <div className="mt-12 space-y-6 px-3">{skeletonElements}</div>
    </div>
  );
}
