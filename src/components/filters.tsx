"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";
import {
  addDays,
  faDec,
  faNum,
  jDay,
  monthName,
  price,
  relativeDay,
  toISO,
  weekdayName,
} from "@/lib/fa";
import { categories } from "@/data/categories";
import { activeCities } from "@/data/specialists";
import { freeCount } from "@/data/slots";
import { specialists } from "@/data/specialists";
import { priceRange } from "@/data/categories";
import type { ExploreFilters } from "@/data";
import { Badge, Chip, Toggle } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Cards";
import {
  IconCheck,
  IconClose,
  IconRefresh,
  IconShield,
  IconSparkle,
} from "@/components/icons";

export const PRICE_MAX = 8000000;

export function FiltersPanel({
  value,
  onChange,
  onReset,
  today,
  className,
  showSearch,
  search,
  onSearch,
}: {
  value: ExploreFilters;
  onChange: (patch: Partial<ExploreFilters>) => void;
  onReset: () => void;
  today: string;
  className?: string;
  showSearch?: boolean;
  search?: string;
  onSearch?: (v: string) => void;
}) {
  const days = useMemo(
    () => Array.from({ length: 10 }, (_, i) => addDays(today, i)),
    [today],
  );
  const perCat = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of categories)
      map[c.id] = specialists.filter((s) => s.categoryId === c.id).length;
    return map;
  }, []);

  const day = value.day;
  const totalFree = useMemo(
    () =>
      day ? specialists.reduce((acc, sp) => acc + freeCount(sp, day), 0) : 0,
    [day],
  );

  return (
    <div className={cn("space-y-6", className)}>
      {showSearch && onSearch ? (
        <div>
          <label className="label mb-2 block text-muted" htmlFor="explore-q">
            جستجو در نام، مهارت یا خدمت
          </label>
          <input
            id="explore-q"
            value={search ?? ""}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="مثلاً: بالیاژ، ابرو، کلینیک النا"
            className="h-11 w-full rounded-md border border-line bg-surface px-3 text-[14px] outline-none transition-colors focus:border-accent/60"
          />
        </div>
      ) : null}

      <Group title="دسته">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const on = value.cats.includes(c.id);
            return (
              <Chip
                key={c.id}
                active={on}
                count={perCat[c.id]}
                onClick={() =>
                  onChange({
                    cats: on
                      ? value.cats.filter((x) => x !== c.id)
                      : [...value.cats, c.id],
                  })
                }
              >
                {c.name}
              </Chip>
            );
          })}
        </div>
      </Group>

      <Group title="شهر">
        <div className="flex flex-wrap gap-2">
          {["همه", ...activeCities].map((c) => (
            <Chip
              key={c}
              active={value.city === c}
              onClick={() => onChange({ city: c })}
            >
              {c}
            </Chip>
          ))}
        </div>
      </Group>

      <Group
        title="روز"
        aside={
          value.day ? (
            <button
              type="button"
              onClick={() => onChange({ day: null })}
              className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-faint hover:text-ink"
            >
              <IconClose size={11} />
              پاک کردن
            </button>
          ) : null
        }
      >
        <div className="no-scrollbar w-full min-w-0 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {days.map((iso, i) => {
            const on = value.day === iso;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => onChange({ day: on ? null : iso })}
                className={cn(
                  "flex h-[60px] w-[54px] shrink-0 flex-col items-center justify-center rounded-md border text-[11px] transition-colors",
                  on
                    ? "border-accent/65 bg-accent/12"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                <span className="text-faint">
                  {i === 0 ? "امروز" : weekdayName(i % 7, "min")}
                </span>
                <span
                  className={cn(
                    "mt-0.5 text-[15px] font-bold tabular-nums",
                    on ? "text-ink" : "text-muted",
                  )}
                >
                  {faNum(jDay(iso))}
                </span>
              </button>
            );
          })}
        </div>
        {value.day ? (
          <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-mint">
            <IconSparkle size={12} />
            {faNum(totalFree)} وقت آزاد در {relativeDay(value.day)} —{" "}
            {faNum(jDay(value.day))}{" "}
            {monthName(1 + ((days.findIndex((d) => d === value.day) + 6) % 12))}
          </p>
        ) : null}
      </Group>

      <Group title="حداقل امتیاز">
        <div className="flex flex-wrap gap-2">
          {[0, 4.3, 4.6, 4.8].map((r) => (
            <Chip
              key={r}
              active={value.minRating === r}
              onClick={() => onChange({ minRating: r })}
            >
              {r === 0 ? "همه" : `${faDec(r)}+`}
            </Chip>
          ))}
        </div>
      </Group>

      <Group
        title="سقف قیمت هر خدمت"
        aside={
          <span className="text-[11.5px] font-semibold tabular-nums text-accent">
            {price(value.maxPrice)}
          </span>
        }
      >
        <input
          type="range"
          className="lumera-range"
          dir="rtl"
          min={priceRange.min}
          max={PRICE_MAX}
          step={50000}
          value={value.maxPrice}
          aria-label="سقف قیمت"
          onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
          style={
            {
              "--fill": `${((value.maxPrice - priceRange.min) / (PRICE_MAX - priceRange.min)) * 100}%`,
            } as React.CSSProperties
          }
        />
        <div className="mt-1 flex justify-between text-[11px] text-faint">
          <span>{price(priceRange.min, false)}</span>
          <span>{price(PRICE_MAX, false)}</span>
        </div>
      </Group>

      <Group title="پیشرفته">
        <div className="space-y-2">
          <Toggle
            checked={value.verifiedOnly}
            onChange={(v) => onChange({ verifiedOnly: v })}
            label="فقط متخصص‌های تأییدشده"
            hint="هویت، نمونه‌کار و سابقه در لومرا بررسی شده است."
          />
          <Toggle
            checked={value.freeOnly}
            onChange={(v) => onChange({ freeOnly: v })}
            label="فقط کسی که وقت خالی دارد"
            hint="ظرفیت در ۵ روز آینده."
          />
        </div>
      </Group>

      <Divider />

      <Group
        title="حالت‌های نمایشی"
        aside={<Badge tone="neutral">برای بازبینی UI</Badge>}
      >
        <div className="flex flex-wrap gap-2">
          {(
            [
              { v: "off", label: "عادی" },
              { v: "empty", label: "نتیجه‌ای نیست" },
              { v: "error", label: "خطای ارتباط" },
            ] as const
          ).map((o) => (
            <Chip
              key={o.v}
              active={(value.demo ?? "off") === o.v}
              onClick={() => onChange({ demo: o.v })}
            >
              {o.label}
            </Chip>
          ))}
        </div>
      </Group>

      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          block
          leading={<IconRefresh size={15} />}
          onClick={onReset}
        >
          بازنشانی فیلترها
        </Button>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-2 text-[11.5px] text-faint">
          <IconShield size={13} className="text-mint" />
          فیلترها محلی‌اند
        </span>
      </div>
    </div>
  );
}

