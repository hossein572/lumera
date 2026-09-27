import {
  addDays,
  jDateWeekday,
  relativeDay,
  timeLabel,
  untilMinutes,
} from "@/lib/fa";
import { toISO } from "@/lib/fa";
import { serviceById } from "./services";
import { specialistById } from "./specialists";
import type { AppNotification, Booking } from "./types";

/** اعلان‌ها از روی رزروهای واقعی کاربر ساخته می‌شوند تا با «رزروها» نخوانده نمانند. */
export function buildNotifications(bookings: Booking[]): AppNotification[] {
  const mine = bookings.filter((b) => b.userId === "me");
  const out: AppNotification[] = [];

  const upcoming = mine.filter((b) => b.status === "confirmed").slice(-1)[0];
  if (upcoming) {
    out.push({
      id: "nt-arr",
      kind: "booking",
      title: `رزرو شما برای ${relativeDay(upcoming.date)} ساعت ${timeLabel(upcoming.time)} تأیید شد`,
      body: `${specialistById[upcoming.specialistId]?.name ?? ""} — ${
        serviceById[upcoming.serviceId]?.name ?? ""
      } · ${jDateWeekday(upcoming.date)}`,
      date: toISO(new Date()),
      time: "09:20",
      read: false,
      bookingCode: upcoming.code,
      href: "/bookings",
    });
  }

  const pending = mine.find((b) => b.status === "pending");
  if (pending) {
    out.push({
      id: "nt-pending",
      kind: "booking",
      title: "رزرو شما در انتظار تأیید است",
      body: `${
        specialistById[pending.specialistId]?.name ?? ""
      } معمولاً ظرف ${specialistById[pending.specialistId]?.responseMinutes ?? 30} دقیقه پاسخ می‌دهد.`,
      date: addDays(toISO(new Date()), -1),
      time: "21:05",
      read: false,
      bookingCode: pending.code,
      href: "/bookings",
    });
  }

  out.push(
    {
      id: "nt-rem",
      kind: "reminder",
      title: "یادآوری مراقبت پس از فیشال",
      body: "۴۸ ساعت از پاکسازی پوست شما می‌گذرد. ضدآفتاب را فراموش نکنید و تا امروز از لایه‌بردار استفاده نکنید.",
      date: addDays(toISO(new Date()), -2),
      time: "11:00",
      read: false,
      href: "/bookings",
    },
    {
      id: "nt-review",
      kind: "review",
      title: "نظر شما منتشر شد",
      body: "ممنون! نظر شما برای نیلفار رستمی ثبت شد و به‌عنوان یک کاربر تأییدشده نمایش داده می‌شود.",
      date: addDays(toISO(new Date()), -3),
      time: "18:40",
      read: true,
      href: "/specialists/sp1",
    },
    {
      id: "nt-promo",
      kind: "promo",
      title: "پنجره‌ی خالی پنجشنبه‌ها",
      body: "سه متخصص منتخب، پنجشنبه‌های این ماه ساعت ۱۷ تا ۲۰ وقت آزاد دارند. رزرو زودهنگام با ۱۵٪ تخفیف.",
      date: addDays(toISO(new Date()), -5),
      time: "10:00",
      read: true,
      href: "/explore?day=thu",
    },
    {
      id: "nt-cancel",
      kind: "booking",
      title: "بازگشت وجه انجام شد",
      body: "مبلغ رزرو لغو‌شده‌ی شما طی ۷۲ ساعت به کیف پول لومرا بازمی‌گردد.",
      date: addDays(toISO(new Date()), -7),
      time: "14:15",
      read: true,
      href: "/bookings",
    },
  );

  return out;
}

export function unreadCount(list: AppNotification[]) {
  return list.filter((n) => !n.read).length;
}

export function isComingSoon(booking: Booking) {
  const mins = untilMinutes(booking.date, booking.time);
  return mins > 0 && mins < 60 * 24;
}
