import { toISO } from "@/lib/fa";
import { hashString, rngFrom } from "@/lib/rng";
import { specialists } from "./specialists";
import type { SlotState, Specialist } from "./types";

export interface Slot {
  time: string;
  state: SlotState;
}

const pad = (n: number) => `${n}`.padStart(2, "0");

export function jWeekdayIndex(date: Date): number {
  return (date.getDay() + 1) % 7;
}

/** آیا متخصص در این روز کاری می‌کند؟ */
export function isWorkingDay(sp: Specialist, iso: string): boolean {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return sp.workingDays.includes(jWeekdayIndex(date));
}

export function isToday(iso: string): boolean {
  return iso === toISO(new Date());
}

export function isPastDate(iso: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1).getTime() < today.getTime();
}

/**
 * ظرفیت روزانه‌ی متخصص.
 * الگوی شلوغی واقعی‌نما: عصرها و پنجشنبه‌ها شلوغ‌تر، روزهای آخر هفته سالن خلوت‌تر.
 */
export function daySlots(
  sp: Specialist,
  iso: string,
  opts?: { extraTaken?: string[] },
): Slot[] {
  if (isPastDate(iso) || !isWorkingDay(sp, iso)) return [];
  const [sh, sm] = sp.dayStart.split(":").map(Number);
  const [eh, em] = sp.dayEnd.split(":").map(Number);
  const startMin = (sh ?? 9) * 60 + (sm ?? 0);
  const endMin = (eh ?? 19) * 60 + (em ?? 0);
  const step = sp.slotStep ?? 30;
  const rand = rngFrom(`${sp.id}:${iso}`);
  const [, weekday] = iso.split("-").map(Number);
  const [y, m, d] = iso.split("-").map(Number);
  const wd = jWeekdayIndex(new Date(y, (m ?? 1) - 1, d ?? 1));
  const dayFactor = wd === 5 ? 1.35 : wd === 6 ? 1.15 : 1;
  const extra = new Set(opts?.extraTaken ?? []);

  const out: Slot[] = [];
  for (let mins = startMin; mins + 60 <= endMin; mins += step) {
    const time = `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
    if (extra.has(time)) {
      out.push({ time, state: "booked" });
      continue;
    }
    // ناهار: یک بازه‌ی بسته در میانه‌ی روز، برای همه‌ی متخصص‌ها
    const lunch = Math.floor((startMin + endMin) / 2 / step) * step;
    if (mins === lunch && hashString(sp.id) % 3 !== 0) {
      out.push({ time, state: "blocked" });
      continue;
    }
    const hourBias = mins >= 16 * 60 ? 1.25 : mins < 12 * 60 ? 0.8 : 1;
    const bookedProb = Math.min(
      0.92,
      sp.busyRate * dayFactor * hourBias * (0.85 + rand() * 0.3),
    );
    out.push({ time, state: rand() < bookedProb ? "booked" : "free" });
  }
  // امروز: زمان‌های گذشته قابل رزرو نیستند
  if (isToday(iso)) {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes() + 90; // ۹۰ دقیقه زمان آماده‌سازی
    for (const slot of out) {
      const [h, mi] = slot.time.split(":").map(Number);
      if ((h ?? 0) * 60 + (mi ?? 0) < nowMin && slot.state === "free")
        slot.state = "blocked";
    }
  }
  void weekday;
  return out;
}

export function freeCount(sp: Specialist, iso: string): number {
  return daySlots(sp, iso).filter((s) => s.state === "free").length;
}

export interface NearestSlot {
  iso: string;
  time: string;
}

/** نزدیک‌ترین وقت آزاد در ۱۴ روز آینده */
export function nearestFree(
  sp: Specialist,
  fromISO: string,
  taken?: Map<string, string[]>,
): NearestSlot | null {
  const [y, m, d] = fromISO.split("-").map(Number);
  const cursor = new Date(y, (m ?? 1) - 1, d ?? 1);
  for (let i = 0; i < 14; i++) {
    const iso = toISO(cursor);
    const slots = daySlots(sp, iso, {
      extraTaken: taken?.get(`${sp.id}|${iso}`),
    });
    const free = slots.find((s) => s.state === "free");
    if (free) return { iso, time: free.time };
    cursor.setDate(cursor.getDate() + 1);
  }
  return null;
}

export const weekDaysShort = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

/** ۱۴ روز آینده برای نوار انتخاب سریع تاریخ */
export function upcomingDays(count = 14, fromISO = toISO(new Date())) {
  const [y, m, d] = fromISO.split("-").map(Number);
  const base = new Date(y, (m ?? 1) - 1, d ?? 1);
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(base);
    date.setDate(base.getDate() + i);
    return { iso: toISO(date), date };
  });
}

export function seedTakenKey(specialistId: string, iso: string) {
  return `${specialistId}|${iso}`;
}

export function slotKey(specialistId: string, iso: string, time: string) {
  return `${specialistId}|${iso}|${time}|${hashString(iso + time) % 97}`;
}
