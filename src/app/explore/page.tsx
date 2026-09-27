import { Suspense } from "react";
import type { Metadata } from "next";
import { ExploreView } from "@/components/explore-view";
import { categories } from "@/data/categories";
import type { SortKey } from "@/data";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "کاوش متخصص‌ها",
  description:
    "جستجو و فیلتر متخصص‌های زیبایی و مراقبت بر اساس دسته، شهر، تاریخ، امتیاز، قیمت و وقت خالی.",
};

const ISODATE = /^\d{4}-\d{2}-\d{2}$/;
const SORTS: SortKey[] = [
  "recommended",
  "rating",
  "price-asc",
  "price-desc",
  "nearest",
  "earliest",
];

function parse(sp: URLSearchParams | undefined) {
  const catParam = sp?.getAll("cat").filter(Boolean) ?? [];
  const cats = catParam.filter((c) => categories.some((x) => x.id === c));
  const day = sp?.get("day");
  const rating = Number(sp?.get("rating") ?? "0");
  const max = Number(sp?.get("max") ?? "0");
  const sort = (sp?.get("sort") ?? "recommended") as SortKey;
  const demoParam = sp?.get("demo");
  const demo: "off" | "empty" | "error" =
    demoParam === "empty" || demoParam === "error" ? demoParam : "off";
  return {
    initial: {
      q: sp?.get("q") ?? "",
      cats,
      city: sp?.get("city") ?? "همه",
      day: day && ISODATE.test(day) ? day : null,
      minRating: Number.isFinite(rating) ? rating : 0,
      maxPrice: Number.isFinite(max) && max > 0 ? max : 8000000,
      verifiedOnly: sp?.get("verified") === "1",
      freeOnly: sp?.get("free") === "1",
      demo,
      sort: SORTS.includes(sort) ? sort : "recommended",
    },
  };
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const { initial } = parse(
    new URLSearchParams(
      new URLSearchParams(raw as Record<string, string>).toString(),
    ),
  );
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1240px] space-y-3 px-4 py-6 sm:px-6 lg:px-10">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-11 w-full rounded-md" />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="aspect-[4/5] w-full rounded-lg" />
            ))}
          </div>
        </div>
      }
    >
      <ExploreView initial={initial} />
    </Suspense>
  );
}
