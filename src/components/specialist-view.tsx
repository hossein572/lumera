"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import {
  durationLabel,
  faNum,
  price,
  relativeDay,
  timeLabel,
  toISO,
} from "@/lib/fa";
import { useToday } from "@/hooks/use-today";
import { categoryArt, faces, tints } from "@/lib/images";
import { daySlots, freeCount, nearestFree } from "@/data/slots";
import { reviewsFor } from "@/data/reviews";
import type { Service, Specialist } from "@/data/types";
import { useLumera } from "@/store/useLumera";
import { servicesOf, distanceLabel, firstFree } from "@/lib/specialist";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, InfoNote, VerifiedBadge } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { Img } from "@/components/ui/Image";
import { Rating } from "@/components/ui/Rating";
import { BottomSheet } from "@/components/ui/Overlay";
import { Tabs, TabPanel } from "@/components/ui/Tabs";
import { MetaRow } from "@/components/ui/Cards";
import { EmptyState } from "@/components/ui/EmptyState";
import { ServiceCard } from "@/components/service-card";
import { WorkGallery } from "@/components/work-gallery";
import { ReviewsBlock } from "@/components/reviews-block";
import { BookingWizard } from "@/components/booking-wizard";
import { FavoriteButton } from "@/components/favorite-button";
import {
  IconArrow,
  IconCalendar,
  IconCheck,
  IconCheckCircle,
  IconClock,
  IconGlobe,
  IconImage,
  IconInstagram,
  IconLink,
  IconMessage,
  IconPin,
  IconShield,
  IconSparkle,
  IconStar,
  IconUsers,
} from "@/components/icons";

type Tab = "services" | "work" | "reviews" | "about";

