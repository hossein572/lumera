"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  addDays,
  durationLabel,
  endsAt,
  faNum,
  jDateFull,
  jDateWeekday,
  nearDay,
  price,
  relativeDay,
  timeLabel,
  toISO,
} from "@/lib/fa";
import { useToday } from "@/hooks/use-today";
import { serviceById, services } from "@/data/services";
import type { Draft, Service, Specialist } from "@/data/types";
import { specialistById, specialists } from "@/data/specialists";
import { daySlots, freeCount, nearestFree } from "@/data/slots";
import { bookingRef } from "@/lib/fa";
import { useLumera } from "@/store/useLumera";
import { servicesOf } from "@/lib/specialist";
import { faces, categoryArt } from "@/lib/images";
import {
  Calendar,
  MonthStrip,
  TimeSlots,
  type DayInfo,
} from "@/components/calendar";
import { ServiceOption } from "@/components/service-card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, Chip, InfoNote, Toggle } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { BottomSheet } from "@/components/ui/Overlay";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { Img } from "@/components/ui/Image";
import {
  IconAlert,
  IconArrow,
  IconCalendar,
  IconCheck,
  IconCheckCircle,
  IconChevron,
  IconClock,
  IconLock,
  IconPin,
  IconShield,
  IconSparkle,
  IconUser,
} from "@/components/icons";

export const WIZARD_STEPS = [
  "انتخاب خدمت",
  "انتخاب متخصص",
  "انتخاب تاریخ",
  "انتخاب ساعت",
  "اطلاعات شما",
  "تأیید نهایی",
];

