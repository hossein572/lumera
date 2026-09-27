"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { useToday } from "@/hooks/use-today";
import { useLumera } from "@/store/useLumera";
import {
  IconCalendar,
  IconHeart,
  IconHome,
  IconSearch,
  IconUser,
} from "@/components/icons";

const ITEMS = [
  { href: "/", label: "خانه", icon: IconHome, match: (p: string) => p === "/" },
  {
    href: "/explore",
    label: "جستجو",
    icon: IconSearch,
    match: (p: string) => p.startsWith("/explore") || p.startsWith("/services"),
  },
  {
    href: "/bookings",
    label: "رزروها",
    icon: IconCalendar,
    match: (p: string) => p.startsWith("/bookings") || p.startsWith("/booking"),
  },
  {
    href: "/favorites",
    label: "علاقه‌مندی",
    icon: IconHeart,
    match: (p: string) => p.startsWith("/favorites"),
  },
  {
    href: "/account",
    label: "پروفایل",
    icon: IconUser,
    match: (p: string) =>
      p.startsWith("/account") || p.startsWith("/notifications"),
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const bookings = useLumera((s) => s.bookings);
  const today = useToday();
  const upcoming = useMemo(
    () =>
      bookings.filter(
        (b) =>
          b.userId === "me" &&
          b.date >= today &&
          (b.status === "confirmed" || b.status === "pending"),
      ).length,
    [bookings, today],
  );
  const favorites = useLumera((s) => s.favorites.length);

  return (
    <nav
      aria-label="ناوبری اصلی"
      className="fixed inset-x-0 bottom-0 z-60 px-3 pb-[max(0.625rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="mx-auto flex max-w-[520px] items-stretch gap-0.5 rounded-lg border border-line bg-bg-2/97 p-1 shadow-[0_-10px_40px_-24px_rgba(0,0,0,0.9)] backdrop-blur-[6px]">
        {ITEMS.map((it) => {
          const active = it.match(pathname);
          const Icon = it.icon;
          const dot =
            it.href === "/bookings"
              ? upcoming
              : it.href === "/favorites"
                ? favorites
                : 0;
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-md py-2 transition-colors duration-150",
                active
                  ? "bg-surface-2/80 text-ink"
                  : "text-faint hover:text-muted",
              )}
            >
              <span className="relative">
                <Icon
                  size={19}
                  className={cn(
                    "transition-transform duration-200",
                    active ? "scale-100 text-accent" : "group-active:scale-90",
                  )}
                />
                {dot > 0 ? (
                  <span className="absolute -end-1.5 -top-1 grid h-[13px] min-w-[13px] place-items-center rounded-full bg-mint px-[2px] text-[8.5px] font-extrabold text-[#04231d]">
                    {dot > 9
                      ? "۹+"
                      : ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"][dot]}
                  </span>
                ) : null}
              </span>
              <span
                className={cn(
                  "text-[10px] font-semibold leading-none",
                  active && "text-ink",
                )}
              >
                {it.label}
              </span>
              {active ? (
                <span
                  aria-hidden
                  className="absolute -top-px h-[2px] w-6 rounded-full bg-accent"
                />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
