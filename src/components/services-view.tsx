"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { durationLabel, faNum, price } from "@/lib/fa";
import { categories } from "@/data/categories";
import { services } from "@/data/services";
import { specialists } from "@/data/specialists";
import { categoryArt } from "@/lib/images";
import { InlineSearch } from "@/components/search-panel";
import { Chip, Badge } from "@/components/ui/Badge";
import { Img } from "@/components/ui/Image";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { IconArrow, IconClock, IconUsers } from "@/components/icons";

export function ServicesView() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState<"price" | "duration" | "popular">("popular");

  const rows = useMemo(() => {
    const needle = q.trim();
    let list = services.filter((s) => {
      if (cat !== "all" && s.categoryId !== cat) return false;
      if (!needle) return true;
      return s.name.includes(needle) || s.desc.includes(needle);
    });
    list = [...list].sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "duration") return a.minutes - b.minutes;
      return Number(!!b.popular) - Number(!!a.popular) || a.price - b.price;
    });
    return list;
  }, [q, cat, sort]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof services>();
    for (const s of rows)
      map.set(s.categoryId, [...(map.get(s.categoryId) ?? []), s]);
    return [...map.entries()];
  }, [rows]);

  const providerCount = (id: string) =>
    specialists.filter((sp) => sp.serviceIds.includes(id)).length;
  const cheapest = (id: string) => {
    const list = specialists
      .filter((sp) => sp.serviceIds.includes(id))
      .map((sp) => sp.priceFrom);
    return list.length ? Math.min(...list) : null;
  };

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 pb-6 pt-4 sm:px-6 lg:px-10 lg:pt-6">
      <header className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
        <div className="min-w-0">
          <span className="eyebrow">فهرست خدمات</span>
          <h1 className="mt-2.5 text-[24px] font-extrabold leading-tight sm:text-[28px]">
            {faNum(services.length)} خدمت، {faNum(categories.length)} دسته،
            قیمتِ همان‌جا
          </h1>
          <p className="mt-2 max-w-[56ch] text-[13.5px] leading-relaxed text-muted">
            قیمت هر خدمت میانگینِ سالن‌های فعال لومراست. با زدن «دیدن متخصص‌ها»
            مستقیم به همان دسته می‌روید، با فیلتر زمان.
          </p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-3.5">
          <InlineSearch
            value={q}
            onChange={setQ}
            placeholder="جستجو در نام یا توضیح خدمت"
          />
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {(
              [
                { v: "popular", l: "محبوب" },
                { v: "price", l: "ارزان‌ترین" },
                { v: "duration", l: "کوتاه‌ترین" },
              ] as const
            ).map((o) => (
              <Chip
                key={o.v}
                active={sort === o.v}
                onClick={() => setSort(o.v)}
                className="h-7 px-2 text-[12px]"
              >
                {o.l}
              </Chip>
            ))}
          </div>
        </div>
      </header>

      {/* دسته‌ها */}
      <div className="no-scrollbar w-full min-w-0 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:px-0">
        <Chip
          active={cat === "all"}
          onClick={() => setCat("all")}
          className="shrink-0"
        >
          همه ({faNum(services.length)})
        </Chip>
        {categories.map((c) => (
          <Chip
            key={c.id}
            active={cat === c.id}
            onClick={() => setCat(c.id)}
            count={services.filter((s) => s.categoryId === c.id).length}
            className="shrink-0"
          >
            {c.name}
          </Chip>
        ))}
      </div>

      {/* بنر دسته‌ی انتخابی */}
      {cat !== "all" ? (
        <Link
          href={`/explore?cat=${cat}`}
          className="group mt-4 flex items-center gap-4 overflow-hidden rounded-lg border border-line bg-surface"
        >
          <Img
            src={categoryArt[cat as keyof typeof categoryArt].wide}
            alt=""
            className="h-20 w-28 shrink-0 sm:h-24 sm:w-40"
            imgClassName="opacity-70 transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <span className="min-w-0 flex-1 py-3 pe-3">
            <span className="block text-[15px] font-bold">
              {categories.find((c) => c.id === cat)?.name} —{" "}
              {categories.find((c) => c.id === cat)?.blurb}
            </span>
            <span className="mt-1 block text-[12px] text-faint">
              {faNum(specialists.filter((s) => s.categoryId === cat).length)}{" "}
              متخصص فعال در این دسته
            </span>
          </span>
          <span className="me-3 hidden shrink-0 items-center gap-1.5 text-[12.5px] font-bold text-accent sm:inline-flex">
            کاوش
            <IconArrow size={14} />
          </span>
        </Link>
      ) : null}

      {/* فهرست */}
      {rows.length ? (
        <div className="mt-6 space-y-8">
          {grouped.map(([catId, list]) => (
            <section key={catId}>
              <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-line pb-2">
                <h2 className="text-[16px] font-bold">
                  {categories.find((c) => c.id === catId)?.name ?? catId}
                  <span className="ms-2 text-[11.5px] font-medium text-faint">
                    {faNum(list.length)} خدمت
                  </span>
                </h2>
                <Link
                  href={`/explore?cat=${catId}`}
                  className="inline-flex min-h-9 shrink-0 items-center text-[12px] font-semibold text-muted transition-colors hover:text-accent"
                >
                  متخصص‌های این دسته
                </Link>
              </div>
              <ul className="grid gap-2.5 lg:grid-cols-2">
                {list.map((s) => (
                  <li
                    key={s.id}
                    className={cn(
                      "group flex items-start gap-3 rounded-lg border border-line bg-surface p-3.5 transition-colors hover:border-accent/35",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-[14.5px] font-bold">
                          {s.name}
                        </span>
                        {s.popular ? (
                          <Badge tone="violet">پرطرفدار</Badge>
                        ) : null}
                      </span>
                      <span className="mt-1.5 block text-[12.5px] leading-relaxed text-muted">
                        {s.desc}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-faint">
                        <span className="inline-flex items-center gap-1">
                          <IconClock size={12} />
                          {durationLabel(s.minutes)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <IconUsers size={12} />
                          {providerCount(s.id)
                            ? `${faNum(providerCount(s.id))} متخصص`
                            : "در دست بررسی"}
                        </span>
                        {s.includes?.length ? (
                          <span className="text-mint">
                            {faNum(s.includes.length)} مورد شامل قیمت
                          </span>
                        ) : null}
                      </span>
                    </span>
                    <span className="shrink-0 text-end">
                      <span className="block text-[14.5px] font-extrabold tabular-nums">
                        {price(s.price, false)}
                      </span>
                      <span className="block text-[10.5px] text-faint">
                        تومان
                      </span>
                      {cheapest(s.id) ? (
                        <span className="mt-1 block text-[10.5px] text-muted">
                          از {faNum(Math.round(cheapest(s.id)! / 10000))} هزار
                        </span>
                      ) : null}
                      <Link
                        href={`/explore?q=${encodeURIComponent(s.name)}`}
                        className="mt-2 inline-flex h-9 items-center gap-1 rounded-md border border-line px-3 text-[12px] font-semibold text-muted transition-colors hover:border-accent/50 hover:text-ink"
                      >
                        دیدن متخصص‌ها
                        <IconArrow size={12} />
                      </Link>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            glyph="؟"
            title="خدمتی با این نام پیدا نشد"
            body={
              <>
                فهرست خدمات لومرا بر پایه‌ی کاری است که در سالن انجام می‌شود؛
                اگر نام دیگری مد نظرتان است (مثلاً «پاکساز» یا «هیدرافاسیال») آن
                را جستجو کنید.
              </>
            }
            action={{ label: "پاک کردن جستجو", onClick: () => setQ("") }}
            secondary={{ label: "کاوش آزاد", href: "/explore" }}
            note={`«${q}» در دسته‌ی ${categories.find((c) => c.id === cat)?.name ?? "همه"} جستجو شد`}
          />
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-4">
        <p className="max-w-[52ch] text-[13px] leading-relaxed text-muted">
          قیمت‌ها بدون هزینه‌ی جانبی است؛ اگر خدمتی به مواد اضافه نیاز داشته
          باشد، قبل از رزرو به شما گفته می‌شود.
        </p>
        <LinkButton href="/explore" size="md">
          رزرو یک خدمت
        </LinkButton>
      </div>
    </div>
  );
}
