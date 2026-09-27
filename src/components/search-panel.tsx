"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import {
  addDays,
  faNum,
  jDateWeekday,
  jDay,
  relativeDay,
  toISO,
  weekdayName,
} from "@/lib/fa";
import { isoToJParts } from "@/lib/jalali";
import { freeCount } from "@/data/slots";
import { popularServices } from "@/data/categories";
import { activeCities, specialists } from "@/data/specialists";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/Overlay";
import { Calendar } from "@/components/calendar";
import {
  IconCalendar,
  IconClose,
  IconPin,
  IconSearch,
  IconSparkle,
} from "@/components/icons";

type Props = { variant?: "hero" | "bar"; className?: string };

export function SearchPanel({ variant = "hero", className }: Props) {
  const router = useRouter();
  const today = useMemo(() => toISO(new Date()), []);
  const [service, setService] = useState("");
  const [city, setCity] = useState("همه");
  const [day, setDay] = useState<string | null>(null);
  const [sheet, setSheet] = useState<null | "date" | "city">(null);

  const matches = useMemo(() => {
    const q = service.trim();
    if (q.length < 1) return [];
    return popularServices
      .concat()
      .filter((s) => s.name.includes(q) || q.includes(s.name.slice(0, 4)))
      .slice(0, 5);
  }, [service]);

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(today, i)),
    [today],
  );

  const freeOn = useMemo(() => {
    const map: Record<string, number> = {};
    for (const iso of days)
      map[iso] = specialists.reduce(
        (acc, sp) => acc + (freeCount(sp, iso) > 0 ? 1 : 0),
        0,
      );
    return map;
  }, [days]);

  function submit(next?: { service?: string; day?: string | null }) {
    const params = new URLSearchParams();
    const s = next?.service ?? service;
    if (s.trim()) params.set("q", s.trim());
    if (city !== "همه") params.set("city", city);
    const d = next?.day ?? day;
    if (d) params.set("day", d);
    router.push(`/explore${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div
      className={cn(
        "relative rounded-lg border border-line bg-surface/95 p-3 backdrop-blur-[2px] sm:p-4",
        variant === "hero" && "shadow-[0_30px_70px_-50px_rgba(0,0,0,0.95)]",
        className,
      )}
    >
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <h2 className="text-[14.5px] font-bold leading-none">
          دنبال چه خدماتی هستی؟
        </h2>
        <span className="hidden items-center gap-1 text-[11.5px] text-faint lg:inline-flex">
          <IconSparkle size={12} className="text-accent" />
          ۴۲ خدمت در ۶ شهر
        </span>
      </div>

      {/* فیلد خدمت */}
      <div className="relative">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex items-center gap-2 rounded-md border border-line bg-bg-2 px-3 transition-colors focus-within:border-accent/60"
        >
          <IconSearch size={18} className="shrink-0 text-faint" />
          <input
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="مثلاً: پاکسازی پوست"
            aria-label="خدمت مورد نظر"
            className="h-12 min-w-0 flex-1 bg-transparent text-[15.5px] outline-none placeholder:text-faint"
          />
          {service ? (
            <button
              type="button"
              onClick={() => setService("")}
              aria-label="پاک کردن"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-faint hover:bg-surface-2 hover:text-ink"
            >
              <IconClose size={14} />
            </button>
          ) : null}
        </form>

        {matches.length ? (
          <ul className="absolute inset-x-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-md border border-line bg-bg-2 shadow-soft motion-safe:animate-[fade_0.16s_ease-out_both]">
            {matches.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    setService(s.name);
                    submit({ service: s.name });
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-start text-[13.5px] transition-colors hover:bg-surface"
                >
                  <IconSearch size={13} className="text-faint" />
                  <span className="min-w-0 flex-1 truncate">{s.name}</span>
                  <span className="shrink-0 text-[11.5px] text-faint">
                    از {faNum((s.price / 10000).toFixed(0))} هزار تومان
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* شهر و تاریخ */}
      <div className="mt-2.5 grid gap-2.5 sm:grid-cols-[1fr_1.25fr_auto]">
        <button
          type="button"
          onClick={() => setSheet("city")}
          className="flex h-[52px] items-center gap-2.5 rounded-md border border-line bg-bg-2 px-3 text-start transition-colors hover:border-accent/45"
        >
          <IconPin size={17} className="shrink-0 text-faint" />
          <span className="min-w-0 flex-1">
            <span className="block text-[10.5px] leading-none text-faint">
              شهر
            </span>
            <span className="mt-1 block truncate text-[14px] font-semibold">
              {city}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSheet("date")}
          className="flex h-[52px] items-center gap-2.5 rounded-md border border-line bg-bg-2 px-3 text-start transition-colors hover:border-accent/45"
        >
          <IconCalendar size={17} className="shrink-0 text-faint" />
          <span className="min-w-0 flex-1">
            <span className="block text-[10.5px] leading-none text-faint">
              تاریخ
            </span>
            <span className="mt-1 block truncate text-[14px] font-semibold">
              {day
                ? `${relativeDay(day)} · ${faNum(jDay(day))} ${monthLabel(day)}`
                : "هر زمان"}
            </span>
          </span>
        </button>

        <Button
          size="lg"
          className="h-[52px] w-full sm:w-auto sm:px-7"
          onClick={() => submit()}
        >
          جستجو
        </Button>
      </div>

      {/* روزهای نزدیک */}
      <div className="no-scrollbar w-full min-w-0 mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-0.5">
        <span className="shrink-0 text-[11.5px] text-faint">روزهای نزدیک:</span>
        {days.map((iso, i) => (
          <button
            key={iso}
            type="button"
            onClick={() => {
              setDay(iso === day ? null : iso);
              submit({ day: iso === day ? null : iso });
            }}
            className={cn(
              "flex h-9 min-h-9 shrink-0 items-center gap-1.5 rounded-xs border px-2.5 text-[11.5px] font-semibold transition-colors",
              day === iso
                ? "border-accent/60 bg-accent/12 text-ink"
                : "border-line bg-surface text-muted hover:bg-surface-2",
            )}
          >
            {i === 0
              ? "امروز"
              : weekdayName((new Date(iso).getDay() + 1) % 7, "short")}
            <span className="text-faint tabular-nums">{faNum(jDay(iso))}</span>
            <span
              className={cn(
                "h-1 w-1 rounded-full",
                freeOn[iso] ? "bg-mint" : "bg-[#4a4053]",
              )}
            />
          </button>
        ))}
      </div>

      <BottomSheet
        open={sheet === "date"}
        onClose={() => setSheet(null)}
        title="انتخاب تاریخ"
      >
        <div className="space-y-4">
          <Calendar
            value={day}
            minISO={today}
            maxISO={addDays(today, 55)}
            onChange={(iso) => {
              setDay(iso);
              setSheet(null);
              submit({ day: iso });
            }}
            dayInfo={(iso) => ({
              free: specialists.reduce(
                (acc, sp) => acc + (freeCount(sp, iso) > 0 ? 1 : 0),
                0,
              ),
            })}
          />
          <button
            type="button"
            onClick={() => {
              setDay(null);
              setSheet(null);
            }}
            className="w-full text-center text-[12.5px] font-semibold text-muted hover:text-ink"
          >
            بدون انتخاب تاریخ جستجو کن
          </button>
        </div>
      </BottomSheet>

      <BottomSheet
        open={sheet === "city"}
        onClose={() => setSheet(null)}
        title="شهر را انتخاب کن"
      >
        <div className="grid grid-cols-2 gap-2">
          {["همه", ...activeCities].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCity(c);
                setSheet(null);
              }}
              className={cn(
                "flex h-12 items-center justify-between rounded-md border px-3 text-[14px] font-semibold transition-colors",
                city === c
                  ? "border-accent/60 bg-accent/10 text-ink"
                  : "border-line bg-surface text-muted",
              )}
            >
              {c}
              {city === c ? (
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              ) : null}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}

/** جستجوی کوچک بالای لیست نتایج */
export function InlineSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 transition-colors focus-within:border-accent/60"
    >
      <IconSearch size={17} className="shrink-0 text-faint" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "نام متخصص، خدمت یا مهارت"}
        aria-label="جستجو در نتایج"
        className="h-11 min-w-0 flex-1 bg-transparent text-[14.5px] outline-none placeholder:text-faint"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="پاک کردن"
          className="text-faint hover:text-ink"
        >
          <IconClose size={15} />
        </button>
      ) : null}
    </form>
  );
}

export function TrendingRow({ className }: { className?: string }) {
  const items = [
    { label: "پاکسازی پوست", href: "/explore?q=پاکسازی" },
    { label: "بالیاژ", href: "/explore?q=بالیاژ" },
    { label: "مانیکور روسی", href: "/explore?q=مانیکور" },
    { label: "میکاپ عروس", href: "/explore?q=میکاپ%20عروس" },
    { label: "سنگ داغ", href: "/explore?q=ماساژ" },
  ];
  return (
    <div
      className={cn("flex flex-wrap items-center gap-x-2 gap-y-2", className)}
    >
      <span className="text-[11.5px] text-faint">پرجستجو:</span>
      {items.map((i) => (
        <Link
          key={i.label}
          href={i.href}
          className="rounded-xs border border-line bg-surface px-2 py-1 text-[12px] font-semibold text-muted transition-colors hover:border-accent/45 hover:text-ink"
        >
          {i.label}
        </Link>
      ))}
    </div>
  );
}

function monthLabel(iso: string) {
  const names = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];
  return names[isoToJParts(iso).jm - 1] ?? "";
}

export function DemoHint() {
  return (
    <p className="text-[11.5px] leading-relaxed text-faint">
      برای دیدن حالت خالی، «ماساژ دریاچه» را جستجو کن؛ برای تقویم،{" "}
      {jDateWeekday(toISO(new Date()))} را انتخاب کن.
    </p>
  );
}
