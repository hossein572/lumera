"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { faNum } from "@/lib/fa";
import { useToday } from "@/hooks/use-today";
import { categories } from "@/data/categories";
import { services, specialists } from "@/data/index";
import {
  filterSpecialists,
  sortLabels,
  sortSpecialists,
  type ExploreFilters,
  type SortKey,
} from "@/data";
import { nearestFree } from "@/data/slots";
import {
  ActiveFilterChips,
  EmptyFilters,
  FiltersPanel,
  PRICE_MAX,
} from "@/components/filters";
import { SpecialistCard } from "@/components/specialist-card";
import { InlineSearch, TrendingRow } from "@/components/search-panel";
import { Button, LinkButton } from "@/components/ui/Button";
import { Badge, Chip } from "@/components/ui/Badge";
import { BottomSheet } from "@/components/ui/Overlay";
import { CardSkeleton, ListSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";
import {
  IconAlert,
  IconArrow,
  IconFilter,
  IconRefresh,
  IconSearch,
  IconSort,
  IconSparkle,
} from "@/components/icons";

const SORTS: SortKey[] = [
  "recommended",
  "rating",
  "price-asc",
  "price-desc",
  "nearest",
  "earliest",
];

export function ExploreView({
  initial,
}: {
  initial: Partial<ExploreFilters> & { sort?: SortKey };
}) {
  const router = useRouter();
  const params = useSearchParams();
  const today = useToday();
  const [filters, setFilters] = useState<ExploreFilters>({
    ...EmptyFilters(),
    ...initial,
  });
  const [sort, setSort] = useState<SortKey>(initial.sort ?? "recommended");
  const [sheet, setSheet] = useState<null | "filters" | "sort">(null);
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);

  /* فیلترها را با URL هم‌گام نگه می‌داریم تا قابل اشتراک باشند */
  useEffect(() => {
    const q = new URLSearchParams();
    if (filters.q.trim()) q.set("q", filters.q.trim());
    for (const c of filters.cats) q.append("cat", c);
    if (filters.city !== "همه") q.set("city", filters.city);
    if (filters.day) q.set("day", filters.day);
    if (filters.minRating) q.set("rating", String(filters.minRating));
    if (filters.maxPrice < PRICE_MAX) q.set("max", String(filters.maxPrice));
    if (filters.verifiedOnly) q.set("verified", "1");
    if (filters.freeOnly) q.set("free", "1");
    if (sort !== "recommended") q.set("sort", sort);
    if (filters.demo && filters.demo !== "off") q.set("demo", filters.demo);
    const next = `/explore${q.toString() ? `?${q.toString()}` : ""}`;
    const current = `/explore${params.toString() ? `?${params.toString()}` : ""}`;
    if (next !== current) router.replace(next, { scroll: false });
  }, [filters, sort, router, params]);

  const patch = useCallback(
    (p: Partial<ExploreFilters>) => setFilters((f) => ({ ...f, ...p })),
    [],
  );
  const reset = useCallback(
    () => setFilters({ ...EmptyFilters(), q: filters.q }),
    [filters.q],
  );

  /* حالت بارگذاری کوتاه، هنگام تغییر فیلترها */
  const filterKey = JSON.stringify(filters) + sort + retry;
  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), 280);
    return () => window.clearTimeout(id);
  }, [filterKey]);

  const results = useMemo(() => {
    const list = filterSpecialists(filters);
    return sortSpecialists(list, sort, today);
  }, [filters, sort, today]);

  const errored = filters.demo === "error";
  const activeCount = countActive(filters);
  const totalServicesForCats = filters.cats.length
    ? services.filter((s) => filters.cats.includes(s.categoryId)).length
    : services.length;

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 pt-2 sm:px-6 lg:px-10">
      <header className="mb-6">
        <span className="eyebrow">کاوش لومرا</span>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-[26px] font-extrabold leading-tight tracking-tight sm:text-[30px]">
              {filters.cats.length === 1
                ? `${categories.find((c) => c.id === filters.cats[0])?.name} در ${filters.city}`
                : "متخصص‌ها و خدمات لومرا"}
            </h1>
            <p className="mt-2 max-w-[48ch] text-[13.5px] leading-relaxed text-muted">
              {faNum(specialists.length)} متخصص فعال در {faNum(6)} شهر، با{" "}
              {faNum(services.length)} خدمت؛ زمان‌های آزاد از تقویم واقعی هر
              متخصص خوانده می‌شود.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[12px]">
            <Badge tone="mint" leading={<IconSparkle size={11} />}>
              {faNum(totalServicesForCats)} خدمت در این انتخاب
            </Badge>
            {todayFreeHint()}
          </div>
        </div>
      </header>

      {/* نوار دسته‌ها */}
      <div className="no-scrollbar w-full min-w-0 flex gap-2 overflow-x-auto px-4 pb-3 sm:px-0">
        <Chip
          active={!filters.cats.length}
          onClick={() => patch({ cats: [] })}
          className="shrink-0"
        >
          همه‌ی دسته‌ها
        </Chip>
        {categories.map((c) => (
          <Chip
            key={c.id}
            className="shrink-0"
            active={filters.cats.includes(c.id)}
            onClick={() =>
              patch({
                cats: filters.cats.includes(c.id)
                  ? filters.cats.filter((x) => x !== c.id)
                  : [c.id],
              })
            }
          >
            {c.name}
          </Chip>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[264px_1fr] xl:grid-cols-[300px_1fr]">
        {/* سایدبار دسکتاپ */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-lg border border-line bg-surface p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[14px] font-bold">فیلترها</h2>
              {activeCount ? (
                <Badge tone="violet">{faNum(activeCount)} فعال</Badge>
              ) : null}
            </div>
            <FiltersPanel
              value={filters}
              onChange={patch}
              onReset={reset}
              today={today}
              search={filters.q}
              onSearch={(v) => patch({ q: v })}
              showSearch
            />
          </div>
        </aside>

        <div className="min-w-0">
          {/* نوار ابزار */}
          <div className="sticky top-14 z-30 rounded-md border border-line bg-bg/94 px-3 py-2.5 backdrop-blur-[6px] sm:px-3 lg:top-[76px]">
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <InlineSearch
                  value={filters.q}
                  onChange={(v) => patch({ q: v })}
                  placeholder="نام متخصص، مهارت یا خدمت"
                />
              </div>
              <button
                type="button"
                onClick={() => setSheet("sort")}
                className="flex h-11 shrink-0 items-center gap-1.5 rounded-md border border-line bg-surface px-3 text-[13px] font-semibold text-muted transition-colors hover:text-ink"
              >
                <IconSort size={15} />
                <span className="hidden sm:inline">{sortLabels[sort]}</span>
                <span className="sm:hidden">مرتب‌سازی</span>
              </button>
              <button
                type="button"
                onClick={() => setSheet("filters")}
                className="relative flex h-11 shrink-0 items-center gap-1.5 rounded-md border border-line bg-surface px-3 text-[13px] font-semibold text-muted transition-colors hover:text-ink lg:hidden"
              >
                <IconFilter size={15} />
                فیلتر
                {activeCount ? (
                  <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] font-extrabold text-[#180b26]">
                    {faNum(activeCount)}
                  </span>
                ) : null}
              </button>
            </div>

            {activeCount ? (
              <div className="mt-2.5">
                <ActiveFilterChips
                  value={filters}
                  onRemove={patch}
                  today={today}
                />
              </div>
            ) : null}
          </div>

          {/* نتیجه */}
          <div className="mt-4">
            {errored ? (
              <ErrorState onRetry={() => setRetry((r) => r + 1)} />
            ) : loading ? (
              <>
                <p className="mb-3 text-[12.5px] text-faint">
                  در حال خواندن تقویم متخصص‌ها…
                </p>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }, (_, i) => (
                    <CardSkeleton key={i} />
                  ))}
                </div>
              </>
            ) : results.length ? (
              <>
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[13px] text-muted">
                    <span className="font-bold text-ink">
                      {faNum(results.length)} متخصص
                    </span>{" "}
                    با این شرایط پیدا شد
                  </p>
                  <p className="text-[11.5px] text-faint">
                    مرتب‌سازی: {sortLabels[sort]} · به‌روزرسانی لحظه‌ای ظرفیت
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((sp, i) => (
                    <Reveal
                      key={sp.id}
                      className={cn(i > 5 && "lg:[transition-delay:60ms]")}
                    >
                      <SpecialistCard sp={sp} className="h-full" />
                    </Reveal>
                  ))}
                </div>
                <div className="mt-8 rounded-lg border border-line bg-surface p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-bold">
                        نتیجه‌ی دلخواهت را پیدا نکردی؟
                      </h3>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                        یک شرط را بردار؛ مثلاً سقف قیمت را بالا ببر یا شهر را
                        «همه» کن.
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="outline"
                        size="md"
                        leading={<IconRefresh size={15} />}
                        onClick={reset}
                      >
                        حذف فیلترها
                      </Button>
                      <LinkButton
                        href="/services"
                        size="md"
                        variant="ghost"
                        trailing={<IconArrow size={14} />}
                      >
                        مرور خدمات
                      </LinkButton>
                    </div>
                  </div>
                  <TrendingRow className="mt-4 border-t border-line-soft pt-3.5" />
                </div>
              </>
            ) : (
              <EmptyState
                glyph="؟"
                title="نتیجه‌ای پیدا نشد"
                body={
                  <>
                    هیچ متخصصی با این ترکیب از دسته، شهر و تاریخ وقت خالی ندارد.
                    <br />
                    امتحان کن: یک فیلتر را بردار، یا تاریخ را دو روز جابه‌جا کن.
                  </>
                }
                action={{ label: "بازنشانی فیلترها", onClick: reset }}
                secondary={{ label: "دیدن همه‌ی متخصص‌ها", href: "/explore" }}
                note={`جستجوی فعلی: ${filters.q ? `«${filters.q}»` : "—"} · ${filters.city} · ${
                  filters.cats.length
                    ? filters.cats.join("، ")
                    : "همه‌ی دسته‌ها"
                }`}
              />
            )}
          </div>

          {/* لینک دسته‌ها برای موبایل */}
          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:hidden">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/explore?cat=${c.id}`}
                className="flex items-center justify-between rounded-md border border-line bg-surface px-3 py-2.5 text-[13px] font-semibold text-muted transition-colors hover:text-ink"
              >
                {c.name}
                <IconSearch size={14} className="text-faint" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* شیت فیلتر موبایل */}
      <BottomSheet
        open={sheet === "filters"}
        onClose={() => setSheet(null)}
        title="فیلترها"
        description={`${faNum(results.length)} نتیجه با این تنظیمات`}
        bodyMax="72dvh"
        footer={
          <div className="flex gap-2.5">
            <Button variant="outline" block onClick={reset}>
              پاک کردن
            </Button>
            <Button block onClick={() => setSheet(null)}>
              نمایش {faNum(results.length)} نتیجه
            </Button>
          </div>
        }
      >
        <FiltersPanel
          value={filters}
          onChange={patch}
          onReset={reset}
          today={today}
        />
      </BottomSheet>

      {/* شیت مرتب‌سازی */}
      <BottomSheet
        open={sheet === "sort"}
        onClose={() => setSheet(null)}
        title="مرتب‌سازی نتایج"
      >
        <div className="space-y-2" role="radiogroup">
          {SORTS.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={sort === s}
              onClick={() => {
                setSort(s);
                setSheet(null);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-md border px-3.5 py-3 text-start text-[14px] font-semibold transition-colors",
                sort === s
                  ? "border-accent/55 bg-accent/10 text-ink"
                  : "border-line bg-surface text-muted",
              )}
            >
              {sortLabels[s]}
              {sort === s ? (
                <span className="h-2 w-2 rounded-full bg-accent" />
              ) : null}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      tint="rose"
      icon={<IconAlert size={18} className="text-rose" />}
      title="اتصال به سرویس زمان‌بندی برقرار نشد"
      body="ظرفیت لحظه‌ای متخصص‌ها الان قابل خواندن نیست. اطلاعات کش شده‌ی آخرین بازدید نمایش داده می‌شود یا می‌توانی دوباره تلاش کنی."
      action={{ label: "تلاش دوباره", onClick: onRetry }}
      secondary={{ label: "مرور دسته‌ها بدون فیلتر زمان", href: "/services" }}
    />
  );
}

function countActive(f: ExploreFilters) {
  let n = 0;
  if (f.q.trim()) n++;
  n += f.cats.length;
  if (f.city !== "همه") n++;
  if (f.day) n++;
  if (f.minRating) n++;
  if (f.maxPrice < PRICE_MAX) n++;
  if (f.verifiedOnly) n++;
  if (f.freeOnly) n++;
  return n;
}

function todayFreeHint() {
  const today = new Date().toISOString().slice(0, 10);
  const withFree = specialists.filter((sp) => {
    const near = nearestFree(sp, today);
    return near && near.iso === today;
  }).length;
  return (
    <Badge
      tone="neutral"
      leading={<IconSparkle size={11} className="text-mint" />}
    >
      {withFree
        ? `${faNum(withFree)} متخصص امروز وقت خالی دارد`
        : "امروز ظرفیتی نمانده"}
    </Badge>
  );
}

export { ListSkeleton };
