"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { addDays, faNum, jDateFull, relativeDay, toISO } from "@/lib/fa";
import { specialistById } from "@/data/specialists";
import { daySlots, freeCount, nearestFree } from "@/data/slots";
import { statusMeta } from "@/data/bookings";
import { useLumera, upcomingBookings, pastBookings } from "@/store/useLumera";
import { BookingCard } from "@/components/booking-card";
import { Calendar } from "@/components/calendar";
import { TimeSlots } from "@/components/calendar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/Overlay";
import { Segmented } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  IconAlert,
  IconCalendar,
  IconCheckCircle,
  IconClock,
  IconRefresh,
  IconTicket,
} from "@/components/icons";
import type { Booking } from "@/data/types";

type ViewKey = "upcoming" | "past" | "all";

export function BookingsView() {
  const hydrated = useLumera((s) => s.hydrated);
  const bookings = useLumera((s) => s.bookings);
  const reschedule = useLumera((s) => s.rescheduleBooking);
  const push = useLumera((s) => s.pushToast);
  const [view, setView] = useState<ViewKey>("upcoming");
  const [moving, setMoving] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState<string | null>(null);
  const [newTime, setNewTime] = useState<string | null>(null);

  const mine = useMemo(
    () => bookings.filter((b) => b.userId === "me"),
    [bookings],
  );
  const future = useMemo(() => upcomingBookings(mine), [mine]);
  const past = useMemo(() => pastBookings(mine), [mine]);

  const list = view === "upcoming" ? future : view === "past" ? past : mine;

  const counts = {
    upcoming: future.length,
    past: past.length,
    all: mine.length,
  };

  function openMove(b: Booking) {
    const near = nearestFree(
      specialistById[b.specialistId]!,
      toISO(new Date()),
    );
    setMoving(b);
    setNewDate(near?.iso ?? addDays(toISO(new Date()), 2));
    setNewTime(near?.time ?? null);
  }

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-[1000px] space-y-3 px-4 py-8 sm:px-6 lg:px-10">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-11 w-full rounded-md" />
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 pb-4 pt-4 sm:px-6 lg:px-10 lg:pt-6">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <span className="eyebrow">حساب کاربری</span>
          <h1 className="mt-2.5 text-[24px] font-extrabold leading-tight sm:text-[28px]">
            رزروهای من
          </h1>
          <p className="mt-1.5 max-w-[52ch] text-[13px] leading-relaxed text-muted">
            وضعیت هر نوبت همین‌جا به‌روز می‌شود. جابه‌جایی ساعت، رزرو را به حالت
            «در انتظار تأیید» می‌برد.
          </p>
        </div>
        <LinkButton href="/explore" size="md" variant="outline">
          رزرو جدید
        </LinkButton>
      </header>

      <Segmented
        ariaLabel="نوع رزروها"
        className="w-full sm:w-auto"
        value={view}
        onChange={setView}
        options={[
          { value: "upcoming", label: "آینده", count: counts.upcoming },
          { value: "past", label: "قبلی", count: counts.past },
          { value: "all", label: "همه", count: counts.all },
        ]}
      />

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="min-w-0 space-y-3">
          {list.length ? (
            list.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                mode={
                  b.id && future.some((f) => f.id === b.id) ? "future" : "past"
                }
                onReschedule={openMove}
              />
            ))
          ) : view === "upcoming" ? (
            <EmptyState
              glyph={<IconCalendar size={18} />}
              tint="mint"
              title="هنوز رزرو فعالی ندارید"
              body={
                <>
                  نوبتی در روزهای پیشِ رو رزرو نکرده‌اید. با یک جستجوی کوتاه
                  می‌توانید برای همین هفته وقت بگیرید — الان{" "}
                  {faNum(specialistsWithFreeToday())} متخصص امروز ظرفیت دارند.
                </>
              }
              action={{ label: "شروع جستجو", href: "/explore" }}
              secondary={{
                label: "دیدن رزروهای قبلی",
                onClick: () => setView("past"),
              }}
              note="رزروهای لغو‌شده در تب «همه» می‌مانند تا سابقه‌تان حفظ شود."
            />
          ) : view === "past" ? (
            <EmptyState
              glyph={<IconClock size={18} />}
              tint="violet"
              title="گذشته‌ای برای مرور نیست"
              body="بعد از اولین جلسه، رزروهای انجام‌شده همین‌جا می‌مانند و می‌توانید به آن‌ها نظر بدهید."
              action={{ label: "پیدا کردن متخصص", href: "/explore" }}
            />
          ) : (
            <EmptyState
              glyph={<IconTicket size={18} />}
              title="سوابق رزرو خالی است"
              body="هیچ رزروی با این حساب ثبت نشده است."
              action={{ label: "کاوش لومرا", href: "/explore" }}
            />
          )}
        </div>

        <aside className="space-y-3">
          <div className="rounded-lg border border-line bg-surface p-4">
            <h2 className="text-[13px] font-bold">خلاصه‌ی حساب</h2>
            <ul className="mt-3 space-y-2.5 text-[12.5px]">
              <Stat
                label="رزروهای تأییدشده"
                value={faNum(
                  mine.filter((b) => b.status === "confirmed").length,
                )}
                tone="mint"
              />
              <Stat
                label="در انتظار تأیید"
                value={faNum(mine.filter((b) => b.status === "pending").length)}
                tone="amber"
              />
              <Stat
                label="انجام‌شده"
                value={faNum(
                  mine.filter((b) => b.status === "completed").length,
                )}
                tone="violet"
              />
              <Stat
                label="لغو یا منقضی"
                value={faNum(
                  mine.filter(
                    (b) => b.status === "cancelled" || b.status === "expired",
                  ).length,
                )}
                tone="muted"
              />
            </ul>
            <p className="mt-3.5 flex items-start gap-2 border-t border-line-soft pt-3 text-[11.5px] leading-relaxed text-faint">
              <IconAlert size={13} className="mt-[2px] shrink-0 text-amber" />
              سه بار لغو در یک ماه، رزرو آنی را برای ۴۸ ساعت غیرفعال می‌کند.
            </p>
          </div>

          <div className="rounded-lg border border-line bg-surface p-4">
            <h2 className="text-[13px] font-bold">نزدیک‌ترین جلسه</h2>
            {future[0] ? (
              <>
                <p className="mt-2.5 text-[14px] font-bold">
                  {specialistById[future[0].specialistId]?.name}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">
                  {jDateFull(future[0].date)} · {relativeDay(future[0].date)} ·
                  ساعت {timeText(future[0].time)}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Badge tone="mint" leading={<IconCheckCircle size={11} />}>
                    {statusMeta[future[0].status].label}
                  </Badge>
                  <Link
                    href={`/specialists/${future[0].specialistId}`}
                    className="text-[12px] font-semibold text-accent"
                  >
                    آدرس و تماس
                  </Link>
                </div>
              </>
            ) : (
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                جلسه‌ای در پیش نیست.
              </p>
            )}
          </div>
        </aside>
      </div>

      {/* شیت جابه‌جایی زمان */}
      <BottomSheet
        open={!!moving}
        onClose={() => setMoving(null)}
        title="جابه‌جایی رزرو"
        description={
          moving
            ? `${specialistById[moving.specialistId]?.name} — ${moving.code}`
            : undefined
        }
        bodyMax="72dvh"
        footer={
          <div className="flex gap-2.5">
            <Button variant="outline" block onClick={() => setMoving(null)}>
              انصراف
            </Button>
            <Button
              block
              leading={<IconRefresh size={15} />}
              disabled={!newDate || !newTime}
              onClick={() => {
                if (!moving || !newDate || !newTime) return;
                reschedule(moving.id, newDate, newTime);
                push({
                  text: `درخواست جابه‌جایی به متخصص ارسال شد — ${relativeDay(newDate)} ساعت ${timeText(newTime)}`,
                  tone: "success",
                });
                setMoving(null);
              }}
            >
              ثبت جابه‌جایی
            </Button>
          </div>
        }
      >
        {moving ? (
          <RescheduleBody
            specialistId={moving.specialistId}
            date={newDate}
            onDate={setNewDate}
            time={newTime}
            onTime={setNewTime}
          />
        ) : null}
      </BottomSheet>
    </div>
  );
}

