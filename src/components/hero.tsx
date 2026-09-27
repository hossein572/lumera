"use client";

import Link from "next/link";
import { useMemo } from "react";
import { HERO_IMG } from "@/lib/images";
import { faNum, jDateWeekday, relativeDay, timeLabel } from "@/lib/fa";
import { nearestFree, daySlots } from "@/data/slots";
import { specialistById } from "@/data/specialists";
import { serviceById } from "@/data/services";
import { useRevealRef } from "@/hooks/useReveal";
import { FALLBACK_TODAY } from "@/hooks/use-today";
import { useToday } from "@/hooks/use-today";
import { Img } from "@/components/ui/Image";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { LinkButton } from "@/components/ui/Button";
import { SearchPanel, TrendingRow } from "@/components/search-panel";
import { faces } from "@/lib/images";
import {
  IconArrow,
  IconCalendar,
  IconCheckCircle,
  IconSparkle,
} from "@/components/icons";

export function Hero() {
  const today = useToday();
  const sp = specialistById.sp1;
  const service = serviceById.sk1;
  const slot = useMemo(() => (sp ? nearestFree(sp, today) : null), [sp, today]);
  const freeToday = useMemo(
    () =>
      sp ? daySlots(sp, today).filter((s) => s.state === "free").length : 0,
    [sp, today],
  );

  const copyRef = useRevealRef<HTMLDivElement>();
  const ready = today !== FALLBACK_TODAY;

  return (
    <section className="relative overflow-hidden pt-1">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10">
        <div className="grid items-end gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
          {/* کپی */}
          <div
            ref={copyRef}
            className="reveal order-2 mt-12 lg:order-1 lg:mt-0 lg:pb-6"
          >
            <span className="eyebrow">رزرو آنلاین خدمات زیبایی و مراقبت</span>
            <h1 className="mt-4 text-[30px] leading-[1.32] tracking-[-0.015em] sm:text-[38px] lg:text-[44px] lg:leading-[1.28]">
              <span className="font-extrabold">زیبایی،</span>
              <br className="hidden sm:block" />{" "}
              <span className="font-light text-muted">
                وقتی با انتخاب درست شروع می‌شود.
              </span>
            </h1>
            <p className="mt-4 max-w-[46ch] text-[14.5px] leading-[1.95] text-muted sm:text-[15.5px]">
              متخصص مورد اعتماد خودت را پیدا کن، زمان مناسب را انتخاب کن و نوبتت
              را در چند قدم رزرو کن.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <LinkButton
                href="/explore"
                size="lg"
                className="min-w-[160px]"
                trailing={<IconArrow size={16} />}
              >
                شروع جستجو
              </LinkButton>
              <LinkButton
                href="/explore?sort=rating"
                size="lg"
                variant="outline"
                className="min-w-[168px]"
              >
                مشاهده متخصص‌ها
              </LinkButton>
            </div>

            <div className="mt-6 hidden items-center gap-5 border-t border-line-soft pt-4 lg:flex">
              <Stat
                value={`${faNum(sp?.responseMinutes ?? 12)} دقیقه`}
                label="میانگین پاسخ‌گویی"
              />
              <span className="h-8 w-px bg-line" aria-hidden />
              <Stat value={`${faNum(1042)} نظر`} label="تأییدشده و واقعی" />
              <span className="h-8 w-px bg-line" aria-hidden />
              <Stat value={`${faNum(96)}٪`} label="رزرو بدون تغییر ساعت" />
            </div>
          </div>

          {/* تصویر */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <Img
                src={HERO_IMG}
                alt="مراجعه‌کننده در حال فیشال تخصصی در استودیوی پوست لومرا"
                eager
                className="hero-frame w-full rounded-lg border border-line sm:aspect-[5/5] lg:aspect-[4/5]"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-lg bg-[linear-gradient(190deg,transparent_45%,rgba(13,11,16,0.55))]"
              />
              <span className="absolute inset-x-3 bottom-3 flex items-center gap-2 lg:hidden">
                <Badge
                  tone="mint"
                  leading={<IconSparkle size={11} />}
                  className="bg-bg/70 backdrop-blur-[2px]"
                >
                  {ready && slot
                    ? `امروز ${faNum(freeToday)} وقت آزاد`
                    : "ظرفیت امروز"}
                </Badge>
              </span>

              {/* کارت شناورِ محدود */}
              <div className="absolute -bottom-5 start-3 end-3 z-10 rounded-md border border-line bg-bg-2/97 p-3 sm:end-auto sm:w-[330px] lg:-bottom-8 lg:start-auto lg:-end-6">
                <div className="flex items-start gap-2.5">
                  <Avatar
                    name={sp?.name ?? ""}
                    face={sp?.face ? faces[sp.face] : null}
                    category="skin"
                    tint={sp?.tint ?? "violet"}
                    size="md"
                    verified={sp?.verified}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-bold">
                      {sp?.name}
                    </p>
                    <p className="mt-0.5 truncate text-[11.5px] text-faint">
                      {sp?.title}
                    </p>
                    <Rating
                      value={sp?.rating ?? 4.9}
                      size="sm"
                      count={sp?.reviews}
                      className="mt-1"
                    />
                  </div>
                  <Link
                    href={`/specialists/${sp?.id ?? "sp1"}`}
                    aria-label="رفتن به پروفایل متخصص"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-line text-muted transition-colors hover:border-accent/55 hover:text-accent"
                  >
                    <IconArrow size={14} />
                  </Link>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 rounded-xs border border-line-soft bg-surface px-2.5 py-2">
                  <span className="min-w-0 text-[11.5px] leading-tight">
                    <span className="block truncate font-semibold text-ink">
                      {service?.name}
                    </span>
                    <span className="mt-0.5 block truncate text-faint">
                      {ready && slot
                        ? `${relativeDay(slot.iso)} · ساعت ${timeLabel(slot.time)}`
                        : "…"}
                    </span>
                  </span>
                  <span className="inline-flex h-7 shrink-0 items-center gap-1 rounded-xs bg-mint/14 px-2 text-[11px] font-bold text-mint">
                    <IconCheckCircle size={12} />
                    قابل رزرو
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* جستجو */}
        <div className="relative z-20 mt-9 lg:mt-14">
          <SearchPanel className="mx-auto max-w-[1040px]" />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <TrendingRow />
            <p className="flex items-center gap-1.5 text-[11.5px] text-faint">
              <IconCalendar size={12} />
              {jDateWeekday(today)} — تقویم لومرا
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <span>
      <span className="block text-[17px] font-extrabold leading-none tracking-tight">
        {value}
      </span>
      <span className="mt-1.5 block text-[11.5px] text-faint">{label}</span>
    </span>
  );
}

