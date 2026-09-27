"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import {
  faNum,
  jDateWeekday,
  price,
  relativeDay,
  toISO,
  timeLabel,
} from "@/lib/fa";
import { categoryArt, faces, tints } from "@/lib/images";
import { initials } from "@/lib/fa";
import { firstFree } from "@/lib/specialist";
import { nearestFree } from "@/data/slots";
import type { Specialist } from "@/data/types";
import { Img } from "@/components/ui/Image";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, VerifiedBadge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { FavoriteButton } from "@/components/favorite-button";
import { IconChevron, IconClock, IconPin, IconUsers } from "@/components/icons";

interface Props {
  sp: Specialist;
  variant?: "image" | "row" | "compact";
  className?: string;
  showPrice?: boolean;
  /** کارت‌های home کمی بزرگ‌تر و پرجزئیات‌ترند */
  rich?: boolean;
}

export function SpecialistCard({
  sp,
  variant = "image",
  className,
  showPrice = true,
  rich,
}: Props) {
  const [hover, setHover] = useState(false);
  const today = useMemo(() => toISO(new Date()), []);
  const slot = useMemo(() => nearestFree(sp, today), [sp, today]);
  const face = sp.face ? faces[sp.face] : null;
  const art = categoryArt[sp.categoryId];
  const tint = tints[sp.tint];

  if (variant === "row") {
    return (
      <Link
        href={`/specialists/${sp.id}`}
        className={cn(
          "group relative flex items-center gap-3 rounded-lg border border-line bg-surface p-3 transition-colors duration-200 hover:border-line-soft hover:bg-surface/80",
          className,
        )}
      >
        <Avatar
          name={sp.name}
          face={face}
          category={sp.categoryId}
          tint={sp.tint}
          size="lg"
          verified={sp.verified}
        />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-[15px] font-bold">{sp.name}</span>
            {sp.verified ? (
              <span
                className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-mint/15 text-mint"
                title="تأیید لومرا"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                >
                  <path d="m5 12.5 4.5 4.5L19 7" />
                </svg>
              </span>
            ) : null}
          </span>
          <span className="mt-0.5 block truncate text-[12.5px] text-muted">
            {sp.title}
          </span>
          <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <Rating value={sp.rating} size="sm" count={sp.reviews} />
            <span className="inline-flex items-center gap-1 text-[11.5px] text-faint">
              <IconPin size={12} />
              {sp.district.replace(/^منطقه\s*\d+\s*—\s*/, "")}
            </span>
          </span>
          {slot ? (
            <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-xs bg-surface-2 px-1.5 py-1 text-[11.5px] font-semibold text-mint">
              <IconClock size={12} />
              اولین وقت خالی: {relativeDay(slot.iso)} {timeLabel(slot.time)}
            </span>
          ) : (
            <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11.5px] text-faint">
              <IconClock size={12} />
              در دو هفته‌ی آینده وقت خالی ندارد
            </span>
          )}
        </span>
        <span className="flex flex-col items-end gap-2 self-stretch">
          <FavoriteButton id={sp.id} name={sp.name} />
          {showPrice ? (
            <span className="text-[11px] text-faint">
              از{" "}
              <span className="block text-[13px] font-bold text-ink tabular-nums">
                {price(sp.priceFrom, false)}
              </span>
              <span className="block text-[10.5px] text-faint">تومان</span>
            </span>
          ) : null}
          <span className="mt-auto text-faint transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-ink">
            <IconChevron dir="end" size={16} />
          </span>
        </span>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/specialists/${sp.id}`}
        className={cn(
          "flex min-w-[170px] shrink-0 snap-start items-center gap-2.5 rounded-md border border-line bg-surface p-2.5 transition-colors hover:bg-surface-2/70",
          className,
        )}
      >
        <Avatar
          name={sp.name}
          face={face}
          category={sp.categoryId}
          tint={sp.tint}
          size="md"
        />
        <span className="min-w-0">
          <span className="block truncate text-[13.5px] font-bold">
            {sp.name}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-faint">
            <Rating value={sp.rating} size="sm" showValue />
            <span aria-hidden>·</span>
            {faNum(sp.visits)} مراجعه
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/specialists/${sp.id}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition-[border-color,background-color] duration-250 hover:border-[color:var(--tint-border)]",
        className,
      )}
      style={{ "--tint-border": tint.border } as React.CSSProperties}
    >
      <span className="relative block aspect-[4/5] w-full overflow-hidden bg-surface-2 sm:aspect-[5/6]">
        <Img
          src={art.tile}
          alt=""
          eager
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          imgClassName="opacity-60"
        />
        {face ? (
          <>
            <Img
              src={hover ? (face.alt ?? face.base) : face.base}
              alt={sp.name}
              eager
              className={cn(
                "absolute inset-0 h-full w-full transition-[opacity,transform] duration-500 ease-out",
                hover ? "scale-[1.015] opacity-100" : "scale-100 opacity-100",
              )}
            />
            <Img
              src={face.alt ?? face.base}
              alt=""
              aria-hidden
              className={cn(
                "absolute inset-0 h-full w-full transition-opacity duration-500",
                hover ? "opacity-100" : "opacity-0",
              )}
            />
          </>
        ) : (
          <span className="absolute inset-0 grid place-items-center">
            <span
              className="grid h-16 w-16 place-items-center rounded-md border text-[22px] font-extrabold backdrop-blur-[1px]"
              style={{
                borderColor: tint.border,
                color: tint.fg,
                background: "rgba(13,11,16,0.45)",
              }}
            >
              {initials(sp.name)}
            </span>
          </span>
        )}

        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-3/5 bg-[linear-gradient(to_top,rgba(13,11,16,0.96),rgba(13,11,16,0.6)_45%,transparent)]"
        />

        <span className="absolute inset-x-3 bottom-2.5 z-10">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-[16px] font-extrabold leading-tight">
              {sp.name}
            </span>
            {sp.verified ? (
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-mint text-[#04231d]">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                >
                  <path d="m5 12.5 4.5 4.5L19 7" />
                </svg>
              </span>
            ) : null}
          </span>
          <span className="mt-0.5 block truncate text-[12px] text-muted">
            {sp.title}
          </span>
        </span>

        <span className="absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
          <span className="flex flex-wrap gap-1.5">
            {slot ? (
              <Badge
                tone="mint"
                leading={<IconClock size={11} />}
                className="bg-bg/65 backdrop-blur-[2px]"
              >
                {relativeDay(slot.iso)} {timeLabel(slot.time)}
              </Badge>
            ) : (
              <Badge tone="neutral" className="bg-bg/65 backdrop-blur-[2px]">
                بدون وقت خالی
              </Badge>
            )}
          </span>
          <FavoriteButton
            id={sp.id}
            name={sp.name}
            variant="solid"
            className="bg-bg/60 backdrop-blur-[2px]"
          />
        </span>
      </span>

      <span className="flex flex-1 flex-col gap-2.5 p-3.5">
        <span className="flex items-center justify-between gap-2">
          <Rating value={sp.rating} size="sm" count={sp.reviews} />
          <span className="inline-flex items-center gap-1 text-[11.5px] text-faint">
            <IconUsers size={12} />
            {faNum(sp.visits)}
          </span>
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-muted">
          <IconPin size={13} className="text-faint" />
          <span className="truncate">
            {sp.city} · {sp.district}
          </span>
        </span>
        {rich ? (
          <span className="flex flex-wrap gap-1.5">
            {sp.skills.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded-xs border border-line-soft bg-surface-2/70 px-1.5 py-[3px] text-[11px] text-muted"
              >
                {s}
              </span>
            ))}
          </span>
        ) : null}
        <span className="mt-auto flex items-end justify-between gap-3 border-t border-line-soft pt-2.5">
          {showPrice ? (
            <span className="text-[11px] leading-none text-faint">
              شروع از
              <span className="mt-1 block text-[14px] font-bold text-ink tabular-nums">
                {price(sp.priceFrom, false)}
                <span className="ms-1 text-[11px] font-medium">تومان</span>
              </span>
            </span>
          ) : (
            <span className="text-[11.5px] text-faint">
              {jDateWeekday(today)}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-accent transition-transform duration-200 group-hover:-translate-x-0.5">
            رزرو
            <IconChevron dir="end" size={14} />
          </span>
        </span>
      </span>
      {sp.featured && rich ? (
        <span className="absolute end-0 top-0 z-10 rounded-es-none rounded-ss-md bg-ink px-2 py-[3px] text-[10.5px] font-bold text-ink-950">
          منتخب لومرا
        </span>
      ) : null}
    </Link>
  );
}

export function SpecialistCardRowVerifiedNote({ sp }: { sp: Specialist }) {
  if (!sp.verified) return <Badge tone="amber">در انتظار تأیید</Badge>;
  return <VerifiedBadge />;
}
