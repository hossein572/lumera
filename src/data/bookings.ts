import { addDays, bookingRef, toISO } from "@/lib/fa";
import { pick, rngFrom } from "@/lib/rng";
import { serviceById } from "./services";
import { specialists } from "./specialists";
import type { Booking, BookingStatus } from "./types";

export const ME = "me";

const CLIENT_IDS = ["u-01", "u-02", "u-03", "u-04", "u-05", "u-06"];
const NOTES = [
  "پوستم حساس است؛ اگر ممکن است از محصول معطر استفاده نشود.",
  "برای مراسم شب عروسی آماده می‌شوم، لطفاً وقت را عقب نکشید.",
  "باردارم و فقط متریال مجاز استفاده می‌شود.",
  "دفعه‌ی قبل ماسک ژلی خوب جواب داد؛ اگر ممکن است همان.",
  "حدود ۱۰ دقیقه دیر می‌رسم، ترافیک همت خیلی سنگین است.",
  "",
];

const CANCEL_REASONS = [
  "انصراف از سوی مشتری به دلیل شرایط کاری",
  "لغو توسط متخصص به دلیل مشکل فنی دستگاه",
  "غیبت در موعد رزرو",
];

function makeBooking(
  idx: number,
  userId: string,
  specialistIdx: number,
  dayOffset: number,
  status: BookingStatus,
  rand: () => number,
): Booking {
  const sp = specialists[
    specialistIdx % specialists.length
  ] as (typeof specialists)[number];
  const serviceId =
    sp.serviceIds[idx % sp.serviceIds.length] ?? sp.serviceIds[0] ?? "";
  const service = serviceById[serviceId];
  const hour = 10 + Math.floor(rand() * 9);
  const minute = rand() > 0.5 ? "30" : "00";
  const today = toISO(new Date());
  return {
    id: `bk-${idx + 1}`,
    code: bookingRef(`lumera-${idx + 1}-${userId}`),
    userId,
    specialistId: sp.id,
    serviceId,
    date: addDays(today, dayOffset),
    time: `${`${hour}`.padStart(2, "0")}:${minute}`,
    price: service?.price ?? 1200000,
    status,
    createdAt: addDays(
      today,
      dayOffset > 0
        ? -(2 + Math.floor(rand() * 12))
        : -(20 + Math.floor(rand() * 40)),
    ),
    note: rand() > 0.55 ? pick(rand, NOTES) : undefined,
    phone: `0912${1000000 + Math.floor(rand() * 8999999)}`,
    paid: status === "completed" ? rand() > 0.25 : false,
    cancelledBy:
      status === "cancelled"
        ? rand() > 0.4
          ? "user"
          : "specialist"
        : undefined,
    reason:
      status === "cancelled" || status === "expired"
        ? pick(rand, CANCEL_REASONS)
        : undefined,
  };
}

/**
 * ۲۰ رزرو — ۸ مورد مال کاربر جاری (برای صفحه‌ی حساب) و بقیه برای صف اشغال سایر مشتریان.
 * تاریخ‌ها نسبت به «امروز» ساخته می‌شوند تا همیشه زنده به نظر برسند.
 */
export function seedBookings(): Booking[] {
  const rand = rngFrom("lumera-bookings-v1");
  const out: Booking[] = [];

  const mine: [
    specialistIdx: number,
    dayOffset: number,
    status: BookingStatus,
    time?: string,
  ][] = [
    [0, 1, "confirmed", "18:00"],
    [1, 4, "confirmed", "12:30"],
    [4, 8, "pending"],
    [2, 12, "confirmed"],
    [3, -3, "completed"],
    [7, -11, "completed"],
    [5, -24, "cancelled"],
    [9, -46, "completed"],
  ];

  mine.forEach(([si, off, status, time], i) => {
    const b = makeBooking(i, ME, si, off, status, rand);
    if (time) b.time = time;
    if (i === 0) {
      b.note = "پوستم در ناحیه‌ی گونه خشک است؛ اگر لازم شد ماسک اضافه کنید.";
      b.paid = true;
    }
    if (i === 2) b.note = "اولین بارم است؛ کمی توضیح بیشتر ممنون.";
    out.push(b);
  });

  const otherStatuses: BookingStatus[] = [
    "confirmed",
    "confirmed",
    "completed",
    "pending",
    "completed",
    "expired",
    "confirmed",
    "cancelled",
    "completed",
    "confirmed",
    "pending",
    "completed",
  ];
  otherStatuses.forEach((status, i) => {
    const offset =
      status === "completed" || status === "cancelled" || status === "expired"
        ? -(3 + (i % 40))
        : 1 + ((i * 3) % 16);
    out.push(
      makeBooking(
        i + 8,
        CLIENT_IDS[i % CLIENT_IDS.length] as string,
        (i * 4 + 3) % 15,
        offset,
        status,
        rand,
      ),
    );
  });

  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const statusMeta: Record<
  BookingStatus,
  {
    label: string;
    tone: "mint" | "amber" | "danger" | "muted" | "violet";
    hint: string;
  }
> = {
  confirmed: {
    label: "تأیید شده",
    tone: "mint",
    hint: "نوبت شما قطعی است؛ لطفاً ۱۰ دقیقه زودتر برسید.",
  },
  pending: {
    label: "در انتظار تأیید",
    tone: "amber",
    hint: "در انتظار پاسخ متخصص — معمولاً تا ۲ ساعت.",
  },
  cancelled: {
    label: "لغو شده",
    tone: "danger",
    hint: "این رزرو لغو شده و مبلغ بازگشت داده می‌شود.",
  },
  completed: {
    label: "انجام شده",
    tone: "violet",
    hint: "جلسه انجام شد. اگر راضی بودید، نظر بگذارید.",
  },
  expired: {
    label: "منقضی شده",
    tone: "muted",
    hint: "در زمان مقرر مراجعه نشد.",
  },
};

export function isFuture(booking: Booking) {
  const today = toISO(new Date());
  return (
    booking.date >= today &&
    (booking.status === "confirmed" || booking.status === "pending")
  );
}