/** ردیف ظرفیت‌های امروز — یک نوار اطلاعاتی زنده */
export function TodayCapacityStrip() {
  const today = useToday();
  const items = useMemo(() => {
    const list = [...Array.from({ length: 15 }, (_, i) => `sp${i + 1}`)]
      .map((id) => specialistById[id])
      .filter(Boolean)
      .map((sp) => {
        const slots = daySlots(sp!, today);
        const free = slots.filter((s) => s.state === "free");
        return {
          id: sp!.id,
          name: sp!.name,
          free: free.length,
          time: free[0]?.time ?? null,
        };
      })
      .filter((x) => x.free > 0)
      .sort((a, b) => b.free - a.free)
      .slice(0, 8);
    return list;
  }, [today]);

  if (!items.length) return null;

  return (
    <div className="border-y border-line bg-bg-2/50">
      <div className="mx-auto flex w-full max-w-[1240px] items-center gap-4 overflow-x-auto px-4 py-3 no-scrollbar w-full min-w-0 sm:px-6 lg:px-10">
        <span className="shrink-0 text-[11.5px] font-bold text-amber">
          ظرفیت امروز
        </span>
        {items.map((i) => (
          <Link
            key={i.id}
            href={`/specialists/${i.id}`}
            className="flex shrink-0 items-center gap-2 rounded-xs border border-line bg-surface px-2.5 py-1.5 text-[12px] transition-colors hover:border-accent/45"
          >
            <span className="font-semibold">{i.name}</span>
            <span className="text-faint">{faNum(i.free)} وقت</span>
            {i.time ? (
              <span className="text-mint">{timeLabel(i.time)}</span>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
