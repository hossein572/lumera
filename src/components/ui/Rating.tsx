import { cn } from "@/lib/cn";
import { faDec, faNum } from "@/lib/fa";
import { IconStar } from "@/components/icons";

const sizes = { sm: 12, md: 14, lg: 17 } as const;

export function Rating({
  value,
  count,
  visits,
  size = "md",
  className,
  tone = "amber",
  showValue = true,
}: {
  value: number;
  count?: number;
  visits?: number;
  size?: keyof typeof sizes;
  className?: string;
  tone?: "amber" | "mint" | "ink";
  showValue?: boolean;
}) {
  const px = sizes[size];
  const color =
    tone === "mint" ? "text-mint" : tone === "ink" ? "text-ink" : "text-amber";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap",
        className,
      )}
    >
      <span
        className={cn("inline-flex items-center gap-[1px]", color)}
        aria-hidden
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const f = value - i;
          return (
            <IconStar
              key={i}
              size={px}
              fill={f >= 0.75 ? "full" : f >= 0.25 ? "half" : "none"}
              className={f >= 0.25 ? "" : "opacity-35"}
            />
          );
        })}
      </span>
      {showValue ? (
        <span
          className={cn(
            "font-bold tabular-nums",
            size === "lg" ? "text-[14px]" : "text-[12.5px]",
          )}
        >
          {faDec(value)}
        </span>
      ) : null}
      {typeof count === "number" ? (
        <span
          className={cn(
            "text-faint tabular-nums",
            size === "lg" ? "text-[12.5px]" : "text-[11.5px]",
          )}
        >
          ({faNum(count)} نظر)
        </span>
      ) : null}
      {typeof visits === "number" ? (
        <span className="text-[11.5px] text-faint">
          · {faNum(visits)} مراجعه
        </span>
      ) : null}
      <span className="sr-only">{`امتیاز ${faDec(value)} از ۵`}</span>
    </span>
  );
}

export function RatingBars({
  buckets,
  total,
  average,
}: {
  buckets: { stars: number; count: number; pct: number }[];
  total: number;
  average: number;
}) {
  return (
    <div className="space-y-2">
      {buckets.map((b) => (
        <div key={b.stars} className="flex items-center gap-2.5">
          <span className="flex w-9 items-center gap-1 text-[12px] font-semibold tabular-nums text-muted">
            {faNum(b.stars)}
            <IconStar size={11} className="text-amber" />
          </span>
          <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
            <span
              className="absolute inset-y-0 start-0 rounded-full bg-amber/75 transition-[width] duration-500"
              style={{ width: `${b.pct}%` }}
            />
          </span>
          <span className="w-11 shrink-0 text-end text-[11.5px] tabular-nums text-faint">
            {faNum(b.count)}
          </span>
        </div>
      ))}
      <p className="pt-1 text-[12px] text-faint">
        بر پایه‌ی {faNum(total)} نظر تأییدشده · میانگین {faDec(average)}
      </p>
    </div>
  );
}
