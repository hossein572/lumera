/** ابزارهای تاریخ و عدد فارسی — بدون وابستگی خارجی، بر پایه Intl */

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const WEEKDAY_SHORT = [
  "شنبه",
  "یک‌شنبه",
  "دو‌شنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];
const WEEKDAY_MIN = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
const MONTHS_FA = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

/** "12000000" → «۱۲٬۰۰۰٬۰۰۰» — رقم و جداکننده‌ی فارسی، گروه سه‌رقمی */
export function toman(value: number): string {
  return new Intl.NumberFormat("fa-IR", { useGrouping: true }).format(
    Math.max(0, Math.round(value)),
  );
}

export function price(value: number, withUnit = true): string {
  return withUnit ? `${toman(value)} تومان` : toman(value);
}

export function faNum(value: number | string): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

/** عدد اعشاری با ممیز فارسی: 4.9 → «۴٫۹» */
export function faDec(value: number, digits = 1): string {
  return faNum(value.toFixed(digits)).replace(".", "٫");
}

/** تبدیل ارقام لاتین داخل هر رشته به فارسی */
export function fa(text: string): string {
  return text.replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

export function stars(rating: number): string {
  return `${faDec(rating)} از ۵`;
}

/* ---------------------------------- تاریخ ---------------------------------- */

export function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

const faDate = new Intl.DateTimeFormat("en-u-ca-persian", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

function parts(iso: string) {
  const date = fromISO(iso);
  const formatted = faDate.formatToParts(date);
  const pick = (t: Intl.DateTimeFormatPartTypes) =>
    Number(formatted.find((p) => p.type === t)?.value ?? "0");
  const year = pick("year");
  const month = pick("month");
  const day = pick("day");
  return { date, year, month, day, weekday: weekdayIndex(date) };
}

/** شنبه = ۰ */
export function weekdayIndex(date: Date): number {
  return (date.getDay() + 1) % 7;
}

export function weekdayName(
  w: number,
  mode: "long" | "short" | "min" = "long",
) {
  if (mode === "min") return WEEKDAY_MIN[w] ?? "";
  if (mode === "short") return (WEEKDAY_SHORT[w] ?? "").replace("‌شنبه", "");
  return WEEKDAY_SHORT[w] ?? "";
}

export function monthName(m: number) {
  return MONTHS_FA[(m - 1 + 12) % 12] ?? "";
}

export function jDay(iso: string) {
  return parts(iso).day;
}

export function jMonthLabel(iso: string) {
  const { year, month } = parts(iso);
  return `${monthName(month)} ${faNum(year)}`;
}

/** «۱۴ مهر ۱۴۰۴» */
export function jDateLong(iso: string) {
  const { year, month, day } = parts(iso);
  return `${faNum(day)} ${monthName(month)} ${faNum(year)}`;
}

/** «یک‌شنبه ۱۴ مهر» */
export function jDateWeekday(iso: string) {
  const { month, day, weekday } = parts(iso);
  return `${weekdayName(weekday)} ${faNum(day)} ${monthName(month)}`;
}

/** «یک‌شنبه ۱۴ مهر ۱۴۰» */
export function jDateFull(iso: string) {
  return `${jDateWeekday(iso)} ${faNum(parts(iso).year)}`;
}

export function jShort(iso: string) {
  const { year, month, day } = parts(iso);
  return `${faNum(year)}/${`${month}`.padStart(2, "0")}/${`${day}`.padStart(2, "0")}`.replace(
    /(\d{4})\/(\d{2})\/(\d{2})/,
    (_m, y, mo, d) => `${y}/${mo}/${d}`,
  );
}

export function todayISO(): string {
  return toISO(new Date());
}

export function addDays(iso: string, days: number): string {
  const d = fromISO(iso);
  d.setDate(d.getDate() + days);
  return toISO(d);
}

export function diffDays(iso: string, fromIso = todayISO()): number {
  const a = fromISO(iso).setHours(0, 0, 0, 0);
  const b = fromISO(fromIso).setHours(0, 0, 0, 0);
  return Math.round((a - b) / 86400000);
}

export function isPast(iso: string) {
  return diffDays(iso) < 0;
}

/** «امروز»، «فردا»، «۳ روز دیگر»، «۲ روز پیش» */
export function relativeDay(iso: string): string {
  const d = diffDays(iso);
  if (d === 0) return "امروز";
  if (d === 1) return "فردا";
  if (d === -1) return "دیروز";
  if (d > 1 && d < 7) return `${faNum(d)} روز دیگر`;
  if (d < -1 && d > -7) return `${faNum(Math.abs(d))} روز پیش`;
  return jDateLong(iso);
}

/** عبارت نسبی فقط برای بازه‌ی نزدیک؛ برای تاریخ‌های دور null تا تکرار نشود */
export function nearDay(iso: string): string | null {
  const d = diffDays(iso);
  if (d === 0) return "امروز";
  if (d === 1) return "فردا";
  if (d === -1) return "دیروز";
  if (d > 1 && d < 7) return `${faNum(d)} روز دیگر`;
  if (d < -1 && d > -7) return `${faNum(Math.abs(d))} روز پیش`;
  return null;
}

/** «۲۰ ساعت مانده» / «۴۵ دقیقه مانده» */
export function untilMinutes(iso: string, time: string): number {
  const [h, m] = time.split(":").map(Number);
  const d = fromISO(iso);
  d.setHours(h ?? 0, m ?? 0, 0, 0);
  return Math.round((d.getTime() - Date.now()) / 60000);
}

export function countdownLabel(iso: string, time: string): string {
  const mins = untilMinutes(iso, time);
  if (mins <= 0) return "در حال انجام";
  if (mins < 60) return `${faNum(mins)} دقیقه مانده`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${faNum(hours)} ساعت مانده`;
  const days = Math.round(hours / 24);
  return `${faNum(days)} روز مانده`;
}

/* ----------------------------------- ساعت ---------------------------------- */

export function timeLabel(t: string): string {
  const [hRaw, mRaw] = t.split(":");
  const h = Number(hRaw);
  const m = Number(mRaw);
  const h24 = (h % 12 || 12) as number;
  return `${faNum(h24)}:${faNum(`${m}`.padStart(2, "0"))}`;
}

export function dayPart(t: string): "صبح" | "ظهر" | "عصر" | "شب" {
  const h = Number(t.split(":")[0]);
  if (h < 12) return "صبح";
  if (h < 15) return "ظهر";
  if (h < 19) return "عصر";
  return "شب";
}

export function periodLabel(t: string): string {
  return Number(t.split(":")[0]) < 12 ? "ق.ظ" : "ب.ظ";
}

/** «۶۰ دقیقه» → «۱ ساعت» */
export function durationLabel(minutes: number): string {
  if (minutes < 60) return `${faNum(minutes)} دقیقه`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return h === 1 ? "۱ ساعت" : `${faNum(h)} ساعت`;
  return `${faNum(h)} ساعت و ${faNum(m)} دقیقه`;
}

export function endsAt(start: string, minutes: number): string {
  const [h, m] = start.split(":").map(Number);
  const total = (h ?? 0) * 60 + (m ?? 0) + minutes;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${`${hh}`.padStart(2, "0")}:${`${mm}`.padStart(2, "0")}`;
}

/* ---------------------------------- رشته‌ها --------------------------------- */

export function initials(name: string): string {
  return name
    .replace("دکتر ", "")
    .replace("مهندس ", "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

export function maskPhone(phone: string): string {
  return phone.replace(/^(\+98|0)?(9\d{2})(\d{3})(\d{4})$/, (_m, _p, a, b, c) =>
    [fa(`0${a}`), fa(b), "•••", fa(c)].join(" "),
  );
}

export function bookingRef(seed: string | number): string {
  const n =
    typeof seed === "number"
      ? seed
      : Math.abs(
          [...String(seed)].reduce((a, c) => a * 31 + c.charCodeAt(0), 7),
        );
  return `LM-${faNum(String(1000 + (n % 9000)))}`;
}

export function pluralFa(n: number, word: string) {
  return `${faNum(n)} ${word}`;
}
