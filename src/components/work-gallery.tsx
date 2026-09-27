"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { categoryArt, type CatId } from "@/lib/images";
import { faNum, jDateLong, addDays, toISO } from "@/lib/fa";
import { Button } from "@/components/ui/Button";
import { Img } from "@/components/ui/Image";
import { Badge } from "@/components/ui/Badge";
import { IconClose, IconEye, IconImage, IconSparkle } from "@/components/icons";

/** نمونه‌کار — کلاژ ویراستاری‌شده با نمای تمام‌صفحه */
export function WorkGallery({
  categoryId,
  title,
  count = 6,
  className,
}: {
  categoryId: CatId;
  title: string;
  count?: number;
  className?: string;
}) {
  const art = categoryArt[categoryId];
  const today = useMemo(() => toISO(new Date()), []);
  const [active, setActive] = useState<number | null>(null);

  const shots = Array.from({ length: count }, (_, i) => {
    const src =
      i % 3 === 0
        ? art.work[i % art.work.length]
        : i % 3 === 1
          ? art.wide
          : art.tile;
    return {
      src,
      label: `${title} — قاب ${faNum(i + 1)}`,
      date: jDateLong(addDays(today, -(7 + i * 19))),
      ratio:
        i % 3 === 1
          ? "aspect-[4/3]"
          : i % 4 === 0
            ? "aspect-[3/4]"
            : "aspect-square",
    };
  });

  return (
    <div className={cn("min-w-0", className)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] leading-relaxed text-muted">
          همه‌ی قاب‌ها در استودیوی همین متخصص ثبت شده‌اند؛ بدون فلتر و بدون
          روتوش.
        </p>
        <Badge tone="neutral" leading={<IconImage size={11} />}>
          {faNum(shots.length)} قاب
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {shots.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "group relative overflow-hidden rounded-md border border-line bg-surface-2",
              i === 0 &&
                "col-span-2 aspect-[16/10] sm:row-span-2 sm:aspect-[4/5]",
            )}
          >
            <Img
              src={s.src}
              alt={s.label}
              className={cn(
                "h-full w-full transition-transform duration-[700ms] ease-out group-hover:scale-[1.03]",
                i === 0 ? "" : s.ratio,
              )}
            />
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(13,11,16,0.8),transparent_45%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" />
            <span className="pointer-events-none absolute inset-x-2.5 bottom-2 flex items-center justify-between gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="min-w-0 truncate text-[11.5px] font-semibold">
                {s.label}
              </span>
              <span className="shrink-0 text-faint">
                <IconEye size={14} />
              </span>
            </span>
          </button>
        ))}
      </div>

      {active !== null ? (
        <div
          className="fixed inset-0 z-90 flex flex-col items-center justify-center gap-4 bg-[#050409]/94 p-4 motion-safe:animate-[fade_0.2s_ease-out_both]"
          role="dialog"
          aria-modal="true"
          aria-label="نمای بزرگ نمونه‌کار"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            aria-label="بستن"
            onClick={() => setActive(null)}
            className="absolute end-4 top-4 grid h-10 w-10 place-items-center rounded-md border border-line bg-surface text-muted transition-colors hover:text-ink"
          >
            <IconClose size={18} />
          </button>
          <img
            src={shots[active]!.src}
            alt={shots[active]!.label}
            className="max-h-[74dvh] w-auto max-w-full rounded-md border border-line object-contain"
          />
          <div className="flex flex-wrap items-center justify-center gap-3 text-center">
            <p className="text-[13.5px] font-semibold">
              {shots[active]!.label}
            </p>
            <span className="text-[12px] text-faint">
              {shots[active]!.date}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setActive((active - 1 + shots.length) % shots.length);
              }}
            >
              قبلی
            </Button>
            <span className="text-[12px] tabular-nums text-faint">
              {faNum(active + 1)} / {faNum(shots.length)}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setActive((active + 1) % shots.length);
              }}
            >
              بعدی
            </Button>
          </div>
          <p className="flex items-center gap-1.5 text-[11.5px] text-faint">
            <IconSparkle size={12} className="text-accent" />
            برای بستن در هر جای تصویر کلیک کن
          </p>
        </div>
      ) : null}
    </div>
  );
}
