"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/cn";
import { useLumera } from "@/store/useLumera";
import { buildNotifications, unreadCount } from "@/data/notifications";
import { Avatar } from "@/components/ui/Avatar";
import { IconBell, IconSearch } from "@/components/icons";

const LINKS = [
  { href: "/", label: "خانه" },
  { href: "/explore", label: "کاوش متخصص‌ها" },
  { href: "/services", label: "خدمات" },
  { href: "/bookings", label: "رزروها" },
];

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-md border border-accent/25 bg-accent-soft",
        className,
      )}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#C96CFF"
        strokeWidth="1.7"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M15 4v9.2a4.2 4.2 0 0 1-4.2 4.2H6.4A2.4 2.4 0 0 1 4 15" />
        <circle cx="18.4" cy="6" r="1.1" fill="#C96CFF" stroke="none" />
      </svg>
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const profile = useLumera((s) => s.profile);
  const bookings = useLumera((s) => s.bookings);
  const readIds = useLumera((s) => s.readNotifications);
  const notifications = useMemo(
    () =>
      buildNotifications(bookings).map((n) => ({
        ...n,
        read: n.read || readIds.includes(n.id),
      })),
    [bookings, readIds],
  );
  const unread = unreadCount(notifications);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-line bg-bg/92 backdrop-blur-[7px]"
          : "border-transparent bg-transparent",
      )}
    >
      {/* نسخه‌ی موبایل — باریک و بی‌سروصدا */}
      <div className="flex h-14 items-center gap-3 px-4 lg:hidden">
        <Link
          href="/"
          className="flex items-center gap-2 py-2"
          aria-label="لومرا — خانه"
        >
          <BrandMark />
          <span className="text-[15px] font-extrabold tracking-[0.14em]">
            لومرا
          </span>
          <span className="text-[9.5px] font-bold tracking-[0.22em] text-faint">
            LUMERA
          </span>
        </Link>
        <span className="ms-auto flex items-center gap-1">
          <Link
            href="/explore"
            aria-label="جستجو"
            className="grid h-10 w-10 place-items-center rounded-md text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <IconSearch size={19} />
          </Link>
          <Link
            href="/notifications"
            aria-label={`اعلان‌ها${unread ? `، ${unread} خوانده‌نشده` : ""}`}
            className="relative grid h-10 w-10 place-items-center rounded-md text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <IconBell size={19} />
            {unread > 0 ? (
              <span className="absolute end-1.5 top-1.5 grid h-[15px] min-w-[15px] place-items-center rounded-full bg-accent px-[3px] text-[9.5px] font-bold text-[#180b26]">
                {unread > 9
                  ? "۹+"
                  : ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"][unread]}
              </span>
            ) : null}
          </Link>
        </span>
      </div>

      {/* نسخه‌ی دسکتاپ */}
      <div className="hidden h-16 items-center gap-8 px-6 lg:flex xl:px-10">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="لومرا — خانه"
        >
          <BrandMark />
          <span className="flex items-baseline gap-2">
            <span className="text-[17px] font-extrabold tracking-[0.16em]">
              لومرا
            </span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-faint">
              LUMERA
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="ناوبری اصلی">
          {LINKS.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-[13.5px] font-semibold transition-colors",
                  active ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {l.label}
                {active ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 -bottom-[7px] h-px bg-accent"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/explore"
          className="group ms-auto flex h-10 w-[280px] items-center gap-2.5 rounded-md border border-line bg-surface px-3.5 text-[13px] text-faint transition-colors hover:border-accent/45 hover:text-muted xl:w-[340px]"
        >
          <IconSearch size={16} />
          <span>دنبال چه خدماتی هستی؟</span>
          <kbd className="ms-auto rounded-[4px] border border-line px-1.5 py-[1px] font-sans text-[10px] text-faint">
            /
          </kbd>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link
            href="/notifications"
            aria-label="اعلان‌ها"
            className="relative grid h-10 w-10 place-items-center rounded-md text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <IconBell size={19} />
            {unread > 0 ? (
              <span className="absolute end-1.5 top-1.5 grid h-[15px] min-w-[15px] place-items-center rounded-full bg-accent px-[3px] text-[9.5px] font-bold text-[#180b26]">
                {unread}
              </span>
            ) : null}
          </Link>
          <Link
            href="/account"
            aria-label="حساب کاربری"
            className="flex items-center gap-2 rounded-md p-1 pe-2 transition-colors hover:bg-surface"
          >
            <Avatar
              name={profile.name}
              size="sm"
              category="skin"
              tint="violet"
            />
            <span className="hidden text-[13px] font-semibold text-muted xl:block">
              حساب من
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
