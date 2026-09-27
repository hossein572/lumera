"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { useLumera } from "@/store/useLumera";
import {
  countdownLabel,
  durationLabel,
  endsAt,
  jDateFull,
  price,
  relativeDay,
  timeLabel,
  toISO,
} from "@/lib/fa";
import { faces } from "@/lib/images";
import { serviceById } from "@/data/services";
import { specialistById } from "@/data/specialists";
import { statusMeta } from "@/data/bookings";
import type { Booking } from "@/data/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Overlay";
import { Img } from "@/components/ui/Image";
import {
  IconCalendar,
  IconCheck,
  IconChevron,
  IconClock,
  IconCopy,
  IconMessage,
  IconPin,
  IconRefresh,
  IconStar,
  IconTicket,
  IconWallet,
} from "@/components/icons";

export function BookingCard({
  booking,
  mode = "future",
  onReschedule,
}: {
  booking: Booking;
  mode?: "future" | "past";
  onReschedule?: (b: Booking) => void;
}) {
  const sp = specialistById[booking.specialistId];
  const service = serviceById[booking.serviceId];
  const meta = statusMeta[booking.status];
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pushToast = useLumera((s) => s.pushToast);
  const cancelBooking = useLumera((s) => s.cancelBooking);
  if (!sp || !service) return null;

  const future = mode === "future";

  return (
    <>
      <article
        className={cn(
          "relative overflow-hidden rounded-lg border bg-surface transition-colors",
          booking.status === "cancelled" || booking.status === "expired"
            ? "border-line-soft"
            : "border-line",
        )}
      >
        {/* نوار رنگی وضعیت — تنها جای استفاده از رنگ در این کارت */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-0 start-0 w-[3px]",
            booking.status === "confirmed"
              ? "bg-mint"
              : booking.status === "pending"
                ? "bg-amber"
                : booking.status === "cancelled" || booking.status === "expired"
                  ? "bg-[#4a2229]"
                  : "bg-accent/55",
          )}
        />

        <div className="p-3.5 ps-4">
          <div className="flex items-start gap-3">
            <Avatar
              name={sp.name}
              face={sp.face ? faces[sp.face] : null}
              category={sp.categoryId}
              tint={sp.tint}
              size="md"
              verified={sp.verified}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <Link
                  href={`/specialists/${sp.id}`}
                  className="text-[14.5px] font-bold hover:text-accent"
                >
                  {sp.name}
                </Link>
                <Badge tone={meta.tone as "mint"}>{meta.label}</Badge>
                {future ? (
                  <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-faint">
                    <IconClock size={11} />
                    {countdownLabel(booking.date, booking.time)}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 truncate text-[13px] text-muted">
                {service.name}
              </p>
            </div>
            <div className="hidden shrink-0 text-end sm:block">
              <div className="text-[15px] font-extrabold tabular-nums">
                {price(booking.price, false)}
              </div>
              <div className="text-[11px] text-faint">تومان</div>
            </div>
          </div>

          <div className="mt-3 grid gap-2 rounded-md border border-line-soft bg-bg-2/60 p-2.5 sm:grid-cols-3">
            <Info
              icon={<IconCalendar size={13} />}
              label={jDateFull(booking.date)}
              sub={relativeDay(booking.date)}
            />
            <Info
              icon={<IconClock size={13} />}
              label={`${timeLabel(booking.time)} تا ${timeLabel(endsAt(booking.time, service.minutes))}`}
              sub={durationLabel(service.minutes)}
            />
            <Info
              icon={<IconPin size={13} />}
              label={sp.district}
              sub={sp.address.replace(/^.*, /, "")}
            />
          </div>

          {booking.note ? (
            <p className="mt-2.5 flex items-start gap-2 rounded-md bg-surface-2/60 px-2.5 py-2 text-[12.5px] leading-relaxed text-muted">
              <IconMessage size={13} className="mt-[3px] shrink-0 text-faint" />
              <span className="min-w-0">{booking.note}</span>
            </p>
          ) : null}

          {booking.status === "cancelled" || booking.status === "expired" ? (
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-[#ff9aa1]">
              {meta.hint}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText(booking.code);
                pushToast({
                  text: `کد رزرو ${booking.code} کپی شد`,
                  tone: "success",
                });
              }}
              className="inline-flex items-center gap-1.5 rounded-xs border border-line bg-surface-2/60 px-2 py-1 text-[11.5px] font-semibold text-muted transition-colors hover:text-ink"
            >
              <IconTicket size={12} />
              {booking.code}
              <IconCopy size={11} className="text-faint" />
            </button>
            <span className="text-[11.5px] text-faint sm:hidden">
              {price(booking.price)}
            </span>
            <span className={cn("ms-auto flex flex-wrap items-center gap-2")}>
              {future ? (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirmOpen(true)}
                  >
                    لغو رزرو
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    leading={<IconRefresh size={13} />}
                    onClick={() => onReschedule?.(booking)}
                  >
                    جابه‌جایی
                  </Button>
                  <LinkButtonToProfile spId={sp.id} />
                </>
              ) : booking.status === "completed" ? (
                <Button
                  size="sm"
                  variant="outline"
                  leading={<IconStar size={13} />}
                >
                  ثبت نظر
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  leading={<IconWallet size={13} />}
                >
                  درخواست بازگشت وجه
                </Button>
              )}
            </span>
          </div>
        </div>
      </article>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="لغو این رزرو؟"
        description="تا ۲۴ ساعت پیش از جلسه، بدون کسر کارمزد لغو می‌شود."
        footer={
          <div className="flex gap-2.5">
            <Button
              variant="danger"
              block
              onClick={() => {
                setConfirmOpen(false);
                cancelBooking(booking.id);
                pushToast({
                  text: "رزرو لغو شد؛ مبلغ ظرف ۷۲ ساعت بازمی‌گردد",
                  tone: "warn",
                });
              }}
            >
              بله، لغو کن
            </Button>
            <Button
              variant="outline"
              block
              onClick={() => setConfirmOpen(false)}
            >
              بازگشت
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-[13.5px] leading-relaxed text-muted">
          <p>
            <span className="font-bold text-ink">{service.name}</span> با{" "}
            {sp.name} — {jDateFull(booking.date)}، ساعت{" "}
            {timeLabel(booking.time)}.
          </p>
          <ul className="space-y-2">
            {[
              "امتیاز و سابقه‌ی رزرو شما حفظ می‌شود.",
              "در صورت لغو نزدیک به ساعت نوبت، امکان مسدودشدن موقت رزرو وجود دارد.",
              "می‌توانید به‌جای لغو، زمان را جابه‌جا کنید.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <IconCheck size={13} className="mt-[5px] shrink-0 text-mint" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </>
  );
}

function LinkButtonToProfile({ spId }: { spId: string }) {
  return (
    <Link
      href={`/specialists/${spId}`}
      className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3.5 text-[13px] font-bold text-[#180b26] transition-colors hover:bg-[#d684ff]"
    >
      صفحه‌ی متخصص
      <IconChevron dir="end" size={13} />
    </Link>
  );
}

function Info({
  icon,
  label,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <span className="mt-[3px] shrink-0 text-faint">{icon}</span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-semibold text-ink">
          {label}
        </span>
        {sub ? (
          <span className="mt-0.5 block truncate text-[11.5px] text-faint">
            {sub}
          </span>
        ) : null}
      </span>
    </div>
  );
}

export function BookingSummary({ booking }: { booking: Booking }) {
  const sp = specialistById[booking.specialistId];
  const service = serviceById[booking.serviceId];
  if (!sp || !service) return null;
  return (
    <div className="flex items-center gap-3 rounded-md border border-line bg-surface p-2.5">
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
          className="rounded-md"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-bold">{service.name}</p>
        <p className="mt-0.5 truncate text-[12px] text-muted">
          {sp.name} · {jDateFull(booking.date)} · {timeLabel(booking.time)}
        </p>
      </div>
      <span className="shrink-0 text-[13px] font-extrabold tabular-nums">
        {price(booking.price, false)}
      </span>
    </div>
  );
}

export const bookingDayLabel = (iso: string) =>
  iso === toISO(new Date()) ? "امروز" : relativeDay(iso);
