"use client";

import Link from "next/link";
import { faDec, faNum } from "@/lib/fa";
import { HERO_IMG, faces } from "@/lib/images";
import { popularServices } from "@/data/categories";
import { specialists } from "@/data/specialists";
import { serviceById } from "@/data/services";
import { ratingSummary, reviews } from "@/data/reviews";
import { specialistById } from "@/data/specialists";
import { Img } from "@/components/ui/Image";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/Cards";
import { LinkButton } from "@/components/ui/Button";
import { Rating, RatingBars } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { SpecialistCard } from "@/components/specialist-card";
import { CategoryTiles } from "@/components/category-tiles";
import { Hero, TodayCapacityStrip } from "@/components/hero";
import { ServiceCard } from "@/components/service-card";
import {
  IconArrow,
  IconCalendar,
  IconCheckCircle,
  IconChevron,
  IconClock,
  IconQuote,
  IconSearch,
  IconShield,
  IconSparkle,
  IconUsers,
} from "@/components/icons";

const BOOKING_STEPS = [
  {
    n: 1,
    t: "انتخاب خدمت",
    d: "از میان ۴۲ خدمت، دقیقاً همان کاری که می‌خواهی.",
  },
  { n: 2, t: "انتخاب متخصص", d: "مقایسه‌ی امتیاز، نمونه‌کار و قیمت." },
  { n: 3, t: "انتخاب تاریخ", d: "تقویم جلالی با نشانه‌ی ظرفیت هر روز." },
  { n: 4, t: "انتخاب ساعت", d: "فقط زمان‌های واقعاً آزاد نمایش داده می‌شود." },
  { n: 5, t: "ثبت اطلاعات", d: "نام و شماره تماس — همین دو فیلد." },
  { n: 6, t: "تأیید رزرو", d: "کد رزرو و یادآوری شبِ جلسه." },
];

