"use client";

import { cn } from "@/lib/cn";
import { durationLabel, price } from "@/lib/fa";
import type { Service } from "@/data/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconCheck, IconClock, IconSparkle } from "@/components/icons";

export function ServiceCard({
  service,
  selected,
  disabled,
  onSelect,
  actionLabel = "انتخاب زمان",
  note,
  className,
}: {
  service: Service;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: (s: Service) => void;
  actionLabel?: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3 rounded-lg border p-3.5 transition-[border-color,background-color] duration-200 sm:flex-row sm:items-center sm:gap-5",
        selected
          ? "border-accent/55 bg-[rgba(201,108,255,0.06)]"
          : "border-line bg-surface hover:border-line-soft",
        disabled && "opacity-50",
        className,
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-[15px] font-bold leading-snug">
            {service.name}
          </span>
          {service.popular ? (
            <Badge tone="violet" leading={<IconSparkle size={11} />}>
              پرطرفدار
            </Badge>
          ) : null}
        </span>
        <span className="mt-1.5 block text-[12.5px] leading-relaxed text-muted">
          {service.desc}
        </span>
        <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-faint">
          <span className="inline-flex items-center gap-1">
            <IconClock size={12} />
            {durationLabel(service.minutes)}
          </span>
          {service.includes?.length ? (
            <span className="inline-flex items-center gap-1">
              <IconCheck size={12} className="text-mint" />
              {service.includes.length} مورد شامل قیمت
            </span>
          ) : null}
          {note ? <span className="text-amber">{note}</span> : null}
        </span>
      </span>

      <span className="flex items-center justify-between gap-3 border-t border-line-soft pt-3 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:pt-0 sm:gap-1.5">
        <span className="text-[15px] font-extrabold tabular-nums">
          {price(service.price, false)}
          <span className="ms-1 text-[11.5px] font-medium text-faint">
            تومان
          </span>
        </span>
        {onSelect ? (
          selected ? (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-accent/45 bg-accent/12 px-2.5 py-1.5 text-[12.5px] font-bold text-accent">
              <IconCheck size={13} strokeWidth={2.6} />
              انتخاب شد
            </span>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => !disabled && onSelect(service)}
              disabled={disabled}
            >
              {actionLabel}
            </Button>
          )
        ) : null}
      </span>
    </div>
  );
}

/** گزینه‌ی خدمت داخل Bottom Sheet — هدف لمسی بزرگ‌تر */
export function ServiceOption({
  service,
  selected,
  disabled,
  onSelect,
}: {
  service: Service;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: (s: Service) => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={() => onSelect?.(service)}
      className={cn(
        "flex w-full items-center gap-3 rounded-md border px-3 py-3 text-start transition-colors duration-150",
        selected
          ? "border-accent/60 bg-[rgba(201,108,255,0.08)]"
          : "border-line bg-surface hover:bg-surface-2/70",
        disabled && "opacity-45",
      )}
    >
      <span
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors",
          selected
            ? "border-accent bg-accent text-[#180b26]"
            : "border-line-soft",
        )}
      >
        {selected ? <IconCheck size={12} strokeWidth={3} /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14.5px] font-bold">
          {service.name}
        </span>
        <span className="mt-0.5 block text-[12px] text-faint">
          {durationLabel(service.minutes)} · {price(service.price)}
        </span>
      </span>
    </button>
  );
}