function RescheduleBody({
  specialistId,
  date,
  onDate,
  time,
  onTime,
}: {
  specialistId: string;
  date: string | null;
  onDate: (iso: string) => void;
  time: string | null;
  onTime: (t: string) => void;
}) {
  const sp = specialistById[specialistId]!;
  const today = toISO(new Date());
  const slots = useMemo(() => (date ? daySlots(sp, date) : []), [sp, date]);
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-line bg-surface p-3.5">
        <Calendar
          value={date}
          onChange={(iso) => {
            onDate(iso);
            onTime("");
          }}
          minISO={today}
          maxISO={addDays(today, 45)}
          dayInfo={(iso) => ({
            free: freeCount(sp, iso),
            closed: daySlots(sp, iso).length === 0,
          })}
        />
      </div>
      {date ? (
        <TimeSlots
          slots={slots}
          value={time || null}
          onChange={(t) => onTime(t)}
          onFullDay={() => {
            const near = nearestFree(sp, addDays(date, 1));
            if (near) {
              onDate(near.iso);
              onTime("");
            }
          }}
        />
      ) : (
        <p className="text-[13px] text-muted">یک روز را انتخاب کنید.</p>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "mint" | "amber" | "violet" | "muted";
}) {
  const dot = {
    mint: "bg-mint",
    amber: "bg-amber",
    violet: "bg-accent",
    muted: "bg-[#4a4053]",
  }[tone];
  return (
    <li className="flex items-center gap-2">
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dot)} />
      <span className="min-w-0 flex-1 truncate text-muted">{label}</span>
      <span className="shrink-0 font-bold tabular-nums text-ink">{value}</span>
    </li>
  );
}

function timeText(t: string) {
  const [h, m] = t.split(":").map(Number);
  const hh = (h ?? 0) % 12 || 12;
  const digits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const fa = (n: number) =>
    String(n)
      .padStart(2, "0")
      .replace(/\d/g, (d) => digits[Number(d)] ?? d);
  return `${fa(hh)}:${fa(m ?? 0)}`;
}

function specialistsWithFreeToday() {
  const today = toISO(new Date());
  return Object.values(specialistById).filter((sp) => freeCount(sp, today) > 0)
    .length;
}