export function HomeView() {
  return (
    <>
      <Hero />
      <TodayCapacityStrip />

      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10">
        {/* ---------- دسته‌ها ---------- */}
        <Reveal className="mt-14 lg:mt-20">
          <SectionHead
            eyebrow="دسته‌های محبوب"
            title="از کجا شروع کنیم؟"
            desc="هر دسته، فهرست خدمات و متخصص‌های همان حوزه را باز می‌کند؛ با فیلتر شهر و تاریخ."
            action={
              <LinkButton
                href="/services"
                size="sm"
                variant="ghost"
                trailing={<IconChevron dir="end" size={14} />}
              >
                همه‌ی خدمات
              </LinkButton>
            }
          />
          <CategoryTiles className="mt-6" />
        </Reveal>

        {/* ---------- متخصص‌های منتخب ---------- */}
        <Reveal className="mt-14 lg:mt-20">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0 max-w-[46ch]">
              <span className="eyebrow mb-2.5">متخصص‌های منتخب</span>
              <h2 className="text-[20px] font-bold leading-[1.4] sm:text-[23px]">
                کاری که امتیازش از روی نظرهای تأییدشده ساخته شده
              </h2>
            </div>
            <div className="hidden shrink-0 items-center gap-2 lg:flex">
              <ScrollArrows target="sp-rail" />
              <LinkButton href="/explore" size="sm" variant="outline">
                کاوش همه‌ی ۱۵ متخصص
              </LinkButton>
            </div>
          </div>

          <div
            id="sp-rail"
            className="no-scrollbar w-full min-w-0 mt-6 flex snap-x-row snap-mandatory gap-3 overflow-x-auto px-4 pb-1 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:px-0"
          >
            {specialists.slice(0, 6).map((sp) => (
              <SpecialistCard
                key={sp.id}
                sp={sp}
                rich
                className="w-[76vw] max-w-[290px] shrink-0 snap-start lg:w-auto lg:max-w-none"
              />
            ))}
            <div className="flex w-[76vw] max-w-[290px] shrink-0 snap-start flex-col justify-between rounded-lg border border-line bg-surface p-4 lg:w-auto lg:max-w-none">
              <div>
                <IconSparkle size={20} className="text-accent" />
                <p className="mt-3 text-[15px] font-bold leading-snug">
                  هنوز متخصص موردنظرت را پیدا نکرده‌ای؟
                </p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
                  با فیلترهای قیمت، امتیاز، فاصله و وقت خالی، نتیجه را در سه شرط
                  کوتاه کن.
                </p>
              </div>
              <LinkButton href="/explore" size="md" block className="mt-4">
                باز کردن کاوش
              </LinkButton>
            </div>
          </div>
        </Reveal>

        {/* ---------- خدمات پرطرفدار ---------- */}
        <Reveal className="mt-14 lg:mt-20">
          <SectionHead
            eyebrow="پرطرفدارترین‌ها"
            title="خدماتی که این هفته بیشتر رزرو می‌شوند"
            size="md"
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {popularServices.slice(0, 6).map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-faint">
            <span>
              قیمت‌ها توافقی نیست؛ همان عددی است که در سالن پرداخت می‌کنی.
            </span>
            <Link
              href="/services"
              className="inline-flex items-center gap-1 font-bold text-accent"
            >
              همه‌ی خدمات
              <IconArrow size={13} />
            </Link>
          </div>
        </Reveal>

        {/* ---------- چیدمان ویراستاری: نقل‌قول + تصویر ---------- */}
        <Reveal className="mt-16 lg:mt-24">
          <div className="grid items-center gap-6 rounded-lg border border-line bg-surface p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:p-0 lg:pr-8">
            <div className="min-w-0">
              <span className="text-faint">
                <IconQuote size={22} />
              </span>
              <p className="mt-3 text-[19px] font-bold leading-[1.65] tracking-tight sm:text-[23px] lg:text-[26px]">
                «قبل از آن‌که یک وقت خالی نشان‌تان بدهیم، بررسی می‌کنیم که آن
                ساعت واقعاً برای پوست شما مناسب است.»
              </p>
              <div className="mt-5 flex items-center gap-3">
                <Avatar
                  name="نیلفار رستمی"
                  face={faces.p1}
                  category="skin"
                  size="md"
                  tint="violet"
                />
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-bold">
                    نیلفار رستمی
                  </span>
                  <span className="block truncate text-[11.5px] text-faint">
                    متخصص پوست · ۹ سال سابقه · تهران
                  </span>
                </span>
              </div>
            </div>
            <Img
              src={HERO_IMG}
              alt="فضای استودیوی پوست"
              position="60% 40%"
              className="aspect-[4/3] w-full rounded-md border border-line lg:aspect-[3/2] lg:rounded-none lg:border-0 lg:border-s lg:border-line"
            />
          </div>
        </Reveal>

        {/* ---------- سه دلیل لومرا ---------- */}
        <Reveal className="mt-14 lg:mt-20">
          <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
            <Reason
              icon={<IconCheckCircle size={18} />}
              title="زمان‌های واقعی، نه تبلیغاتی"
              body="ظرفیت هر ساعت از تقویم متخصص خوانده می‌شود؛ اگر پر باشد، همان‌جا می‌بینید."
            />
            <Reason
              icon={<IconShield size={18} />}
              title="نظرهای تأییدشده"
              body="فقط کسی امتیاز می‌دهد که رزرو «انجام شده» داشته باشد. رتبه بدون رزرو ثبت نمی‌شود."
            />
            <Reason
              icon={<IconUsers size={18} />}
              title="شفافیت قیمت"
              body="قیمت خدمت، مدت و گزینه‌های پرداخت در محل، پیش از ورود به فرم رزرو مشخص است."
            />
          </div>
        </Reveal>

        {/* ---------- نظرات ---------- */}
        <HomeReviews />

        {/* ---------- مراحل رزرو ---------- */}
        <Reveal className="mt-14 lg:mt-20">
          <SectionHead
            eyebrow="رزرو در شش گام"
            title="مسیری کوتاه، بدون فرم‌های اضافه"
            desc="روی موبایل هر گام یک صفحه‌ی مستقل است؛ روی دسکتاپ در همان پنجره پیش می‌رود."
            action={
              <LinkButton
                href={`/booking/${specialists[0]!.id}`}
                size="md"
                trailing={<IconArrow size={15} />}
              >
                امتحان کردن Flow
              </LinkButton>
            }
          />
          <ol className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {BOOKING_STEPS.map((s) => (
              <li
                key={s.n}
                className="group flex gap-3 rounded-lg border border-line bg-surface p-3.5 transition-colors hover:border-accent/40"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-line bg-surface-2 text-[12px] font-extrabold text-accent tabular-nums">
                  {faNum(s.n)}
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-bold">{s.t}</span>
                  <span className="mt-1 block text-[12.5px] leading-relaxed text-muted">
                    {s.d}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* ---------- فراخوان پایانی ---------- */}
        <Reveal className="mt-14 lg:mt-20">
          <div className="relative overflow-hidden rounded-lg border border-accent/25 bg-surface px-5 py-8 sm:px-8 sm:py-10">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-28 -end-20 h-64 w-64 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(201,108,255,0.16), transparent)",
              }}
            />
            <div className="relative flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 max-w-[48ch]">
                <span className="eyebrow mb-3">قدم بعدی</span>
                <h2 className="text-[21px] font-extrabold leading-[1.45] sm:text-[26px]">
                  یک جستجوی سه‌شرطی، نوبت فردای شما را تعیین می‌کند.
                </h2>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">
                  خدمت، شهر و تاریخ را وارد کنید؛ بقیه‌اش با فیلترهای لومرا در
                  دو دقیقه انجام می‌شود.
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-auto sm:flex-row">
                <LinkButton
                  href="/explore"
                  size="lg"
                  leading={<IconSearch size={16} />}
                >
                  شروع جستجو
                </LinkButton>
                <LinkButton href="/specialists/sp1" size="lg" variant="outline">
                  نمونه پروفایل متخصص
                </LinkButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}

function Reason({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-surface p-4 transition-colors hover:bg-surface/85 sm:p-5">
      <span className="inline-grid h-9 w-9 place-items-center rounded-md border border-line bg-surface-2 text-accent">
        {icon}
      </span>
      <h3 className="mt-3 text-[15px] font-bold leading-snug">{title}</h3>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function HomeReviews() {
  const top = reviews
    .filter((r) => r.verifiedVisit && r.rating >= 5)
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 6);
  const summary = ratingSummary("sp1");
  const total = reviews.length;

  return (
    <Reveal className="mt-14 lg:mt-20">
      <SectionHead
        eyebrow="نظرها"
        title="تجربه‌ی مراجعه‌کننده‌ها"
        desc={`در نسخه‌ی نمایشی لومرا ${faNum(total)} نظر ثبت شده که تنها نظرهای دارای رزرو تأییدشده منتشر می‌شوند.`}
        action={
          <LinkButton
            href="/specialists/sp1#reviews"
            size="sm"
            variant="ghost"
            trailing={<IconChevron dir="end" size={14} />}
          >
            دیدن همه‌ی نظرها
          </LinkButton>
        }
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="rounded-lg border border-line bg-surface p-4">
          <div className="flex items-end gap-3">
            <span className="text-[34px] font-extrabold leading-none tracking-tight">
              {faDec(summary.average)}
            </span>
            <span className="pb-1">
              <Rating value={summary.average} size="md" showValue={false} />
              <span className="mt-1 block text-[11.5px] text-faint">
                {faNum(summary.total)} نظر
              </span>
            </span>
          </div>
          <div className="mt-4">
            <RatingBars
              buckets={summary.buckets}
              total={summary.total}
              average={summary.average}
            />
          </div>
          <p className="mt-4 flex items-center gap-1.5 border-t border-line-soft pt-3 text-[11.5px] text-mint">
            <IconCheckCircle size={13} />
            {faNum(summary.recommend)}٪ کاربران دوباره رزرو می‌کنند
          </p>
        </div>

        <div
          className="no-scrollbar w-full min-w-0 flex snap-x-row snap-mandatory gap-3 overflow-x-auto px-4 pb-1 lg:grid lg:grid-cols-2 lg:gap-4 lg:overflow-visible lg:px-0"
          id="rv-rail"
        >
          {top.map((r) => {
            const sp = specialistById[r.specialistId];
            return (
              <Link
                key={r.id}
                href={`/specialists/${sp?.id ?? ""}`}
                className="flex w-[82vw] max-w-[360px] shrink-0 snap-start flex-col rounded-lg border border-line bg-surface p-4 transition-colors hover:border-accent/35 lg:w-auto lg:max-w-none"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar
                    name={r.author}
                    size="sm"
                    tint="mint"
                    category={sp?.categoryId ?? "care"}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold">{r.author}</p>
                    <p className="truncate text-[11px] text-faint">
                      {serviceById[r.serviceId]?.name ?? "خدمت"}
                    </p>
                  </div>
                  <Rating value={r.rating} size="sm" showValue={false} />
                </div>
                <p className="mt-3 line-clamp-4 text-[13px] leading-[1.9] text-muted">
                  «{r.text}»
                </p>
                <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-[11px] text-faint">
                  <span>{sp?.name}</span>
                  <span className="inline-flex items-center gap-1">
                    <IconClock size={11} />
                    {faNum(r.likeCount)} نفر مفید دانستند
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}

function ScrollArrows({ target }: { target: string }) {
  return (
    <>
      <button
        type="button"
        aria-label="قبلی"
        onClick={() => moveRail(target, 1)}
        className="grid h-9 w-9 place-items-center rounded-md border border-line bg-surface text-muted transition-colors hover:text-ink"
      >
        <IconChevron dir="start" size={15} />
      </button>
      <button
        type="button"
        aria-label="بعدی"
        onClick={() => moveRail(target, -1)}
        className="grid h-9 w-9 place-items-center rounded-md border border-line bg-surface text-muted transition-colors hover:text-ink"
      >
        <IconChevron dir="end" size={15} />
      </button>
    </>
  );
}

function moveRail(id: string, direction: number) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
}
