import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main >
      <div className="grid space-y-10 lg:grid-cols-2 lg:space-x-10 lg:space-y-0">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </main>
  );
}