export function SpecialistView({ sp }: { sp: Specialist }) {
  const router = useRouter();
  const today = useToday();
  const [tab, setTab] = useState<Tab>("services");
  const [sheet, setSheet] = useState(false);
  const [prefill, setPrefill] = useState<string | null>(null);
  const push = useLumera((s) => s.pushToast);
  const setDraft = useLumera((s) => s.setDraft);
  const setStep = useLumera((s) => s.setStep);

  const services = servicesOf(sp);
  const art = categoryArt[sp.categoryId];
  const face = sp.face ? faces[sp.face] : null;
  const tone = tints[sp.tint];
  const near = useMemo(() => nearestFree(sp, today), [sp, today]);
  const freeToday = useMemo(
    () => daySlots(sp, today).filter((s) => s.state === "free").length,
    [sp, today],
  );
  const reviewCount = useMemo(() => reviewsFor(sp.id).length, [sp.id]);
  const ff = useMemo(() => firstFree(sp, today), [sp, today]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (
      hash !== "reviews" &&
      hash !== "work" &&
      hash !== "services" &&
      hash !== "about"
    )
      return;
    const t = window.setTimeout(() => {
      setTab(hash as Tab);
      const el = document.getElementById("sp-tabs");
      if (el) window.scrollTo({ top: el.offsetTop - 90, behavior: "smooth" });
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  function openBooking(serviceId?: string) {
    const sid = serviceId ?? sp.serviceIds[0] ?? null;
    setPrefill(sid);
    setDraft({ specialistId: sp.id, serviceId: sid, date: null, time: null });
    setStep(sid ? 2 : 0);
    setSheet(true);
  }

  return (
    <div className="min-w-0 pb-24 lg:pb-0">
      {/* -------------------------- کاور -------------------------- */}
      <section className="relative">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10">
          <div className="relative mt-1 overflow-hidden rounded-lg border border-line">
            <Img
              src={art.wide}
              alt={`فضای ${sp.studio}`}
              eager
              className="aspect-[16/10] w-full sm:aspect-[21/9] lg:aspect-[21/8]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(13,11,16,0.96),rgba(13,11,16,0.5)_45%,rgba(13,11,16,0.15))]"
            />
            <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2 sm:inset-x-4 sm:top-4">
              <span className="flex flex-wrap gap-1.5">
                <Badge tone="neutral" className="bg-bg/70 backdrop-blur-[2px]">
                  {sp.studio}
                </Badge>
                {freeToday > 0 ? (
                  <Badge
                    tone="mint"
                    className="bg-bg/70 backdrop-blur-[2px]"
                    leading={<IconSparkle size={11} />}
                  >
                    {faNum(freeToday)} وقت آزاد امروز
                  </Badge>
                ) : null}
              </span>
              <FavoriteButton
                id={sp.id}
                name={sp.name}
                variant="solid"
                className="h-10 w-10 bg-bg/70 backdrop-blur-[2px]"
                size={19}
              />
            </div>
          </div>

          {/* -------------------------- سربرگ -------------------------- */}
          <div className="-mt-8 grid gap-4 px-1 sm:-mt-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:gap-8 lg:px-0">
            <div className="min-w-0">
              <div className="flex items-end gap-3.5">
                <span className="relative shrink-0 rounded-full border-4 border-bg">
                  <Avatar
                    name={sp.name}
                    face={face}
                    category={sp.categoryId}
                    tint={sp.tint}
                    size="xl"
                  />
                </span>
                <div className="min-w-0 pb-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-[22px] font-extrabold leading-tight tracking-tight sm:text-[26px]">
                      {sp.name}
                    </h1>
                    {sp.verified ? (
                      <VerifiedBadge />
                    ) : (
                      <Badge tone="amber">در انتظار تأیید</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-[13px] text-muted sm:text-[13.5px]">
                    {sp.title}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                <Rating value={sp.rating} size="lg" count={sp.reviews} />
                <MetaRow
                  items={[
                    <span key="v" className="inline-flex items-center gap-1">
                      <IconUsers size={13} className="text-faint" />
                      {faNum(sp.visits)} مراجعه
                    </span>,
                    <span key="y" className="inline-flex items-center gap-1">
                      <IconShield size={13} className="text-faint" />
                      {faNum(sp.years)} سال تجربه
                    </span>,
                    <span key="c" className="inline-flex items-center gap-1">
                      <IconPin size={13} className="text-faint" />
                      {sp.city} · {sp.district}
                    </span>,
                  ]}
                />
              </div>
            </div>

            {/* کارت کنش‌ها */}
            <div className="rounded-lg border border-line bg-surface p-3.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[11.5px] text-faint">
                  شروع قیمت خدمات
                </span>
                <span className="text-[17px] font-extrabold tabular-nums">
                  {price(sp.priceFrom, false)}
                  <span className="ms-1 text-[10.5px] font-medium text-faint">
                    تومان
                  </span>
                </span>
              </div>
              <div className="mt-2.5 flex items-center gap-2 rounded-md border border-line-soft bg-bg-2/70 px-2.5 py-2 text-[12px]">
                <IconClock size={13} className="shrink-0 text-mint" />
                <span className="min-w-0 truncate">
                  {ff ? (
                    <>
                      اولین وقت خالی:{" "}
                      <span className="font-bold text-ink">
                        {relativeDay(ff.iso)} {timeLabel(ff.time)}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted">
                      در دو هفته‌ی آینده ظرفیتی نمانده
                    </span>
                  )}
                </span>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <Button
                  block
                  size="lg"
                  onClick={() => openBooking()}
                  disabled={!near}
                  leading={<IconCalendar size={16} />}
                >
                  {near ? "رزرو نوبت" : "ظرفیت پر است"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-12 shrink-0 px-0"
                  aria-label="ارسال پیام به متخصص"
                  onClick={() =>
                    push({
                      text: "گفت‌وگوي درون‌برنامه‌ای در این نسخه فعال نیست؛ شماره‌ی پشتیبانی لومرا: ۰۲۱۱۰۰۰۰۰",
                      tone: "neutral",
                    })
                  }
                >
                  <IconMessage size={17} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-12 shrink-0 px-0"
                  aria-label="کپی لینک پروفایل"
                  onClick={() => {
                    void navigator.clipboard?.writeText(
                      `${window.location.origin}/specialists/${sp.id}`,
                    );
                    push({ text: "لینک پروفایل کپی شد", tone: "success" });
                  }}
                >
                  <IconLink size={17} />
                </Button>
              </div>
              <p className="mt-2.5 text-[11px] leading-relaxed text-faint">
                پاسخ‌گویی معمولاً ظرف {faNum(sp.responseMinutes)} دقیقه · لغو
                رایگان تا ۲۴ ساعت قبل
              </p>
            </div>
          </div>

          {/* -------------------------- مهارت‌ها -------------------------- */}
          <div className="no-scrollbar w-full min-w-0 mt-5 flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
            {sp.skills.map((s) => (
              <span
                key={s}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border px-3 text-[12.5px] font-semibold"
                style={{
                  borderColor: tone.border,
                  color: tone.fg,
                  background: tone.bg,
                }}
              >
                <IconCheck size={11} strokeWidth={2.6} />
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------- تب‌ها -------------------------- */}
      <div
        id="sp-tabs"
        className="mx-auto mt-7 w-full max-w-[1240px] px-4 sm:px-6 lg:mt-9 lg:px-10"
      >
        <Tabs
          ariaLabel="بخش‌های پروفایل"
          value={tab}
          onChange={setTab}
          items={[
            {
              value: "services",
              label: "خدمات",
              count: services.length,
              icon: <IconSparkle size={14} />,
            },
            {
              value: "work",
              label: "نمونه‌کار",
              count: 6,
              icon: <IconImage size={14} />,
            },
            {
              value: "reviews",
              label: "نظرات",
              count: reviewCount,
              icon: <IconStar size={14} />,
            },
            { value: "about", label: "درباره", icon: <IconUsers size={14} /> },
          ]}
        />

        <div className="py-6 lg:py-8">
          {tab === "services" ? (
            <TabPanel>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="max-w-[52ch] text-[13px] leading-relaxed text-muted">
                  {faNum(services.length)} خدمت با مدت و قیمت نهایی. هزینه‌ی
                  جانبی (مثلاً مواد اضافه) در توضیح خدمت نوشته شده است.
                </p>
                <LinkButton href="/services" size="sm" variant="ghost">
                  مقایسه با همه‌ی خدمات لومرا
                </LinkButton>
              </div>
              <div className="grid gap-3">
                {services.map((s) => (
                  <ServiceCard
                    key={s.id}
                    service={s}
                    onSelect={() => openBooking(s.id)}
                  />
                ))}
              </div>
              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                <InfoNote
                  tone="mint"
                  icon={<IconCheckCircle size={14} className="text-mint" />}
                >
                  پرداخت در محل فعال است؛ مبلغ در اپ فقط رزرو را قفل می‌کند.
                </InfoNote>
                <InfoNote
                  tone="violet"
                  icon={<IconClock size={14} className="text-accent" />}
                >
                  برای خدمات بالای ۹۰ دقیقه، یک فاصله‌ی ۱۵ دقیقه‌ای بین نوبت‌ها
                  لحاظ می‌شود.
                </InfoNote>
              </div>
            </TabPanel>
          ) : null}

          {tab === "work" ? (
            <TabPanel>
              <WorkGallery
                categoryId={sp.categoryId}
                title={sp.name}
                count={6}
              />
            </TabPanel>
          ) : null}

          {tab === "reviews" ? (
            <TabPanel>
              {reviewCount ? (
                <ReviewsBlock
                  specialistId={sp.id}
                  specialistName={sp.name}
                  tint={sp.tint}
                  categoryId={sp.categoryId}
                />
              ) : (
                <EmptyState
                  compact
                  tint="mint"
                  glyph="✦"
                  title="هنوز نظری ثبت نشده"
                  body="این متخصص تازه به لومرا پیوسته است. بعد از اولین جلسه، نظرت را همین‌جا ثبت کن."
                  action={{
                    label: "رزرو اولین نوبت",
                    onClick: () => openBooking(),
                  }}
                />
              )}
            </TabPanel>
          ) : null}

          {tab === "about" ? (
            <TabPanel>
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div className="min-w-0 space-y-6">
                  <div>
                    <span className="eyebrow mb-3">
                      درباره‌ی {sp.name.split(" ")[0]}
                    </span>
                    <p className="text-[15px] leading-[2.05] text-muted sm:text-[16px]">
                      {sp.bio}
                    </p>
                  </div>

                  <figure
                    className="rounded-lg border border-line bg-surface p-4 sm:p-5"
                    style={{ borderColor: tone.border }}
                  >
                    <IconQuoteLite />
                    <blockquote className="mt-2 text-[16px] font-bold leading-[1.85] sm:text-[18px]">
                      «{sp.philosophy}»
                    </blockquote>
                    <figcaption className="mt-2.5 text-[11.5px] text-faint">
                      اصل کاری — از گفت‌وگوی لومرا با {sp.name}
                    </figcaption>
                  </figure>

                  <div>
                    <h3 className="mb-3 text-[15px] font-bold">
                      آنچه در جلسه رعایت می‌شود
                    </h3>
                    <ul className="space-y-2.5">
                      {sp.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex items-start gap-2.5 rounded-md border border-line-soft bg-surface px-3 py-2.5 text-[13px] leading-relaxed"
                        >
                          <IconCheck
                            size={13}
                            className="mt-[4px] shrink-0 text-mint"
                            strokeWidth={2.6}
                          />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 text-[15px] font-bold">
                      تحصیلات و دوره‌ها
                    </h3>
                    <ol className="relative space-y-4 border-s border-line ps-4">
                      {sp.education.map((e, i) => (
                        <li key={i} className="relative">
                          <span
                            className="absolute -start-[21px] top-1.5 h-2 w-2 rounded-full border border-bg"
                            style={{ background: tone.fg }}
                          />
                          <p className="text-[13.5px] font-bold">{e.title}</p>
                          <p className="mt-0.5 text-[12px] text-muted">
                            {e.org} · {e.year}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <aside className="space-y-3">
                  <div className="rounded-lg border border-line bg-surface p-4">
                    <h3 className="text-[13px] font-bold">
                      امکانات {sp.studio}
                    </h3>
                    <ul className="mt-3 space-y-2 text-[12.5px] text-muted">
                      {sp.amenities.map((a) => (
                        <li key={a} className="flex items-start gap-2">
                          <IconCheck
                            size={12}
                            className="mt-1 shrink-0 text-accent"
                          />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-line bg-surface p-4">
                    <h3 className="text-[13px] font-bold">محل فعالیت</h3>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                      {sp.address}
                    </p>
                    <p className="mt-2 text-[11.5px] text-faint">
                      {distanceLabel(sp)} تا مرکز شهر شما
                    </p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(sp.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-[12.5px] font-semibold transition-colors hover:bg-surface-2"
                    >
                      <IconPin size={13} />
                      مسیریابی
                    </a>
                  </div>
                  <div className="rounded-lg border border-line bg-surface p-4">
                    <h3 className="text-[13px] font-bold">زبان‌ها و شبکه‌ها</h3>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {sp.languages.map((l) => (
                        <Badge key={l} tone="neutral">
                          {l}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3 space-y-2 text-[12.5px]">
                      {sp.social.instagram ? (
                        <Link
                          href={`https://instagram.com/${sp.social.instagram}`}
                          className="flex items-center gap-2 text-muted transition-colors hover:text-ink"
                        >
                          <IconInstagram size={14} />@{sp.social.instagram}
                        </Link>
                      ) : null}
                      {sp.social.site ? (
                        <Link
                          href={`https://${sp.social.site}`}
                          className="flex items-center gap-2 text-muted transition-colors hover:text-ink"
                        >
                          <IconGlobe size={14} />
                          {sp.social.site}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                  <div className="rounded-lg border border-line bg-surface p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[13px] font-bold">
                        ظرفیت ۵ روز آینده
                      </h3>
                      <IconCalendar size={14} className="text-faint" />
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {Array.from({ length: 5 }, (_, i) => {
                        const d = new Date(today);
                        d.setDate(d.getDate() + i);
                        const iso = toISO(d);
                        const free = freeCount(sp, iso);
                        return (
                          <li
                            key={iso}
                            className="flex items-center gap-2 text-[12px]"
                          >
                            <span className="w-16 shrink-0 text-muted">
                              {relativeDay(iso)}
                            </span>
                            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
                              <span
                                className={cn(
                                  "block h-full rounded-full",
                                  free ? "bg-mint/70" : "bg-transparent",
                                )}
                                style={{
                                  width: `${Math.min(100, free * 18)}%`,
                                }}
                              />
                            </span>
                            <span
                              className={cn(
                                "w-9 shrink-0 text-end tabular-nums",
                                free ? "text-mint" : "text-faint",
                              )}
                            >
                              {free ? faNum(free) : "پر"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </aside>
              </div>
            </TabPanel>
          ) : null}
        </div>

        <Link
          href={`/explore?cat=${sp.categoryId}`}
          className="mb-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted transition-colors hover:text-ink lg:mb-6"
        >
          <IconArrow size={13} />
          دیدن متخصص‌های مشابه در دسته‌ی {categoryNameOf(sp.categoryId)}
        </Link>
      </div>

      {/* CTA چسبان موبایل */}
      <div className="fixed inset-x-0 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] z-45 border-t border-line bg-bg-2/97 px-3.5 py-2.5 backdrop-blur-[6px] lg:hidden">
        <div className="flex items-center gap-2.5">
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[11.5px] text-faint">
              {services[0] ? services[0].name : sp.title} ·{" "}
              {services[0] ? durationLabel(services[0].minutes) : ""}
            </span>
            <span className="mt-0.5 block text-[14px] font-extrabold tabular-nums">
              {near
                ? `از ${price(sp.priceFrom, false)} تومان`
                : "بدون وقت خالی"}
            </span>
          </span>
          <Button size="lg" onClick={() => openBooking()} disabled={!near}>
            رزرو
          </Button>
        </div>
      </div>

      {/* شیت رزرو — همان Flow، داخل پروفایل */}
      <BookingSheetHost
        open={sheet}
        onClose={() => setSheet(false)}
        sp={sp}
        prefill={prefill}
        onBooked={(id) => {
          setSheet(false);
          router.push(`/booking/success?id=${id}`);
        }}
      />
    </div>
  );
}

function serviceName(sp: Specialist, id: string) {
  return servicesOf(sp).find((s) => s.id === id)?.name ?? "خدمت";
}

/** میزبان شیت رزرو: پیش از باز شدن، خدمت پیش‌انتخاب و گام مناسب ست می‌شود */
function BookingSheetHost({
  open,
  onClose,
  sp,
  prefill,
  onBooked,
}: {
  open: boolean;
  onClose: () => void;
  sp: Specialist;
  prefill: string | null;
  onBooked: (id: string) => void;
}) {
  const setDraft = useLumera((s) => s.setDraft);
  const setStep = useLumera((s) => s.setStep);
  useEffect(() => {
    if (!open) return;
    setDraft({
      specialistId: sp.id,
      serviceId: prefill ?? sp.serviceIds[0] ?? null,
      date: null,
      time: null,
    });
    setStep(prefill || sp.serviceIds.length ? (prefill ? 2 : 0) : 0);
  }, [open, prefill, sp, setDraft, setStep]);

  if (!open) return null;
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="رزرو سریع"
      description={`${sp.name} · ${prefill ? serviceName(sp, prefill) : "انتخاب خدمت و زمان"}`}
      bodyMax="82dvh"
    >
      <BookingWizard specialistId={sp.id} inSheet onBooked={onBooked} />
    </BottomSheet>
  );
}

function categoryNameOf(id: string) {
  return (
    (
      {
        skin: "پوست",
        hair: "مو",
        nails: "ناخن",
        makeup: "میکاپ",
        care: "مراقبت",
        massage: "ماساژ",
      } as Record<string, string>
    )[id] ?? id
  );
}

function IconQuoteLite() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-accent"
    >
      <path
        d="M10 7 6 12l4 5M17 7l-4 5 4 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
