import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 pt-2 sm:px-6 lg:px-10">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 pt-6">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full max-w-[380px]" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-12 w-36 rounded-md" />
            <Skeleton className="h-12 w-40 rounded-md" />
          </div>
        </div>
        <Skeleton className="aspect-[4/5] w-full rounded-lg" />
      </div>
      <Skeleton className="mt-8 h-32 w-full rounded-lg" />
      <span className="sr-only" role="status">
        در حال بارگذاری
      </span>
    </div>
  );
}
