import { Skeleton } from '@/components/ui/skeleton';

export default function MonthsLoading() {
  const skeletonElements = Array.from({ length: 4 }, (_, index) => (
    <Skeleton key={index} className="h-52 w-full" />
  ));

  return <div className="grid gap-12 md:grid-cols-2">{skeletonElements}</div>;
}
