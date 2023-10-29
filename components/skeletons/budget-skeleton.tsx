import { Skeleton } from '../ui/skeleton';

export function BudgetSkeleton() {
  const skeletonElements = Array.from({ length: 4 }, (_, index) => (
    <Skeleton key={index} className="col-span-1 h-[500px] w-full" />
  ));
  return <div className="grid grid-cols-4 gap-10">{skeletonElements}</div>;
}
