"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
  addDays,
  faNum,
  jDateWeekday,
  jDay,
  jMonthLabel,
  monthName,
  relativeDay,
  timeLabel,
  toISO,
  weekdayName,
} from "@/lib/fa";
import { isoToJParts, jMonth, shiftMonth, type JParts } from "@/lib/jalali";
import type { Slot } from "@/data/slots";
import { dayPart } from "@/lib/fa";
import { useToday } from "@/hooks/use-today";
import { IconCalendar, IconChevron, IconClock } from "@/components/icons";

const WEEK = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

export interface DayInfo {
  free: number;
  closed?: boolean;
}

interface CalendarProps {
  value: string | null;
  onChange: (iso: string) => void;
  dayInfo?: (iso: string) => DayInfo;
  minISO?: string;
  maxISO?: string;
  className?: string;
  /** رزروهای قبلی کاربر روی روزها مشخص شود */
  markedISOs?: string[];
}

export function Calendar({
  value,
  onChange,
  dayInfo,
  minISO,
  maxISO,
  className,
  markedISOs = [],
}: CalendarProps) {
  const today = useToday();
  const initial = useMemo<JParts>(
    () => isoToJParts(value ?? minISO ?? today),
    [value, minISO, today],
  );

  const [cursor, setCursor] = useState({ jy: initial.jy, jm: initial.jm });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(true), 20);
    return () => window.clearTimeout(id);
  }, [cursor.jm, cursor.jy]);

  const month = useMemo(
    () => jMonth(cursor.jy, cursor.jm, today),
    [cursor.jy, cursor.jm, today],
  );
  const monthStart = month.firstISO;
  const monthEnd = addDays(monthStart, month.days - 1);

  const canPrev = !minISO || monthStart > minISO;
  const canNext = !maxISO || monthEnd < addDays(maxISO, 25);

  return (
    <div className={cn("select-none", className)}>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={!canNext}
          onClick={() => setCursor((c) => shiftMonth(c, 1))}
          aria-label="ماه بعد"
          className="grid h-9 w-9 place-items-center rounded-md border border-line bg-surface text-muted transition-colors hover:text-ink disabled:opacity-35"
        >
          <IconChevron dir="end" size={16} />
        </button>
        <div className="text-center">
          <p className="text-[14.5px] font-bold leading-none">
            {monthName(cursor.jm)} {faNum(cursor.jy)}
          </p>
          <p className="mt-1 text-[11px] text-faint">
            {jDay(monthStart) <= 6 ? "نیمه‌ی اول ماه" : "نیمه‌ی دوم ماه"} ·{" "}
            {faNum(month.days)} روز
          </p>
        </div>
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => setCursor((c) => shiftMonth(c, -1))}
          aria-label="ماه قبل"
          className="grid h-9 w-9 place-items-center rounded-md border border-line bg-surface text-muted transition-colors hover:text-ink disabled:opacity-35"
        >
          <IconChevron dir="start" size={16} />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {WEEK.map((w, i) => (
          <span
            key={w}
            className={cn(
              "pb-1 text-[11px] font-semibold",
              i === 6 ? "text-rose/80" : "text-faint",
            )}
          >
            {w}
          </span>
        ))}
      </div>

      <div
        className={cn(
          "grid grid-cols-7 gap-1 transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-40",
        )}
        role="grid"
      >
        {month.cells.map((cell) => {
          const inRange =
            (!minISO || cell.iso >= minISO) && (!maxISO || cell.iso <= maxISO);
          const selectable = cell.inMonth && inRange;
          const info =
            cell.inMonth && inRange ? dayInfo?.(cell.iso) : undefined;
          const selected = value === cell.iso;
          const full = info ? info.free === 0 : false;
          const marked = markedISOs.includes(cell.iso);
          return (
            <button
              key={cell.iso}
              type="button"
              role="gridcell"
              disabled={!selectable}
              aria-selected={selected}
              aria-label={`${faNum(cell.jd)} ${monthName(cursor.jm)}${info ? ` — ${faNum(info.free)} وقت آزاد` : ""}`}
              onClick={() => onChange(cell.iso)}
              className={cn(
                "relative flex aspect-square min-h-[44px] flex-col items-center justify-center rounded-md border text-[13.5px] font-semibold transition-[background-color,border-color,color,transform] duration-150",
                !cell.inMonth && "opacity-25",
                selectable
                  ? "border-transparent hover:bg-surface-2"
                  : "border-transparent opacity-40",
                selected
                  ? "border-accent/70 bg-accent text-[#180b26]"
                  : full
                    ? "text-faint"
                    : cell.isFriday
                      ? "text-rose/90"
                      : "text-ink",
                !selectable && "cursor-not-allowed",
              )}
            >
              {faNum(cell.jd)}
              {cell.isToday ? (
                <span
                  className={cn(
                    "absolute top-1.5 h-1 w-1 rounded-full",
                    selected ? "bg-[#180b26]" : "bg-mint",
                  )}
                />
              ) : null}
              {info && !selected ? (
                <span
                  className={cn(
                    "absolute bottom-1.5 h-1 w-1 rounded-full",
                    info.closed
                      ? "bg-transparent"
                      : info.free === 0
                        ? "bg-[#4a4053]"
                        : info.free > 3
                          ? "bg-mint"
                          : "bg-amber",
                  )}
                />
              ) : null}
              {marked ? (
                <span className="absolute bottom-[5px] start-[6px] h-[3px] w-[3px] rounded-full bg-accent" />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px] text-faint">
        <LegendDot className="bg-mint" label="وقت زیاد" />
        <LegendDot className="bg-amber" label="ظرفیت کم" />
        <LegendDot className="bg-[#4a4053]" label="پر شده" />
        <span className="inline-flex items-center gap-1.5">
          <span className="h-[3px] w-[3px] rounded-full bg-accent" />
          رزرو قبلی شما
        </span>
      </div>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-1.5 w-1.5 rounded-full", className)} />
      {label}
    </span>
  );
}

/** نوار انتخاب سریع روز — ۱۴ روز آینده */
export function MonthStrip({
  days,
  value,
  onChange,
  dayInfo,
  className,
}: {
  days: string[];
  value: string | null;
  onChange: (iso: string) => void;
  dayInfo?: (iso: string) => DayInfo;
  className?: string;
}) {
  const activeRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "smooth",
    });
  }, [value]);

  return (
    <div
      className={cn(
        "no-scrollbar w-full min-w-0 flex gap-2 overflow-x-auto px-4 pb-1 snap-x-row sm:px-0",
        className,
      )}
    >
      {days.map((iso, i) => {
        const info = dayInfo?.(iso);
        const selected = value === iso;
        const free = info?.free ?? 0;
        return (
          <button
            key={iso}
            ref={selected ? activeRef : undefined}
            type="button"
            aria-pressed={selected}
            disabled={info?.closed}
            onClick={() => onChange(iso)}
            className={cn(
              "relative flex h-[72px] w-[62px] shrink-0 snap-center flex-col items-center justify-center gap-0.5 rounded-md border px-1 transition-[background-color,border-color] duration-150",
              selected
                ? "border-accent/70 bg-accent/12"
                : info?.closed
                  ? "border-line-soft bg-surface/50 opacity-45"
                  : "border-line bg-surface hover:bg-surface-2",
            )}
          >
            <span
              className={cn(
                "text-[11px] font-medium",
                selected ? "text-accent" : "text-faint",
              )}
            >
              {i === 0 ? "امروز" : weekdayName(isoWd(iso), "min")}
            </span>
            <span
              className={cn(
                "text-[17px] font-extrabold leading-none tabular-nums",
                selected ? "text-ink" : "text-ink/90",
              )}
            >
              {faNum(jDay(iso))}
            </span>
            <span
              className={cn(
                "mt-0.5 text-[10px] font-semibold tabular-nums",
                info?.closed
                  ? "text-faint"
                  : free === 0
                    ? "text-faint"
                    : free > 3
                      ? "text-mint"
                      : "text-amber",
              )}
            >
              {info?.closed
                ? "تعطیل"
                : free === 0
                  ? "پر"
                  : `${faNum(free)} وقت`}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function isoWd(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return (new Date(y, (m ?? 1) - 1, d ?? 1).getDay() + 1) % 7;
}

const PERIODS: { key: string; label: string }[] = [
  { key: "صبح", label: "صبح" },
  { key: "ظهر", label: "ظهر" },
  { key: "عصر", label: "عصر" },
  { key: "شب", label: "شب" },
];

export function TimeSlots({
  slots,
  value,
  onChange,
  onFullDay,
  serviceMinutes,
}: {
  slots: Slot[];
  value: string | null;
  onChange: (time: string) => void;
  onFullDay?: () => void;
  serviceMinutes?: number;
}) {
  const groups = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of slots) {
      const k = dayPart(s.time);
      map.set(k, [...(map.get(k) ?? []), s]);
    }
    return map;
  }, [slots]);

  const freeTotal = slots.filter((s) => s.state === "free").length;

  if (!slots.length) {
    return (
      <div className="rounded-md border border-line bg-surface px-4 py-6 text-center">
        <span className="mx-auto grid h-10 w-10 place-items-center rounded-md border border-line text-faint">
          <IconCalendar size={18} />
        </span>
        <p className="mt-3 text-[14.5px] font-bold">این روز تعطیل است</p>
        <p className="mx-auto mt-1.5 max-w-[30ch] text-[12.5px] leading-relaxed text-muted">
          این متخصص در روزهای انتخابی کاری ندارد. روزهای روشن‌شده در تقویم،
          ظرفیت آزاد دارند.
        </p>
      </div>
    );
  }

  if (freeTotal === 0) {
    return (
      <div className="rounded-md border border-line bg-surface px-4 py-6 text-center">
        <span className="mx-auto grid h-10 w-10 place-items-center rounded-md border border-line text-amber">
          <IconClock size={18} />
        </span>
        <p className="mt-3 text-[14.5px] font-bold">زمان خالی وجود ندارد</p>
        <p className="mx-auto mt-1.5 max-w-[32ch] text-[12.5px] leading-relaxed text-muted">
          همه‌ی وقت‌های این روز رزرو شده‌اند. معمولاً یک روز جابه‌جا کردن، چند
          گزینه باز می‌کند.
        </p>
        {onFullDay ? (
          <button
            type="button"
            onClick={onFullDay}
            className="mx-auto mt-3.5 inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-[13px] font-semibold transition-colors hover:bg-surface-2"
          >
            نزدیک‌ترین روزِ آزاد
            <IconChevron dir="end" size={14} />
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-[12.5px] text-muted">
        <span className="font-bold text-mint">{faNum(freeTotal)}</span> وقت آزاد
        در این روز
        {serviceMinutes ? (
          <span className="text-faint">
            {" "}
            · هر رزرو {faNum(Math.ceil(serviceMinutes / 30) * 30)} دقیقه فضا
            می‌گیرد
          </span>
        ) : null}
      </p>
      {PERIODS.map(({ key, label }) => {
        const list = groups.get(key);
        if (!list?.length) return null;
        const freeCount = list.filter((s) => s.state === "free").length;
        return (
          <div key={key}>
            <div className="mb-2 flex items-baseline gap-2">
              <h4 className="text-[12.5px] font-bold text-muted">{label}</h4>
              <span className="text-[11px] text-faint">
                {faNum(freeCount)} آزاد
              </span>
              <span className="ms-auto h-px flex-1 self-center bg-line-soft" />
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
              {list.map((s) => {
                const selected = value === s.time;
                const disabled = s.state !== "free";
                return (
                  <button
                    key={s.time}
                    type="button"
                    disabled={disabled}
                    aria-pressed={selected}
                    onClick={() => onChange(s.time)}
                    title={
                      s.state === "booked"
                        ? "رزرو شده"
                        : s.state === "blocked"
                          ? "قابل رزرو نیست"
                          : undefined
                    }
                    className={cn(
                      "relative flex h-11 items-center justify-center rounded-md border text-[13.5px] font-bold tabular-nums transition-[background-color,border-color,color,transform] duration-150",
                      selected
                        ? "border-accent bg-accent text-[#180b26]"
                        : s.state === "free"
                          ? "border-line bg-surface text-ink hover:border-accent/55 hover:bg-surface-2 active:scale-[0.97]"
                          : "border-line-soft bg-surface/40 text-faint line-through decoration-[#4a4053] decoration-1",
                    )}
                  >
                    {timeLabel(s.time)}
                    {s.state === "booked" ? (
                      <span className="absolute -top-1 start-1 rounded-[3px] bg-surface-3 px-1 text-[9px] font-bold leading-[14px] text-muted">
                        پر
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 border-t border-line-soft pt-3 text-[11px] text-faint">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[4px] border border-line bg-surface" />{" "}
          آزاد
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[4px] border border-line-soft bg-surface/40" />{" "}
          رزرو شده
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[4px] border border-accent bg-accent" />{" "}
          انتخاب شما
        </span>
        <span className="ms-auto">{jMonthLabel(toISO(new Date()))}</span>
      </div>
    </div>
  );
}

/** خلاصه‌ی روز انتخاب‌شده — برای نوار چسبان پایین صفحه */
export function DaySummary({ iso, free }: { iso: string; free?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted">
      <IconCalendar size={13} className="text-accent" />
      <span className="text-ink">{relativeDay(iso)}</span>
      <span aria-hidden className="text-faint">
        ·
      </span>
      {jDateWeekday(iso)}
      {typeof free === "number" ? (
        <span
          className={cn(
            "ms-1 rounded-xs px-1.5 py-[1px] text-[11px]",
            free ? "bg-mint/12 text-mint" : "bg-surface-3 text-faint",
          )}
        >
          {faNum(free)} وقت آزاد
        </span>
      ) : null}
    </span>
  );
}
