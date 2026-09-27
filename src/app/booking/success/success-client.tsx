"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  durationLabel,
  endsAt,
  faNum,
  jDateFull,
  nearDay,
  price,
  relativeDay,
  timeLabel,
  toISO,
} from "@/lib/fa";
import { faces } from "@/lib/images";
import { serviceById } from "@/data/services";
import { specialistById } from "@/data/specialists";
import { useLumera } from "@/store/useLumera";
import { Img } from "@/components/ui/Image";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, InfoNote } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  IconCalendar,
  IconCheckCircle,
  IconChevron,
  IconClock,
  IconMessage,
  IconPin,
  IconStar,
  IconTicket,
} from "@/components/icons";

export function SuccessClient({ bookingId }: { bookingId?: string }) {
  const searchParams = useSearchParams();
  const queryBookingId = searchParams.get("id") ?? undefined;
  const resolvedBookingId = bookingId ?? queryBookingId;
  const bookings = useLumera((s) => s.bookings);
  const hydrated = useLumera((s) => s.hydrated);
  const [copied, setCopied] = useState(false);

  const booking = useMemo(() => {
    if (!bookings.length) return undefined;
    return (
      bookings.find((b) => b.id === resolvedBookingId) ??
      bookings.find((b) => b.userId === "me")
    );
  }, [bookings, bookingId]);

  useEffect(() => {
    if (!booking) return;
    const id = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(id);
  }, [booking]);

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-4 py-10 sm:px-6">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <Skeleton className="mt-4 h-6 w-52" />
        <Skeleton className="mt-3 h-4 w-72" />
        <Skeleton className="mt-6 h-56 w-full rounded-lg" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-4 py-10 sm:px-6">
        <EmptyState
          title="رزرو تازه‌ای پیدا نشد"
          body="احتمالاً این برگه را بدون ثبت رزرو باز کرده‌اید. رزروهای قبلی‌تان در بخش «رزروها» هستند."
          action={{ label: "دیدن رزروها", href: "/bookings" }}
          secondary={{ label: "بازگشت به خانه", href: "/" }}
          glyph="!"
          tint="amber"
        />
      </div>
    );
  }

  const sp = specialistById[booking.specialistId];
  const service = serviceById[booking.serviceId];
  if (!sp || !service) return null;

  const rel = nearDay(booking.date);
  const rows = [
    {
      icon: <IconStar size={14} />,
      label: "خدمت",
      value: `${service.name} · ${durationLabel(service.minutes)}`,
    },
    {
      icon: <IconCalendar size={14} />,
      label: "تاریخ",
      value: rel
        ? `${jDateFull(booking.date)} — ${rel}`
        : jDateFull(booking.date),
    },
    {
      icon: <IconClock size={14} />,
      label: "ساعت",
      value: `${timeLabel(booking.time)} تا ${timeLabel(endsAt(booking.time, service.minutes))}`,
    },
    { icon: <IconPin size={14} />, label: "آدرس", value: sp.address },
  ];

  return (
    <div className="mx-auto w-full max-w-[640px] px-4 pb-6 pt-6 sm:px-6 lg:pt-10">
      <div className="text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-lg border border-mint/40 bg-mint/10 text-mint motion-safe:animate-[pop_0.3s_ease-out_both]">
          <IconCheckCircle size={22} />
        </span>
        <h1 className="mt-4 text-[24px] font-extrabold leading-tight sm:text-[28px]">
          رزرو شما ثبت شد.
        </h1>
        <p className="mx-auto mt-2 max-w-[40ch] text-[13.5px] leading-relaxed text-muted">
          {sp.name} زمان را تأیید کرد. یک پیام یادآوری شبِ جلسه برای شما ارسال
          می‌شود.
        </p>
      </div>

      {/* کارت رزرو */}
      <div className="mt-7 overflow-hidden rounded-lg border border-line bg-surface">
        <div className="flex items-center gap-3 border-b border-line-soft p-4">
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
              verified={sp.verified}
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14.5px] font-bold">{sp.name}</p>
            <p className="mt-0.5 truncate text-[11.5px] text-faint">
              {sp.title} · {sp.studio}
            </p>
          </div>
          <Badge tone="mint">
            {booking.status === "pending" ? "در انتظار" : "تأیید شده"}
          </Badge>
        </div>

        <dl className="divide-y divide-[color:var(--color-line-soft)]">
          {rows.map((r) => (
            <div key={r.label} className="flex items-start gap-3 px-4 py-3">
              <span className="mt-[3px] shrink-0 text-faint">{r.icon}</span>
              <dt className="w-[54px] shrink-0 text-[11.5px] text-faint">
                {r.label}
              </dt>
              <dd className="min-w-0 flex-1 text-[13.5px] font-semibold leading-relaxed">
                {r.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft bg-surface-2/50 px-4 py-3">
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(booking.code);
              setCopied(true);
            }}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-2.5 py-1.5 text-[12.5px] font-bold transition-colors hover:border-accent/45"
          >
            <IconTicket size={13} className="text-accent" />
            {booking.code}
            <span className="font-medium text-faint">
              {copied ? "کپی شد" : "کپی"}
            </span>
          </button>
          <span className="text-[13.5px] font-extrabold tabular-nums">
            {price(booking.price, false)}
            <span className="ms-1 text-[11px] font-medium text-faint">
              تومان · {booking.paid ? "پرداخت آنلاین" : "پرداخت در محل"}
            </span>
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        <LinkButton
          href="/bookings"
          size="lg"
          trailing={<IconChevron size={15} dir="end" />}
        >
          مشاهده رزرو
        </LinkButton>
        <LinkButton href="/" size="lg" variant="outline">
          بازگشت به خانه
        </LinkButton>
      </div>

      <div className="mt-5 space-y-2.5">
        <InfoNote
          tone="mint"
          icon={<IconCheckCircle size={14} className="text-mint" />}
        >
          ۱۰ دقیقه زودتر برسید؛ برای خدمات طولانی، زمان آماده‌سازی هم در نظر
          گرفته شده است.
        </InfoNote>
        <InfoNote
          tone="violet"
          icon={<IconMessage size={14} className="text-accent" />}
        >
          اگر لازم شد، از بخش رزروها می‌توانید ساعت را جابه‌جا کنید. لغو تا ۲۴
          ساعت قبل، رایگان است.
        </InfoNote>
      </div>

      <Link
        href={`/specialists/${sp.id}#reviews`}
        className="mt-5 flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-3.5 text-start transition-colors hover:border-accent/40"
      >
        <span className="min-w-0">
          <span className="block text-[13.5px] font-bold">
            بعد از جلسه، نظرت را بنویس
          </span>
          <span className="mt-0.5 block text-[11.5px] leading-relaxed text-muted">
            نظر شما به {faNum(sp.reviews)} نظر قبلی اضافه می‌شود و به تصمیم
            دیگران کمک می‌کند.
          </span>
        </span>
        <IconChevron dir="end" size={16} className="shrink-0 text-faint" />
      </Link>

      <p className="mt-6 text-center text-[11px] text-faint">
        شماره‌ی پیگیری: {booking.code} · ثبت‌شده در{" "}
        {jDateFull(toISO(new Date()))}
      </p>
    </div>
  );
}
