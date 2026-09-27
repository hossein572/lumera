import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconCheck, IconInfo } from "@/components/icons";

export type Tone =
  | "neutral"
  | "violet"
  | "mint"
  | "rose"
  | "amber"
  | "danger"
  | "ink";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted border-line",
  violet:
    "bg-[rgba(201,108,255,0.13)] text-accent border-[rgba(201,108,255,0.3)]",
  mint: "bg-[rgba(110,242,208,0.11)] text-mint border-[rgba(110,242,208,0.28)]",
  rose: "bg-[rgba(255,122,158,0.11)] text-rose border-[rgba(255,122,158,0.28)]",
  amber:
    "bg-[rgba(242,196,110,0.11)] text-amber border-[rgba(242,196,110,0.28)]",
  danger:
    "bg-[rgba(255,107,116,0.11)] text-[#ff8f96] border-[rgba(255,107,116,0.3)]",
  ink: "bg-ink text-ink-950 border-transparent",
};

export function Badge({
  tone = "neutral",
  leading,
  className,
  children,
  ...rest
}: { tone?: Tone; leading?: ReactNode } & ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-xs border px-2 py-[3px] text-[11.5px] font-semibold leading-snug",
        tones[tone],
        className,
      )}
      {...rest}
    >
      {leading}
      {children}
    </span>
  );
}

export function VerifiedBadge({
  className,
  label = "تأیید لومرا",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <Badge
      tone="mint"
      leading={<IconCheck size={12} strokeWidth={2.4} />}
      className={className}
    >
      {label}
    </Badge>
  );
}

export function InfoNote({
  children,
  tone = "neutral",
  icon,
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "violet" | "amber" | "mint" | "danger";
  icon?: ReactNode;
  className?: string;
}) {
  const map = {
    neutral: "border-line bg-surface text-muted",
    violet:
      "border-[rgba(201,108,255,0.25)] bg-[rgba(201,108,255,0.07)] text-muted",
    amber:
      "border-[rgba(242,196,110,0.25)] bg-[rgba(242,196,110,0.06)] text-muted",
    mint: "border-[rgba(110,242,208,0.22)] bg-[rgba(110,242,208,0.05)] text-muted",
    danger:
      "border-[rgba(255,107,116,0.28)] bg-[rgba(255,107,116,0.06)] text-muted",
  } as const;
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-md border px-3 py-2.5 text-[13px] leading-relaxed",
        map[tone],
        className,
      )}
    >
      <span className="mt-[3px] shrink-0 text-faint">
        {icon ?? <IconInfo size={15} />}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function Chip({
  active,
  count,
  className,
  children,
  ...rest
}: { active?: boolean; count?: number } & ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border px-3 text-[13px] font-semibold transition-colors duration-150",
        active
          ? "border-accent/60 bg-accent/15 text-ink"
          : "border-line bg-surface text-muted hover:border-line-soft hover:bg-surface-2 hover:text-ink",
        className,
      )}
      {...rest}
    >
      {children}
      {typeof count === "number" ? (
        <span
          className={cn(
            "text-[11.5px] tabular-nums",
            active ? "text-accent" : "text-faint",
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center gap-3 rounded-md border border-line bg-surface px-3.5 py-3 text-start transition-colors hover:bg-surface-2",
        checked && "border-accent/45 bg-[rgba(201,108,255,0.07)]",
        className,
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold leading-snug text-ink">
          {label}
        </span>
        {hint ? (
          <span className="mt-0.5 block text-[12px] leading-relaxed text-faint">
            {hint}
          </span>
        ) : null}
      </span>
      <span
        className={cn(
          "relative h-[22px] w-10 shrink-0 rounded-full border transition-colors duration-200",
          checked ? "border-accent/60 bg-accent" : "border-line bg-surface-3",
        )}
      >
        <span
          className={cn(
            "absolute top-[2px] h-4 w-4 rounded-full bg-ink transition-all duration-200",
            checked ? "start-[21px] bg-[#180b26]" : "start-[2px]",
          )}
        />
      </span>
    </button>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  className,
  ariaLabel,
}: {
  options: { value: T; label: ReactNode; count?: number }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex min-w-0 items-center gap-1 rounded-md border border-line bg-surface p-1",
        className,
      )}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            type="button"
            aria-selected={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xs font-semibold transition-colors duration-150",
              size === "sm"
                ? "h-7 px-2.5 text-[12.5px]"
                : "h-9 px-3.5 text-[13.5px]",
              on ? "bg-surface-3 text-ink" : "text-muted hover:text-ink",
            )}
          >
            <span className="truncate">{o.label}</span>
            {typeof o.count === "number" ? (
              <span
                className={cn(
                  "text-[11px] tabular-nums",
                  on ? "text-accent" : "text-faint",
                )}
              >
                {o.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function Counter({
  value,
  onChange,
  min = 0,
  max = 9,
  suffix,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
  label?: string;
}) {
  const btn =
    "grid h-9 w-9 place-items-center rounded-xs border border-line bg-surface text-ink transition-colors hover:bg-surface-2 disabled:opacity-35";
  return (
    <div className="flex items-center justify-between gap-3">
      {label ? (
        <span className="text-[14px] font-semibold text-ink">{label}</span>
      ) : null}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={btn}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label="کم کردن"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <path d="M5 12h14" />
          </svg>
        </button>
        <span className="min-w-[3.5rem] text-center text-[14px] font-bold tabular-nums">
          {value}
          {suffix ? (
            <span className="text-[12px] font-medium text-faint">
              {" "}
              {suffix}
            </span>
          ) : null}
        </span>
        <button
          type="button"
          className={btn}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label="زیاد کردن"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );
}
