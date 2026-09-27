import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "block rounded-xs bg-[linear-gradient(100deg,rgba(255,255,255,0.025),rgba(255,255,255,0.075)_48%,rgba(255,255,255,0.025))] bg-[length:220%_100%] motion-safe:animate-[shimmer_1.6s_linear_infinite]",
        className,
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-line bg-surface p-3.5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3.5 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
      <Skeleton className="mt-4 h-24 w-full rounded-md" />
      <div className="mt-3 flex items-center justify-between gap-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
      <span className="sr-only">در حال بارگذاری</span>
    </div>
  );
}
