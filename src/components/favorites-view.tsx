"use client";

import { useMemo } from "react";
import { faNum } from "@/lib/fa";
import { specialistById } from "@/data/specialists";
import { nearestFree, daySlots } from "@/data/slots";
import { toISO } from "@/lib/fa";
import { useLumera } from "@/store/useLumera";
import { SpecialistCard } from "@/components/specialist-card";
import { Button, LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { IconHeart, IconSparkle } from "@/components/icons";

export function FavoritesView() {
  const hydrated = useLumera((s) => s.hydrated);
  const favorites = useLumera((s) => s.favorites);
  const today = useMemo(() => toISO(new Date()), []);

  const list = useMemo(
    () =>
      favorites
        .map((id) => specialistById[id])
        .filter((x): x is NonNullable<typeof x> => Boolean(x))
        .map((sp) => {
          const freeToday = daySlots(sp, today).filter(
            (s) => s.state === "free",
          ).length;
          const near = nearestFree(sp, today);
          return { sp, freeToday, near };
        }),
    [favorites, today],
  );

  const soon = list.filter((x) => x.near && x.near.iso === today).length;

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-[1240px] space-y-3 px-4 py-8 sm:px-6 lg:px-10">
        <Skeleton className="h-7 w-44" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="aspect-[4/5] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 pb-6 pt-4 sm:px-6 lg:px-10 lg:pt-6">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <span className="eyebrow">علاقه‌مندی‌ها</span>
          <h1 className="mt-2.5 text-[24px] font-extrabold leading-tight sm:text-[28px]">
            متخصص‌های نشان‌شده
          </h1>
          <p className="mt-1.5 max-w-[54ch] text-[13px] leading-relaxed text-muted">
            این فهرست فقط در همین دستگاه نگه داشته می‌شود؛ هیچ‌کس جز شما آن را
            نمی‌بیند.
          </p>
        </div>
        {list.length ? (
          <Badge tone="neutral" leading={<IconHeart size={11} filled />}>
            {faNum(list.length)} متخصص ذخیره‌شده
          </Badge>
        ) : null}
      </header>

      {soon > 0 ? (
        <div className="mb-4 flex flex-wrap items-center gap-2.5 rounded-md border border-mint/25 bg-mint/[0.05] px-3.5 py-2.5 text-[12.5px] text-muted">
          <IconSparkle size={14} className="text-mint" />
          {faNum(soon)} مورد از علاقه‌مندی‌های شما امروز وقت خالی دارند.
          <LinkButton
            href="/explore?free=1"
            size="sm"
            variant="ghost"
            className="ms-auto text-mint"
          >
            دیدن ظرفیت‌های امروز
          </LinkButton>
        </div>
      ) : null}

      {list.length ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {list.map(({ sp }) => (
              <SpecialistCard key={sp.id} sp={sp} rich className="h-full" />
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface p-4">
            <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-muted">
              پیشنهاد: برای هر خدمت، دو متخصص را مقایسه کنید؛ فاصله و ساعت شروع،
              معمولاً تصمیم‌گیرنده‌اند.
            </p>
            <Button
              variant="outline"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              بالای صفحه
            </Button>
          </div>
        </>
      ) : (
        <EmptyState
          glyph={<IconHeart size={18} />}
          tint="rose"
          title="علاقه‌مندی‌ها خالی است"
          body={
            <>
              هنوز هیچ متخصصی را نشان نکرده‌اید. روی آیکن قلب در کارت هر متخصص
              بزنید تا اینجا ذخیره شود — برای مقایسه‌ی بعدی، همین چند ثانیه وقت
              می‌گیرد.
            </>
          }
          action={{ label: "شروع کاوش", href: "/explore" }}
          secondary={{
            label: "دیدن خدمات پرطرفدار",
            href: "/services",
          }}
          note="در نسخه‌ی نمایشی، نشان‌ها در حافظه‌ی همین مرورگر می‌مانند."
        />
      )}
    </div>
  );
}
