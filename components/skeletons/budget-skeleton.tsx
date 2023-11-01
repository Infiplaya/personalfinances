import { Skeleton } from '../ui/skeleton';

export function BudgetSkeleton() {
  const skeletonElements = Array.from({ length: 4 }, (_, index) => (
    <Skeleton key={index} className="col-span-1 h-[500px] w-full" />
  ));
  return <div className="grid gap-10 md:grid-cols-4">{skeletonElements}</div>;
}
