import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-10">
      <div className="w-full my-6 flex justify-end">
        <Skeleton className="w-24 h-10 rounded-md" />
      </div>
      <div className="mt-12 space-y-6">
        <Skeleton className="w-[1400px] h-8" />
        <Skeleton className="w-[1400px] h-8" />
        <Skeleton className="w-[1400px] h-8" />
        <Skeleton className="w-[1400px] h-8" />
        <Skeleton className="w-[1400px] h-8" />
        <Skeleton className="w-[1400px] h-8" />
      </div>
    </div>
  );
}
