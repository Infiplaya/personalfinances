import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="space-y-10">
      <div className="grid-cols-8 gap-x-10 space-y-10 lg:grid lg:space-x-10 lg:space-y-0">
        <Skeleton className="h-64 w-full lg:col-span-2" />

        <Skeleton className="h-64 w-full lg:col-span-2" />

        <Skeleton className="h-64 w-full lg:col-span-4" />
      </div>
      <div className="grid gap-x-10 lg:grid-cols-2">
        <div className="col-span-1">
          <Skeleton className="h-[350px] w-[600px]" />
        </div>
        <div className="col-span-1">
          <Skeleton className="h-[350px] w-[600px]" />
        </div>
      </div>
    </main>
  );
}
