export * from "./types";
export {
  categories,
  categoryById,
  popularServices,
  priceRange,
} from "./categories";
export {
  cities,
  districtsByCity,
  categoryName,
  services,
  serviceById,
  servicesByCategory,
} from "./services";
export {
  specialists,
  specialistById,
  getSpecialist,
  featuredSpecialists,
  activeCities,
  allSkills,
} from "./specialists";
export { reviews, reviewsFor, ratingSummary } from "./reviews";
export { seedBookings, statusMeta, ME, isFuture } from "./bookings";
export { buildNotifications, unreadCount } from "./notifications";
export { defaultUser, defaultFavorites, accountStats } from "./user";
export {
  daySlots,
  freeCount,
  isWorkingDay,
  isPastDate,
  nearestFree,
  upcomingDays,
  jWeekdayIndex,
  weekDaysShort,
} from "./slots";

import { serviceById } from "./services";
import { specialists } from "./specialists";
import { freeCount, isWorkingDay, nearestFree, upcomingDays } from "./slots";
import { toISO } from "@/lib/fa";
import type { Specialist } from "./types";

export type SortKey =
  | "recommended"
  | "rating"
  | "price-asc"
  | "price-desc"
  | "nearest"
  | "earliest";

export const sortLabels: Record<SortKey, string> = {
  recommended: "پیشنهاد لومرا",
  rating: "بیشترین امتیاز",
  "price-asc": "ارزان‌ترین",
  "price-desc": "گران‌ترین",
  nearest: "نزدیک‌ترین",
  earliest: "نزدیک‌ترین وقت آزاد",
};

export interface ExploreFilters {
  q: string;
  demo?: "off" | "empty" | "error";
  cats: string[];
  city: string;
  day: string | null;
  minRating: number;
  maxPrice: number;
  verifiedOnly: boolean;
  freeOnly: boolean;
}

export const emptyFilters: ExploreFilters = {
  q: "",
  cats: [],
  city: "همه",
  day: null,
  minRating: 0,
  maxPrice: 8000000,
  verifiedOnly: false,
  freeOnly: false,
  demo: "off",
};

/** فاصله‌ی ساختگی اما ثابت (کیلومتر) بر پایه‌ی نام — برای مرتب‌سازی «نزدیک‌ترین» */
export function distanceKm(sp: Specialist) {
  const base = Math.abs(
    [...sp.id].reduce((a, c) => a * 31 + c.charCodeAt(0), 11),
  );
  return 0.8 + (base % 140) / 10;
}

export function matchQuery(sp: Specialist, q: string) {
  if (!q.trim()) return true;
  const needle = q.trim().toLowerCase();
  const hay = [
    sp.name,
    sp.title,
    sp.city,
    sp.district,
    sp.studio,
    ...sp.skills,
    ...sp.serviceIds.map((id) => serviceById[id]?.name ?? ""),
  ]
    .join(" ")
    .toLowerCase();
  return needle
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => hay.includes(token));
}

export function filterSpecialists(
  filters: Partial<ExploreFilters>,
  list: Specialist[] = specialists,
): Specialist[] {
  const f = { ...emptyFilters, ...filters };
  const today = toISO(new Date());
  if (f.demo === "empty") return [];
  return list.filter((sp) => {
    if (f.cats.length && !f.cats.includes(sp.categoryId)) return false;
    if (f.city !== "همه" && sp.city !== f.city) return false;
    if (f.verifiedOnly && !sp.verified) return false;
    if (sp.rating < f.minRating) return false;
    const cheapest = Math.min(
      ...sp.serviceIds.map((id) => serviceById[id]?.price ?? Infinity),
    );
    if (cheapest > f.maxPrice) return false;
    if (f.day) {
      const ok = freeCount(sp, f.day) > 0;
      if (!ok) return false;
    }
    if (
      f.freeOnly &&
      !upcomingDays(5, today).some(
        (d) => isWorkingDay(sp, d.iso) && freeCount(sp, d.iso) > 0,
      )
    )
      return false;
    if (!matchQuery(sp, f.q)) return false;
    return true;
  });
}

export function sortSpecialists(
  list: Specialist[],
  sort: SortKey,
  today = toISO(new Date()),
) {
  const copy = [...list];
  const earliest = (sp: Specialist) => {
    const near = nearestFree(sp, today);
    if (!near) return 9999;
    const dayIndex = Math.max(
      0,
      Math.round(
        (new Date(near.iso).getTime() - new Date(today).getTime()) / 86400000,
      ),
    );
    return dayIndex * 100 + Number(near.time.replace(":", "."));
  };
  switch (sort) {
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case "price-asc":
      return copy.sort((a, b) => a.priceFrom - b.priceFrom);
    case "price-desc":
      return copy.sort((a, b) => b.priceFrom - a.priceFrom);
    case "nearest":
      return copy.sort((a, b) => distanceKm(a) - distanceKm(b));
    case "earliest":
      return copy.sort((a, b) => earliest(a) - earliest(b));
    default:
      return copy.sort((a, b) => {
        const score = (s: Specialist) =>
          (s.featured ? 60 : 0) +
          (s.verified ? 12 : 0) +
          s.rating * 6 +
          Math.min(s.reviews, 300) / 60;
        return score(b) - score(a);
      });
  }
}

export function servicesOf(sp: Specialist) {
  return sp.serviceIds.map((id) => serviceById[id]).filter(Boolean);
}

export function minServicePrice(sp: Specialist) {
  const list = servicesOf(sp).map((s) => s.price);
  return list.length ? Math.min(...list) : sp.priceFrom;
}