export function BookingWizard({
  specialistId,
  inSheet,
  onBooked,
}: {
  specialistId?: string | null;
  inSheet?: boolean;
  onBooked?: (id: string) => void;
}) {
  const router = useRouter();
  const today = useToday();
  const { draft, step, setDraft, setStep, addBooking, profile, pushToast } =
    useLumera();
  const bookings = useLumera((s) => s.bookings);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    agreed?: string;
  }>({});
  const [specialistSheet, setSpecialistSheet] = useState(false);
  const [maxReached, setMaxReached] = useState(0);

  const sp = specialistById[draft.specialistId ?? specialistId ?? ""] ?? null;
  const service = draft.serviceId ? serviceById[draft.serviceId] : undefined;

  /* پیش‌پرکردن از حساب کاربری، در لحظه‌ی رسیدن به گام اطلاعات (بدون افکت) */
  function go(n: number) {
    const next = Math.max(0, Math.min(5, n));
    if (next === 4) {
      const patch: Partial<Draft> = {};
      if (!draft.name.trim() && profile.name) patch.name = profile.name;
      if (!draft.phone.trim() && profile.phone) patch.phone = profile.phone;
      if (Object.keys(patch).length) setDraft(patch);
    }
    setStep(next);
    setMaxReached((m) => Math.max(m, next));
    if (!inSheet) window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const slots = useMemo(() => {
    if (!sp || !draft.date) return [];
    return daySlots(sp, draft.date, {
      extraTaken: bookings
        .filter(
          (b) =>
            b.specialistId === sp.id &&
            b.date === draft.date &&
            b.status !== "cancelled",
        )
        .map((b) => b.time),
    });
  }, [sp, draft.date, bookings]);

  const dayInfoMap = useMemo(() => {
    const map = new Map<string, DayInfo>();
    if (!sp) return map;
    const base = draft.date ?? today;
    for (let i = -2; i <= 60; i++) {
      const iso = addDays(base, i);
      const list = daySlots(sp, iso);
      map.set(iso, {
        free: list.filter((x) => x.state === "free").length,
        closed: list.length === 0,
      });
    }
    return map;
  }, [sp, draft.date, today]);

  const dayInfo = (iso: string): DayInfo =>
    dayInfoMap.get(iso) ?? { free: 0, closed: true };

  const validity = [
    Boolean(service),
    Boolean(sp),
    Boolean(draft.date),
    Boolean(draft.time),
    Boolean(
      draft.name.trim().length > 2 && /^09\d{9}$/.test(draft.phone.trim()),
    ),
    draft.agreed,
  ];

  const canNext = validity[step];
  const progress = Math.min(5, Math.max(maxReached, step));

  function next() {
    if (!canNext) return;
    if (step === 4) {
      const e: typeof errors = {};
      if (draft.name.trim().length < 3)
        e.name = "نام و نام خانوادگی را کامل بنویسید.";
      if (!/^09\d{9}$/.test(draft.phone.trim()))
        e.phone = "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.";
      setErrors(e);
      if (Object.keys(e).length) return;
    }
    go(step + 1);
  }

  function confirm() {
    if (!sp || !service || !draft.date || !draft.time) return;
    const date = draft.date;
    const time = draft.time;
    setBusy(true);
    window.setTimeout(() => {
      const created = addBooking({
        specialistId: sp.id,
        serviceId: service.id,
        date,
        time,
        price: service.price,
        status: "confirmed",
        note: draft.note.trim() || undefined,
        phone: draft.phone,
        paid: !draft.payAtVenue,
      });
      setBusy(false);
      pushToast({
        text: `رزرو ${created.code} با ${sp.name} ثبت شد`,
        tone: "success",
        action: { label: "مشاهده", href: "/bookings" },
      });
      if (onBooked) onBooked(created.id);
      else router.push(`/booking/success?id=${created.id}`);
    }, 900);
  }

  const footer = (
    <div className="flex items-center gap-2.5">
      {step > 0 ? (
        <Button
          variant="ghost"
          size="lg"
          onClick={() => go(step - 1)}
          aria-label="گام قبل"
          data-wiz="prev"
        >
          <IconChevron dir="start" size={16} />
          قبل
        </Button>
      ) : null}
      {step < 5 ? (
        <Button
          size="lg"
          block
          onClick={next}
          data-wiz="next"
          disabled={!canNext}
          trailing={<IconArrow size={16} />}
          className={cn(!canNext && "opacity-60")}
        >
          {canNext
            ? "ادامه"
            : nextHint(step, {
                service: Boolean(service),
                sp: Boolean(sp),
                date: Boolean(draft.date),
                time: Boolean(draft.time),
              })}
        </Button>
      ) : (
        <Button
          size="lg"
          block
          onClick={confirm}
          data-wiz="confirm"
          loading={busy}
          leading={busy ? undefined : <IconShield size={16} />}
        >
          {busy
            ? "در حال ثبت…"
            : `تأیید و پرداخت در محل · ${price(service?.price ?? 0, false)}`}
        </Button>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        "min-w-0",
        !inSheet && "pb-[calc(9.75rem+env(safe-area-inset-bottom))] lg:pb-8",
      )}
    >
      {!inSheet ? (
        <div className="sticky top-14 z-30 rounded-md border border-line bg-bg/95 px-4 py-3 backdrop-blur-[6px] sm:px-4 lg:top-[72px]">
          <StepIndicator
            steps={WIZARD_STEPS}
            current={step}
            maxReached={progress}
            onJump={(i) => validity.slice(0, i).every(Boolean) && go(i)}
          />
        </div>
      ) : (
        <StepIndicator
          steps={WIZARD_STEPS}
          current={step}
          maxReached={progress}
          onJump={(i) => validity.slice(0, i).every(Boolean) && go(i)}
          compact
          className="mb-4"
        />
      )}

      <div
        className={cn(
          "grid gap-6",
          !inSheet && "lg:grid-cols-[minmax(0,1fr)_320px]",
        )}
      >
        <div className="min-w-0 pt-5">
          {step === 0 ? (
            <StepShell
              n={1}
              eyebrow={
                sp
                  ? `${faNum(servicesOf(sp).length)} خدمتِ ${sp.name}`
                  : undefined
              }
              title="انتخاب خدمت"
              desc={
                sp
                  ? `خدمات ${sp.name} — مدت و قیمت هر خدمت شفاف است.`
                  : "خدمت موردنظرت را انتخاب کن."
              }
            >
              {sp ? (
                <div className="space-y-2">
                  {servicesOf(sp).map((s) => (
                    <ServiceOption
                      key={s.id}
                      service={s}
                      selected={draft.serviceId === s.id}
                      onSelect={(svc) => {
                        setDraft({ serviceId: svc.id });
                        go(1);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <ServicePicker
                  onPick={(id) => {
                    setDraft({ serviceId: id });
                    go(1);
                  }}
                  selected={draft.serviceId}
                />
              )}
            </StepShell>
          ) : null}

          {step === 1 ? (
            <StepShell
              n={2}
              eyebrow="بر اساس خدمت انتخابی"
              title="انتخاب متخصص"
              desc="با توجه به خدمت انتخابی، متخصص‌های فعال این دسته را ببین."
            >
              <div className="space-y-2.5">
                {specialists
                  .filter((s) => {
                    if (!service) return false;
                    return (
                      servicesOf(s).some((x) => x.id === service.id) ||
                      (sp?.id === s.id &&
                        s.categoryId === service.categoryId) ||
                      (!sp && s.categoryId === service.categoryId)
                    );
                  })
                  .slice(0, 8)
                  .map((c) => {
                    const on = draft.specialistId === c.id;
                    const near = nearestFree(c, today);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setDraft({
                            specialistId: c.id,
                            date: null,
                            time: null,
                          });
                          setSpecialistSheet(false);
                          go(2);
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg border p-3 text-start transition-colors",
                          on
                            ? "border-accent/60 bg-[rgba(201,108,255,0.07)]"
                            : "border-line bg-surface hover:bg-surface-2/70",
                        )}
                      >
                        <Avatar
                          name={c.name}
                          face={c.face ? faces[c.face] : null}
                          category={c.categoryId}
                          tint={c.tint}
                          size="md"
                          verified={c.verified}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-[14.5px] font-bold">
                              {c.name}
                            </span>
                            {c.verified ? (
                              <Badge tone="mint">تأیید</Badge>
                            ) : (
                              <Badge tone="amber">در انتظار</Badge>
                            )}
                          </span>
                          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] text-faint">
                            <span>{c.district}</span>
                            <span aria-hidden>·</span>
                            <span className="text-mint">
                              {faNum(c.rating)} امتیاز از {faNum(c.reviews)} نظر
                            </span>
                          </span>
                        </span>
                        <span className="shrink-0 text-end">
                          <span className="block text-[13px] font-bold tabular-nums">
                            {price(c.priceFrom, false)}
                          </span>
                          <span className="mt-0.5 block text-[10.5px] text-faint">
                            شروع، تومان
                          </span>
                          {near ? (
                            <span className="mt-1 block text-[10.5px] font-semibold text-mint">
                              {relativeDay(near.iso)} {timeLabel(near.time)}
                            </span>
                          ) : (
                            <span className="mt-1 block text-[10.5px] text-faint">
                              بدون وقت خالی
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                {service ? null : (
                  <InfoNote tone="amber" icon={<IconAlert size={14} />}>
                    برای دیدن متخصص‌ها، اول یک خدمت انتخاب کن.
                  </InfoNote>
                )}
              </div>
            </StepShell>
          ) : null}

          {step === 2 ? (
            <StepShell
              n={3}
              eyebrow="تقویم شمسی · ۶۰ روز آینده"
              title="انتخاب تاریخ"
              desc="نقطه‌ی سبز یعنی وقت آزاد زیاد، کهربایی یعنی ظرفیت کم."
              aside={
                <LinkButton
                  href="#"
                  size="sm"
                  variant="ghost"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <IconCalendar size={13} />
                    {sp ? `${faNum(freeCount(sp, today))} وقت امروز` : "تقویم"}
                  </span>
                </LinkButton>
              }
            >
              {sp ? (
                <div className="space-y-4">
                  <MonthStrip
                    days={Array.from({ length: 12 }, (_, i) =>
                      addDays(today, i),
                    )}
                    value={draft.date}
                    onChange={(iso) => setDraft({ date: iso, time: null })}
                    dayInfo={dayInfo}
                  />
                  <div className="rounded-lg border border-line bg-surface p-3.5">
                    <Calendar
                      value={draft.date}
                      onChange={(iso) => setDraft({ date: iso, time: null })}
                      dayInfo={dayInfo}
                      minISO={today}
                      maxISO={addDays(today, 60)}
                      markedISOs={bookings
                        .filter((b) => b.specialistId === sp.id)
                        .map((b) => b.date)}
                    />
                  </div>
                </div>
              ) : (
                <InfoNote>
                  اول متخصص را انتخاب کن تا تقویم همان سالن باز شود.
                </InfoNote>
              )}
            </StepShell>
          ) : null}

          {step === 3 ? (
            <StepShell
              n={4}
              eyebrow="ساعت‌های خالیِ همین روز"
              title="انتخاب ساعت"
              desc={
                draft.date
                  ? `${jDateWeekday(draft.date)}${nearDay(draft.date) ? ` — ${nearDay(draft.date)}` : ""}`
                  : "اول تاریخ را مشخص کن."
              }
              aside={
                draft.date && sp ? (
                  <Badge tone="mint" leading={<IconClock size={11} />}>
                    {faNum(slots.filter((s) => s.state === "free").length)} وقت
                    آزاد
                  </Badge>
                ) : null
              }
            >
              {draft.date && sp ? (
                <TimeSlots
                  slots={slots}
                  value={draft.time}
                  serviceMinutes={service?.minutes}
                  onChange={(t) => {
                    setDraft({ time: t });
                    go(4);
                  }}
                  onFullDay={() => {
                    const near = nearestFree(
                      sp,
                      addDays(draft.date ?? today, 1),
                    );
                    if (near) {
                      setDraft({ date: near.iso, time: null });
                      go(2);
                    }
                  }}
                />
              ) : (
                <InfoNote>تاریخ انتخاب نشده است.</InfoNote>
              )}
            </StepShell>
          ) : null}

          {step === 4 ? (
            <StepShell
              n={5}
              eyebrow="برای هماهنگی و یادآوری پیامک"
              title="اطلاعات شما"
              desc="فقط دو فیلد لازم است؛ بقیه را از حساب کاربری پر کرده‌ایم."
            >
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Input
                  label="نام و نام خانوادگی"
                  required
                  value={draft.name}
                  error={errors.name}
                  onChange={(e) => setDraft({ name: e.target.value })}
                  placeholder="آرمیتا نجفی"
                  autoComplete="name"
                  leading={<IconUser size={16} />}
                />
                <Input
                  label="شماره موبایل"
                  required
                  inputMode="numeric"
                  dir="ltr"
                  className="text-end tabular-nums"
                  value={draft.phone}
                  error={errors.phone}
                  onChange={(e) =>
                    setDraft({
                      phone: e.target.value.replace(/\D/g, "").slice(0, 11),
                    })
                  }
                  placeholder="09121234567"
                  hint="برای یادآوری شبِ جلسه استفاده می‌شود."
                />
              </div>

              <div className="mt-4 space-y-2.5">
                <Textarea
                  label="توضیح برای متخصص"
                  counter={`${faNum(draft.note.length)} / ۲٬۰۰`}
                  value={draft.note}
                  onChange={(e) =>
                    setDraft({ note: e.target.value.slice(0, 200) })
                  }
                  placeholder="مثلاً: حساسیت به عطر، سابقه‌ی لیزر، یا زمانی که برای رسیدن سخت است."
                />
                <Toggle
                  checked={draft.payAtVenue}
                  onChange={(v) => setDraft({ payAtVenue: v })}
                  label="پرداخت در محل"
                  hint="مبلغ پس از انجام خدمت در سالن پرداخت می‌شود."
                />
                <Toggle
                  checked={!draft.payAtVenue}
                  onChange={(v) => setDraft({ payAtVenue: !v })}
                  label="پرداخت آنلاین و قفل زمان"
                  hint="با پرداخت آنلاین، زمان تا ۱۵ دقیقه بعد از رزرو برای شما رزرو می‌ماند."
                />
                <button
                  type="button"
                  onClick={() => {
                    setDraft({ agreed: !draft.agreed });
                    setErrors((e) => ({ ...e, agreed: undefined }));
                  }}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-md border px-3.5 py-3 text-start transition-colors",
                    draft.agreed
                      ? "border-mint/45 bg-[rgba(110,242,208,0.05)]"
                      : "border-line bg-surface",
                    errors.agreed && "border-[#5b2b33]",
                  )}
                >
                  <span
                    className={cn(
                      "mt-[2px] grid h-5 w-5 shrink-0 place-items-center rounded-[5px] border transition-colors",
                      draft.agreed
                        ? "border-mint bg-mint text-[#04231d]"
                        : "border-line-soft",
                    )}
                  >
                    {draft.agreed ? (
                      <IconCheck size={12} strokeWidth={3} />
                    ) : null}
                  </span>
                  <span className="text-[12.5px] leading-relaxed text-muted">
                    <span className="font-bold text-ink">
                      قوانین لغو و حضور
                    </span>{" "}
                    را خواندم؛ تا ۲۴ ساعت قبل از جلسه لغو رایگان است و در صورت
                    غیبت، هزینه‌ی رزرو کسر می‌شود.
                  </span>
                </button>
              </div>
            </StepShell>
          ) : null}

          {step === 5 ? (
            <StepShell
              n={6}
              title="تأیید نهایی"
              desc="یک بار چک کن؛ بعد از ثبت، فقط از بخش رزروها قابل تغییر است."
            >
              <ConfirmCard
                draft={draft}
                sp={sp}
                service={service}
                onEdit={go}
              />
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                <InfoNote
                  tone="mint"
                  icon={<IconLock size={14} className="text-mint" />}
                >
                  شماره تماس فقط با متخصص به اشتراک گذاشته می‌شود.
                </InfoNote>
                <InfoNote
                  tone="violet"
                  icon={<IconSparkle size={14} className="text-accent" />}
                >
                  {bookingRef(draft.phone || "demo")} — پیش‌نویس کد رزرو شما
                </InfoNote>
              </div>
            </StepShell>
          ) : null}
        </div>

        {/* خلاصه‌ی کناری (دسکتاپ) */}
        {!inSheet ? (
          <aside className="hidden lg:block">
            <div className="sticky top-[132px] space-y-3">
              <SummaryCard draft={draft} sp={sp} service={service} />
              <Link
                href={sp ? `/specialists/${sp.id}` : "/explore"}
                className="flex items-center justify-between rounded-md border border-line bg-surface px-3.5 py-3 text-[12.5px] font-semibold text-muted transition-colors hover:text-ink"
              >
                {sp ? "دیدن پروفایل و نمونه‌کار" : "بازگشت به کاوش"}
                <IconArrow size={14} />
              </Link>
            </div>
          </aside>
        ) : null}
      </div>

      {/* پاورقی چسبان موبایل */}
      <div
        className={cn(
          "fixed inset-x-0 z-50 border-t border-line bg-bg-2/97 px-3.5 py-3 backdrop-blur-[6px] lg:hidden",
          inSheet
            ? "bottom-0"
            : "bottom-[calc(3.75rem+env(safe-area-inset-bottom))]",
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-3 text-[11.5px]">
          <span className="min-w-0 truncate text-muted">
            {service ? service.name : "خدمت انتخاب نشده"}
            {draft.date ? ` · ${relativeDay(draft.date)}` : ""}
            {draft.time ? ` · ${timeLabel(draft.time)}` : ""}
          </span>
          <span className="shrink-0 font-bold tabular-nums text-ink">
            {service ? `از ${price(service.price, false)}` : "—"}
          </span>
        </div>
        {footer}
      </div>

      <BottomSheet
        open={specialistSheet}
        onClose={() => setSpecialistSheet(false)}
        title="تغییر متخصص"
        footer={footer}
      >
        <p className="text-[13px] leading-relaxed text-muted">
          با تغییر متخصص، زمان‌های انتخابی پاک می‌شود چون ظرفیت هر سالن مستقل
          است.
        </p>
      </BottomSheet>

      <div className={cn("mt-6 hidden lg:block")}>{footer}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function StepShell({
  n,
  eyebrow,
  title,
  desc,
  aside,
  children,
}: {
  n: number;
  eyebrow?: ReactNode;
  title: string;
  desc?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="motion-safe:animate-[rise_0.32s_cubic-bezier(0.2,0.7,0.2,1)_both]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="label mb-1.5 block">
            {eyebrow ?? `گام ${faNum(n)} از ${faNum(6)}`}
          </span>
          <h2 className="text-[19px] font-extrabold leading-snug sm:text-[22px]">
            {title}
          </h2>
          {desc ? (
            <p className="mt-1.5 max-w-[56ch] text-[12.5px] leading-relaxed text-muted sm:text-[13.5px]">
              {desc}
            </p>
          ) : null}
        </div>
        {aside ? <div className="shrink-0 pt-1">{aside}</div> : null}
      </div>
      {children}
    </section>
  );
}

function ServicePicker({
  onPick,
  selected,
}: {
  onPick: (id: string) => void;
  selected: string | null;
}) {
  const [cat, setCat] = useState<string>("skin");
  const list = services.filter((s) => s.categoryId === cat);
  return (
    <div>
      <div className="no-scrollbar w-full min-w-0 -mx-1 mb-3 flex gap-1.5 overflow-x-auto px-1">
        {["skin", "hair", "nails", "makeup", "care", "massage"].map((c) => (
          <Chip
            key={c}
            active={cat === c}
            onClick={() => setCat(c)}
            className="shrink-0 capitalize"
          >
            {categoryArt[c as keyof typeof categoryArt]
              ? (SERVICE_CAT_LABEL[c] ?? c)
              : c}
          </Chip>
        ))}
      </div>
      <div className="space-y-2">
        {list.map((s) => (
          <ServiceOption
            key={s.id}
            service={s}
            selected={selected === s.id}
            onSelect={(svc) => onPick(svc.id)}
          />
        ))}
      </div>
    </div>
  );
}

const SERVICE_CAT_LABEL: Record<string, string> = {
  skin: "پوست",
  hair: "مو",
  nails: "ناخن",
  makeup: "میکاپ",
  care: "مراقبت",
  massage: "ماساژ",
};

function ConfirmCard({
  draft,
  sp,
  service,
  onEdit,
}: {
  draft: Draft;
  sp: Specialist | null;
  service?: Service;
  onEdit: (n: number) => void;
}) {
  if (!sp || !service || !draft.date || !draft.time) return null;
  const rows = [
    { label: "خدمت", value: service.name, step: 0 },
    { label: "مدت", value: durationLabel(service.minutes), step: 0 },
    { label: "متخصص", value: `${sp.name} · ${sp.title}`, step: 1 },
    {
      label: "تاریخ",
      value: nearDay(draft.date)
        ? `${jDateFull(draft.date)} (${nearDay(draft.date)})`
        : jDateFull(draft.date),
      step: 2,
    },
    {
      label: "ساعت",
      value: `${timeLabel(draft.time)} تا ${timeLabel(endsAt(draft.time, service.minutes))}`,
      step: 3,
    },
    { label: "آدرس", value: sp.address, step: 1 },
    { label: "نام", value: draft.name || "—", step: 4 },
    { label: "تماس", value: draft.phone || "—", step: 4 },
  ];
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="flex items-center gap-3 border-b border-line-soft p-3.5">
        {sp.face && faces[sp.face] ? (
          <Img
            src={faces[sp.face]!.face}
            alt={sp.name}
            className="h-12 w-12 shrink-0 rounded-md"
          />
        ) : (
          <Avatar
            name={sp.name}
            category={sp.categoryId}
            tint={sp.tint}
            size="md"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold">{sp.studio}</p>
          <p className="mt-0.5 truncate text-[11.5px] text-faint">
            {sp.city} · {sp.district}
          </p>
        </div>
        <Badge tone="mint" leading={<IconCheckCircle size={11} />}>
          آماده‌ی ثبت
        </Badge>
      </div>
      <dl className="divide-y divide-[color:var(--color-line-soft)]">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start gap-3 px-3.5 py-2.5">
            <dt className="w-[74px] shrink-0 text-[11.5px] text-faint">
              {r.label}
            </dt>
            <dd className="min-w-0 flex-1 text-[13px] font-semibold leading-relaxed">
              {r.value}
            </dd>
            <button
              type="button"
              onClick={() => onEdit(r.step)}
              className="shrink-0 text-[11.5px] font-bold text-accent transition-opacity hover:opacity-75"
            >
              ویرایش
            </button>
          </div>
        ))}
      </dl>
      <div className="flex items-center justify-between gap-3 border-t border-line-soft bg-surface-2/50 px-3.5 py-3">
        <span className="text-[12px] text-muted">
          {draft.payAtVenue ? "پرداخت در محل" : "پرداخت آنلاین"}
          {draft.note ? " · یادداشت ثبت می‌شود" : ""}
        </span>
        <span className="text-[15px] font-extrabold tabular-nums">
          {price(service.price, false)}
          <span className="ms-1 text-[11px] font-medium text-faint">تومان</span>
        </span>
      </div>
    </div>
  );
}

function SummaryCard({
  draft,
  sp,
  service,
}: {
  draft: Draft;
  sp: Specialist | null;
  service?: Service;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="relative h-24">
        {sp ? (
          <Img
            src={categoryArt[sp.categoryId].wide}
            alt=""
            className="absolute inset-0 h-full w-full"
            imgClassName="opacity-55"
          />
        ) : null}
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(23,19,29,0.98),rgba(23,19,29,0.3))]" />
        <span className="absolute bottom-2.5 start-3.5 text-[13px] font-bold">
          خلاصه‌ی رزرو
        </span>
      </div>
      <div className="space-y-2.5 p-3.5 text-[12.5px]">
        <Row label="خدمت" value={service?.name ?? "—"} />
        <Row label="متخصص" value={sp?.name ?? "—"} />
        <Row
          label="تاریخ"
          value={draft.date ? jDateWeekday(draft.date) : "—"}
        />
        <Row label="ساعت" value={draft.time ? timeLabel(draft.time) : "—"} />
        <Row
          label="مدت"
          value={service ? durationLabel(service.minutes) : "—"}
        />
        <div className="mt-1 flex items-center justify-between border-t border-line-soft pt-2.5">
          <span className="text-[11.5px] text-faint">مبلغ قابل پرداخت</span>
          <span className="text-[15px] font-extrabold tabular-nums">
            {price(service?.price ?? 0, false)}
            <span className="ms-1 text-[10.5px] font-medium text-faint">
              تومان
            </span>
          </span>
        </div>
        <div className="flex items-start gap-2 rounded-md bg-surface-2/60 p-2.5 text-[11.5px] leading-relaxed text-muted">
          <IconPin size={13} className="mt-[2px] shrink-0 text-accent" />
          {sp?.address ??
            "پس از انتخاب متخصص، آدرس سالن اینجا نمایش داده می‌شود."}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="shrink-0 text-faint">{label}</span>
      <span className="min-w-0 truncate text-end font-semibold">{value}</span>
    </div>
  );
}

function nextHint(
  step: number,
  flags: { service: boolean; sp: boolean; date: boolean; time: boolean },
) {
  if (step === 0 && !flags.service) return "یک خدمت انتخاب کن";
  if (step === 1 && !flags.sp) return "یک متخصص انتخاب کن";
  if (step === 2 && !flags.date) return "تاریخ را انتخاب کن";
  if (step === 3 && !flags.time) return "ساعت را انتخاب کن";
  if (step === 4) return "نام و شماره تماس را کامل کن";
  return "ادامه";
}
