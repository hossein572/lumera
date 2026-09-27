import { Suspense } from "react";
import type { Metadata } from "next";
import { ExploreView } from "@/components/explore-view";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "کاوش متخصص‌ها",
  description:
    "جستجو و فیلتر متخصص‌های زیبایی و مراقبت بر اساس دسته، شهر، تاریخ، امتیاز، قیمت و وقت خالی.",
};

export default function ExplorePage() {
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
      <ExploreView initial={{}} />
    </Suspense>
  );
}
