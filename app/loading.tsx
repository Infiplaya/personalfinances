import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container mx-auto w-full space-y-10 py-10">
      <div className="lg:grid grid-cols-8 gap-x-10">
        <div className="lg:col-span-2">
          <Skeleton  className="w-[300px] h-[350px]"/>
        </div>
        <div className="lg:col-span-2">
          <Skeleton  className="w-[300px] h-[350px]"/>
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="w-[600px] h-[350px]" />
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-x-10">
        <div className="col-span-1">
          <Skeleton className="w-[600px] h-[350px]" />
        </div>
        <div className="col-span-1">
          <Skeleton className="w-[600px] h-[350px]" />
        </div>
      </div>
    </main>
  );
}