function Group({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <h3 className="text-[13px] font-bold text-ink">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function ActiveFilterChips({
  value,
  onRemove,
  today,
}: {
  value: ExploreFilters;
  onRemove: (patch: Partial<ExploreFilters>) => void;
  today: string;
}) {
  const chips: {
    key: string;
    label: string;
    patch: Partial<ExploreFilters>;
  }[] = [];
  if (value.q.trim())
    chips.push({ key: "q", label: `«${value.q.trim()}»`, patch: { q: "" } });
  for (const c of value.cats)
    chips.push({
      key: `cat-${c}`,
      label: categories.find((x) => x.id === c)?.name ?? c,
      patch: { cats: value.cats.filter((x) => x !== c) },
    });
  if (value.city !== "همه")
    chips.push({ key: "city", label: value.city, patch: { city: "همه" } });
  if (value.day)
    chips.push({
      key: "day",
      label: `${relativeDay(value.day)} ${faNum(jDay(value.day))}`,
      patch: { day: null },
    });
  if (value.minRating)
    chips.push({
      key: "rate",
      label: `امتیاز ${faDec(value.minRating)}+`,
      patch: { minRating: 0 },
    });
  if (value.maxPrice < PRICE_MAX)
    chips.push({
      key: "price",
      label: `تا ${price(value.maxPrice, false)}`,
      patch: { maxPrice: PRICE_MAX },
    });
  if (value.verifiedOnly)
    chips.push({
      key: "ver",
      label: "تأییدشده",
      patch: { verifiedOnly: false },
    });
  if (value.freeOnly)
    chips.push({ key: "free", label: "وقت خالی", patch: { freeOnly: false } });
  void today;

  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => onRemove(c.patch)}
          className="group inline-flex items-center gap-1.5 rounded-xs border border-accent/35 bg-accent/10 px-2 py-1 text-[12px] font-semibold text-ink transition-colors hover:bg-accent/16"
        >
          {c.label}
          <IconClose size={11} className="text-accent" />
        </button>
      ))}
      <span className="inline-flex items-center gap-1 text-[11.5px] text-faint">
        <IconCheck size={11} className="text-mint" />
        اعمال‌شده
      </span>
    </div>
  );
}

export function EmptyFilters(): ExploreFilters {
  return {
    q: "",
    cats: [],
    city: "همه",
    day: null,
    minRating: 0,
    maxPrice: PRICE_MAX,
    verifiedOnly: false,
    freeOnly: false,
    demo: "off",
  };
}

export { useToday as useExploreToday } from "@/hooks/use-today";
