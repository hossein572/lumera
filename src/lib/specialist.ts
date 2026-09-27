import { hashString } from "@/lib/rng";
import {
  addDays,
  faDec,
  faNum,
  jDateWeekday,
  relativeDay,
  toISO,
  timeLabel,
} from "@/lib/fa";
import { freeCount, nearestFree } from "@/data/slots";
import { serviceById, servicesByCategory } from "@/data/services";
import type { Service, Specialist } from "@/data/types";

/** فاصله‌ی ساختگی ولی ثابت — برای مرتب‌سازی و برچسب «نزدیک‌ترین» */
export function distanceKm(sp: Specialist) {
  const base = hashString(sp.id + sp.city);
  return 0.6 + (base % 150) / 10;
}

export function distanceLabel(sp: Specialist) {
  const km = distanceKm(sp);
  return km < 1
    ? `${faNum(Math.round(km * 1000))} متر`
    : `${faDec(km)} کیلومتر`;
}

export function servicesOf(sp: Specialist): Service[] {
  return sp.serviceIds
    .map((id) => serviceById[id])
    .filter(Boolean) as Service[];
}

export function minServicePrice(sp: Specialist) {
  const list = servicesOf(sp).map((s) => s.price);
  return list.length ? Math.min(...list) : sp.priceFrom;
}

export interface FirstFree {
  iso: string;
  time: string;
  label: string;
}

export function firstFree(
  sp: Specialist,
  today = toISO(new Date()),
  days = 14,
): FirstFree | null {
  const found = nearestFree(sp, today);
  if (!found) return null;
  void days;
  return {
    ...found,
    label: `${relativeDay(found.iso)} · ${timeLabel(found.time)}`,
  };
}

export function freeToday(sp: Specialist, today = toISO(new Date())) {
  return freeCount(sp, today);
}

export function freeOn(sp: Specialist, iso: string) {
  return freeCount(sp, iso);
}

/** جمعیت روزهای ۱۴ آینده: برای «تقویم شلوغی» و برچسب‌های کمکی */
export function upcomingFree(sp: Specialist, days = 14) {
  const today = toISO(new Date());
  return Array.from({ length: days }, (_, i) => {
    const iso = addDays(today, i);
    return { iso, free: freeOn(sp, iso), weekday: jDateWeekday(iso) };
  });
}

export function topServices(sp: Specialist, n = 3) {
  return servicesOf(sp)
    .slice()
    .sort(
      (a, b) => Number(!!b.popular) - Number(!!a.popular) || a.price - b.price,
    )
    .slice(0, n);
}

/** خدمات محبوب یک دسته — برای صفحه‌ی Home / Explore */
export function popularOfCategory(cat: string, n = 4) {
  return servicesByCategory(cat)
    .filter((s) => s.popular)
    .slice(0, n);
}

export function priceDelta(sp: Specialist) {
  const prices = servicesOf(sp).map((s) => s.price);
  if (!prices.length) return 0;
  return Math.round(
    ((Math.max(...prices) - Math.min(...prices)) / Math.max(...prices)) * 100,
  );
}
