import Link from "next/link";
import { cn } from "@/lib/cn";
import { categories } from "@/data/categories";
import { categoryArt } from "@/lib/images";
import { faNum } from "@/lib/fa";
import { Img } from "@/components/ui/Image";
import { IconArrow } from "@/components/icons";

/**
 * دسته‌ها به‌شکل یک کلاژ ویراستاری‌شده — نه آیکن‌گرید.
 * موبایل: یک بنر عریض + چهار قاب؛ دسکتاپ: چیدمان نامتقارن با ارتفاع‌های متفاوت.
 */
export function CategoryTiles({ className }: { className?: string }) {
  const [hero, ...rest] = categories;
  const heroArt = categoryArt[hero.id];

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4 lg:grid-rows-[repeat(2,minmax(0,1fr))]",
        className,
      )}
    >
      <Link
        href={`/explore?cat=${hero.id}`}
        className="group relative col-span-2 overflow-hidden rounded-lg border border-line lg:col-span-2 lg:row-span-2"
      >
        <Img
          src={heroArt.wide}
          alt={hero.name}
          eager
          className="aspect-[16/10] w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.03] lg:h-full lg:aspect-auto"
        />
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(13,11,16,0.94),rgba(13,11,16,0.35)_55%,rgba(13,11,16,0.05))]" />
        <span className="absolute inset-x-4 bottom-4 start-4 max-w-[85%] lg:inset-x-6 lg:bottom-6 lg:max-w-[60%]">
          <span className="flex items-center gap-2 text-[11.5px] font-semibold text-accent">
            <span className="h-px w-5 bg-accent" />
            محبوب‌ترین دسته
          </span>
          <span className="mt-2 block text-[22px] font-extrabold leading-tight lg:text-[30px]">
            {hero.name}
          </span>
          <span className="mt-1.5 block text-[12.5px] leading-relaxed text-muted lg:text-[13.5px]">
            {hero.blurb}
          </span>
          <span className="mt-3 flex items-center gap-3 text-[11.5px] text-faint">
            <span>{faNum(hero.serviceCount)} خدمت</span>
            <span aria-hidden>·</span>
            <span>{faNum(hero.specialistCount)} متخصص فعال</span>
            <span className="inline-flex items-center gap-1 font-bold text-ink transition-transform duration-200 group-hover:-translate-x-1 lg:ms-2">
              کاوش
              <IconArrow dir="end" size={13} />
            </span>
          </span>
        </span>
      </Link>

      {rest.map((c, i) => {
        const art = categoryArt[c.id];
        const wide = i === rest.length - 1;
        return (
          <Link
            key={c.id}
            href={`/explore?cat=${c.id}`}
            className={cn(
              "group relative overflow-hidden rounded-lg border border-line",
              wide && "col-span-2 lg:col-span-2",
            )}
          >
            <Img
              src={wide ? art.wide : art.tile}
              alt={c.name}
              className={cn(
                "w-full transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]",
                wide ? "aspect-[16/9] lg:aspect-[16/7]" : "aspect-[4/5]",
              )}
            />
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(13,11,16,0.92),rgba(13,11,16,0.28)_60%,transparent)]" />
            <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
              <span className="min-w-0">
                <span className="block truncate text-[16px] font-bold">
                  {c.name}
                </span>
                <span className="mt-0.5 block truncate text-[11.5px] text-muted">
                  {faNum(c.serviceCount)} خدمت
                </span>
              </span>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line/80 bg-bg/60 text-muted transition-colors group-hover:border-accent/60 group-hover:text-accent">
                <IconArrow dir="end" size={13} />
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
