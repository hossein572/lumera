import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button, LinkButton } from "./Button";

interface EmptyStateProps {
  title: string;
  body?: ReactNode;
  icon?: ReactNode;
  /** مونوگرام یا آیکن تزئینی برای حالت‌های خالی (به‌جای تصویر کلیشه‌ای) */
  glyph?: ReactNode;
  tint?: "violet" | "mint" | "rose" | "amber";
  action?: { label: string; onClick?: () => void; href?: string };
  secondary?: { label: string; onClick?: () => void; href?: string };
  className?: string;
  /** نکته‌ی کمکی زیر اکشن‌ها */
  note?: ReactNode;
  compact?: boolean;
}

const tintMap = {
  violet: {
    fg: "#C96CFF",
    border: "rgba(201,108,255,0.35)",
    bg: "rgba(201,108,255,0.08)",
  },
  mint: {
    fg: "#6EF2D0",
    border: "rgba(110,242,208,0.3)",
    bg: "rgba(110,242,208,0.06)",
  },
  rose: {
    fg: "#FF7A9E",
    border: "rgba(255,122,158,0.3)",
    bg: "rgba(255,122,158,0.06)",
  },
  amber: {
    fg: "#F2C46E",
    border: "rgba(242,196,110,0.3)",
    bg: "rgba(242,196,110,0.06)",
  },
} as const;

export function EmptyState({
  title,
  body,
  icon,
  glyph,
  tint = "violet",
  action,
  secondary,
  className,
  note,
  compact,
}: EmptyStateProps) {
  const tone = tintMap[tint];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-line bg-surface",
        compact ? "px-4 py-6" : "px-5 py-9 sm:px-8 sm:py-11",
        className,
      )}
    >
      {/* قاب تصویری محدود: یک قطعه‌ی نور و یک خط مورب — بدون شلوغی */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 -end-16 h-52 w-52 rounded-full"
        style={{
          background: `radial-gradient(closest-side, ${tone.bg}, transparent)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background: `linear-gradient(to left, transparent, ${tone.border}, transparent)`,
        }}
      />
      <div className="relative mx-auto max-w-[420px] text-center">
        <span
          className="mx-auto grid h-14 w-14 place-items-center rounded-md border font-bold"
          style={{
            borderColor: tone.border,
            color: tone.fg,
            background: tone.bg,
            fontSize: 18,
          }}
        >
          {icon ?? glyph}
        </span>
        <h3 className="mt-4 text-[17px] font-bold leading-snug">{title}</h3>
        {body ? (
          <div className="mx-auto mt-2 max-w-[380px] text-[13.5px] leading-relaxed text-muted">
            {body}
          </div>
        ) : null}
        {action || secondary ? (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            {action ? (
              action.href ? (
                <LinkButton href={action.href} size="md">
                  {action.label}
                </LinkButton>
              ) : (
                <Button size="md" onClick={action.onClick}>
                  {action.label}
                </Button>
              )
            ) : null}
            {secondary ? (
              secondary.href ? (
                <LinkButton href={secondary.href} size="md" variant="outline">
                  {secondary.label}
                </LinkButton>
              ) : (
                <Button size="md" variant="outline" onClick={secondary.onClick}>
                  {secondary.label}
                </Button>
              )
            ) : null}
          </div>
        ) : null}
        {note ? (
          <p className="mt-4 text-[12.5px] leading-relaxed text-faint">
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}
