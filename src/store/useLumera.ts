"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addDays, todayISO } from "@/lib/fa";
import { seedBookings } from "@/data/bookings";
import { defaultFavorites, defaultUser } from "@/data/user";
import type { Booking, Draft, UserProfile } from "@/data/types";

export const emptyDraft: Draft = {
  specialistId: null,
  serviceId: null,
  date: null,
  time: null,
  name: "",
  phone: "",
  note: "",
  payAtVenue: true,
  agreed: false,
};

export interface Toast {
  id: number;
  text: string;
  tone?: "neutral" | "success" | "warn";
  action?: { label: string; href: string };
}

interface LumeraState {
  hydrated: boolean;
  setHydrated: (v: boolean) => void;

  bookings: Booking[];
  addBooking: (
    b: Omit<Booking, "id" | "code" | "createdAt" | "userId">,
  ) => Booking;
  cancelBooking: (id: string) => void;
  rescheduleBooking: (id: string, date: string, time: string) => void;

  favorites: string[];
  toggleFavorite: (id: string) => void;

  readNotifications: string[];
  markRead: (id: string) => void;
  markAllRead: (ids: string[]) => void;

  profile: UserProfile;
  setProfile: (patch: Partial<UserProfile>) => void;
  saveAddress: (a: UserProfile["addresses"][number]) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  draft: Draft;
  step: number;
  setDraft: (patch: Partial<Draft>) => void;
  setStep: (n: number) => void;
  resetDraft: (specialistId?: string | null, serviceId?: string | null) => void;

  toasts: Toast[];
  pushToast: (t: Omit<Toast, "id">) => void;
  dropToast: (id: number) => void;
}

let toastSeq = 1;

export const useLumera = create<LumeraState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),

      bookings: [],
      addBooking: (b) => {
        const index = get().bookings.length;
        const created: Booking = {
          ...b,
          id: `bk-live-${Date.now()}`,
          code: `LM-${1000 + ((index * 37 + 11) % 8900)}`,
          createdAt: todayISO(),
          userId: "me",
        };
        set({
          bookings: [created, ...get().bookings],
          draft: emptyDraft,
          step: 0,
        });
        return created;
      },
      cancelBooking: (id) =>
        set({
          bookings: get().bookings.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status: "cancelled",
                  cancelledBy: "user",
                  reason: "انصراف از سوی مشتری",
                }
              : b,
          ),
        }),
      rescheduleBooking: (id, date, time) =>
        set({
          bookings: get().bookings.map((b) =>
            b.id === id ? { ...b, date, time, status: "pending" } : b,
          ),
        }),

      favorites: defaultFavorites,
      toggleFavorite: (id) => {
        const cur = get().favorites;
        set({
          favorites: cur.includes(id)
            ? cur.filter((x) => x !== id)
            : [id, ...cur],
        });
      },

      readNotifications: [],
      markRead: (id) =>
        set({
          readNotifications: Array.from(
            new Set([...get().readNotifications, id]),
          ),
        }),
      markAllRead: (ids) =>
        set({
          readNotifications: Array.from(
            new Set([...get().readNotifications, ...ids]),
          ),
        }),

      profile: defaultUser,
      setProfile: (patch) => set({ profile: { ...get().profile, ...patch } }),
      saveAddress: (a) => {
        const list = get().profile.addresses;
        const exists = list.some((x) => x.id === a.id);
        const next = exists
          ? list.map((x) => (x.id === a.id ? a : x))
          : [...list, a];
        set({ profile: { ...get().profile, addresses: next } });
      },
      removeAddress: (id) =>
        set({
          profile: {
            ...get().profile,
            addresses: get().profile.addresses.filter((a) => a.id !== id),
          },
        }),
      setDefaultAddress: (id) =>
        set({
          profile: {
            ...get().profile,
            addresses: get().profile.addresses.map((a) => ({
              ...a,
              isDefault: a.id === id,
            })),
          },
        }),

      draft: emptyDraft,
      step: 0,
      setDraft: (patch) => set({ draft: { ...get().draft, ...patch } }),
      setStep: (n) => set({ step: Math.max(0, Math.min(5, n)) }),
      resetDraft: (specialistId = null, serviceId = null) =>
        set({
          draft: { ...emptyDraft, specialistId, serviceId },
          step: serviceId ? 1 : 0,
        }),

      toasts: [],
      pushToast: (t) => {
        const id = toastSeq++;
        set({ toasts: [...get().toasts, { ...t, id }].slice(-3) });
        setTimeout(() => get().dropToast(id), 3800);
      },
      dropToast: (id) =>
        set({ toasts: get().toasts.filter((t) => t.id !== id) }),
    }),
    {
      name: "lumera-store-v1",
      partialize: (state) => ({
        bookings: state.bookings,
        favorites: state.favorites,
        profile: state.profile,
        readNotifications: state.readNotifications,
        draft: state.draft,
        step: state.step,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<LumeraState>;
        const live = Array.isArray(p.bookings) ? p.bookings : [];
        return {
          ...current,
          ...p,
          bookings: live.length ? live : seedBookings(),
          hydrated: true,
        };
      },
      onRehydrateStorage: () => (state) => {
        if (!state?.bookings?.length) {
          state?.setHydrated?.(true);
          return;
        }
        state?.setHydrated?.(true);
      },
    },
  ),
);

/** اولین رندر کلاینت: اگر داده‌ای در localStorage نبود، دمو را بکار. */
export function ensureSeed() {
  const { bookings, setHydrated } = useLumera.getState();
  if (!bookings.length) useLumera.setState({ bookings: seedBookings() });
  setHydrated(true);
}

/** زمان‌های رزرو‌شده توسط خود کاربر، به‌صورت کلید `spId|iso` */
export function takenByUser(
  bookings: Booking[],
  specialistId: string,
  iso: string,
) {
  return bookings
    .filter(
      (b) =>
        b.specialistId === specialistId &&
        b.date === iso &&
        b.status !== "cancelled",
    )
    .map((b) => b.time);
}

export function upcomingBookings(bookings: Booking[]) {
  const today = todayISO();
  return bookings
    .filter(
      (b) =>
        b.userId === "me" &&
        b.date >= today &&
        (b.status === "confirmed" || b.status === "pending"),
    )
    .sort((a, b) => (a.date + a.time > b.date + b.time ? 1 : -1));
}

export function pastBookings(bookings: Booking[]) {
  const today = todayISO();
  return bookings
    .filter(
      (b) =>
        b.userId === "me" &&
        (b.date < today ||
          b.status === "completed" ||
          b.status === "cancelled"),
    )
    .sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1));
}

export function nextFreeAfterDraft(
  specialistId: string | null,
  from = todayISO(),
) {
  if (!specialistId) return null;
  return {
    specialistId,
    from,
    days: Array.from({ length: 7 }, (_, i) => addDays(from, i)),
  };
}
