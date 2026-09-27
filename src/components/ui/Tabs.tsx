"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TabItem<T extends string> {
  value: T;
  label: ReactNode;
  count?: number;
  icon?: ReactNode;
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  className,
  variant = "underline",
  ariaLabel,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  variant?: "underline" | "flat";
  ariaLabel?: string;
}) {
  const gid = useId();
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "no-scrollbar w-full min-w-0 flex gap-1 overflow-x-auto px-4 sm:px-0",
        variant === "underline" ? "border-b border-line" : "",
        className,
      )}
    >
      {items.map((it, i) => {
        const on = it.value === value;
        return (
          <button
            key={it.value}
            role="tab"
            id={`${gid}-tab-${i}`}
            aria-selected={on}
            type="button"
            onClick={() => onChange(it.value)}
            className={cn(
              "group relative flex shrink-0 items-center gap-2 text-[14px] font-semibold transition-colors duration-150",
              variant === "underline"
                ? "px-1 pb-3 pt-2.5"
                : "h-9 rounded-md px-3",
              on ? "text-ink" : "text-muted hover:text-ink",
              variant === "flat" && on && "bg-surface-2",
            )}
          >
            {it.icon ? (
              <span className={cn(on ? "text-accent" : "text-faint")}>
                {it.icon}
              </span>
            ) : null}
            {it.label}
            {typeof it.count === "number" ? (
              <span
                className={cn(
                  "text-[11.5px] tabular-nums transition-colors",
                  on ? "text-accent" : "text-faint group-hover:text-muted",
                )}
              >
                {it.count}
              </span>
            ) : null}
            {variant === "underline" ? (
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-accent transition-transform duration-250 ease-out",
                  on ? "scale-x-100" : "scale-x-0",
                )}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/** پنل تب با ورود کوتاه */
export function TabPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "motion-safe:animate-[fade_0.28s_ease-out_both]",
        className,
      )}
    >
      {children}
    </div>
  );
}
