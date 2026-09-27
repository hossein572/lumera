"use client";

import { cn } from "@/lib/cn";
import { faNum } from "@/lib/fa";
import { IconCheck } from "@/components/icons";

export function StepIndicator({
  steps,
  current,
  maxReached,
  onJump,
  className,
  compact,
}: {
  steps: string[];
  current: number;
  maxReached: number;
  onJump?: (i: number) => void;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex items-center gap-1.5">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          const reachable = i <= maxReached;
          return (
            <div key={label} className="flex min-w-0 flex-1 flex-col gap-1.5">
              <button
                type="button"
                disabled={!reachable || !onJump}
                onClick={() => onJump?.(i)}
                aria-current={active ? "step" : undefined}
                aria-label={`گام ${faNum(i + 1)}: ${label}`}
                className={cn(
                  "relative h-[3px] w-full overflow-hidden rounded-full bg-line transition-colors duration-300",
                  done && "bg-mint/70",
                  active && "bg-accent",
                  reachable && onJump && "cursor-pointer hover:bg-surface-3",
                )}
              />
              {compact ? null : (
                <span
                  className={cn(
                    "hidden truncate text-[11.5px] font-semibold transition-colors duration-200 sm:block",
                    active ? "text-ink" : done ? "text-mint" : "text-faint",
                  )}
                >
                  <span className="tabular-nums">{faNum(i + 1)}</span>
                  <span className="mx-1 text-faint">·</span>
                  {label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-3 sm:hidden">
        <span className="flex items-center gap-2 text-[12.5px] font-bold">
          <span
            className={cn(
              "grid h-5 w-5 place-items-center rounded-full text-[10px]",
              current === steps.length - 1
                ? "bg-mint text-[#04231d]"
                : "bg-accent text-[#180b26]",
            )}
          >
            {current === steps.length - 1 ? (
              <IconCheck size={11} strokeWidth={3} />
            ) : (
              faNum(current + 1)
            )}
          </span>
          {steps[current]}
        </span>
        <span className="text-[11.5px] text-faint tabular-nums">
          {faNum(current + 1)} از {faNum(steps.length)}
        </span>
      </div>
    </div>
  );
}
