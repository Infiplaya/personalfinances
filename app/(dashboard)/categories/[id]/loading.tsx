import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="space-y-10 py-10">
      <Skeleton className='w-full h-64' />
    </main>
  );
}
