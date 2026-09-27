"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { faNum, jDateLong, relativeDay, timeLabel, toISO } from "@/lib/fa";
import { buildNotifications, unreadCount } from "@/data/notifications";
import { useLumera } from "@/store/useLumera";
import { Badge, Segmented } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  IconBell,
  IconCalendar,
  IconCheckCircle,
  IconCheck,
  IconChevron,
  IconSparkle,
  IconStar,
} from "@/components/icons";

type Kind = "booking" | "promo" | "reminder" | "review";

const KIND_META: Record<
  Kind,
  { label: string; icon: React.ReactNode; color: string }
> = {
  booking: {
    label: "رزرو",
    icon: <IconCalendar size={14} />,
    color: "text-mint",
  },
  reminder: {
    label: "یادآوری",
    icon: <IconBell size={14} />,
    color: "text-amber",
  },
  review: { label: "نظر", icon: <IconStar size={14} />, color: "text-accent" },
  promo: {
    label: "پیشنهاد",
    icon: <IconSparkle size={14} />,
    color: "text-rose",
  },
};

export function NotificationsView() {
  const hydrated = useLumera((s) => s.hydrated);
  const bookings = useLumera((s) => s.bookings);
  const readIds = useLumera((s) => s.readNotifications);
  const markRead = useLumera((s) => s.markRead);
  const markAllRead = useLumera((s) => s.markAllRead);
  const push = useLumera((s) => s.pushToast);
  const [filter, setFilter] = useState<"all" | "unread" | "booking">("all");

  const list = useMemo(
    () =>
      buildNotifications(bookings).map((n) => ({
        ...n,
        read: n.read || readIds.includes(n.id),
      })),
    [bookings, readIds],
  );

  const shown = useMemo(
    () =>
      filter === "all"
        ? list
        : filter === "unread"
          ? list.filter((n) => !n.read)
          : list.filter((n) => n.kind === "booking"),
    [list, filter],
  );

  const unread = unreadCount(list);
  const today = toISO(new Date());

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-[720px] space-y-3 px-4 py-8 sm:px-6">
        <Skeleton className="h-7 w-44" />
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  // گروه‌بندی زمانی
  const groups = [
    {
      key: "today",
      label: "امروز",
      items: shown.filter((n) => n.date === today),
    },
    {
      key: "week",
      label: "این هفته",
      items: shown.filter(
        (n) =>
          n.date !== today &&
          jDateLong(n.date) &&
          relativeDay(n.date).includes("روز"),
      ),
    },
    {
      key: "older",
      label: "قدیمی‌تر",
      items: shown.filter(
        (n) =>
          n.date !== today &&
          !relativeDay(n.date).includes("روز") &&
          !relativeDay(n.date).includes("ساعت"),
      ),
    },
  ].filter((g) => g.items.length);

  return (
    <div className="mx-auto w-full max-w-[720px] px-4 pb-6 pt-4 sm:px-6 lg:pt-6">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <span className="eyebrow">مرکز اعلان</span>
          <h1 className="mt-2.5 text-[23px] font-extrabold leading-tight sm:text-[26px]">
            اعلان‌ها
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
            وضعیت رزروها، یادآوری مراقبت و ظرفیت‌های تازه — بدون سروصدا، فقط
            آنچه لازم است.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 ? (
            <Badge tone="violet">{faNum(unread)} خوانده‌نشده</Badge>
          ) : (
            <Badge tone="mint">همه خوانده شد</Badge>
          )}
          <Button
            size="sm"
            variant="outline"
            leading={<IconCheck size={13} strokeWidth={2.6} />}
            disabled={!unread}
            onClick={() => {
              markAllRead(list.map((n) => n.id));
              push({ text: "همه‌ی اعلان‌ها خوانده شد", tone: "success" });
            }}
          >
            علامت‌گذاری همه
          </Button>
        </div>
      </header>

      <Segmented
        ariaLabel="فیلتر اعلان‌ها"
        className="w-full sm:w-auto"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "همه", count: list.length },
          { value: "unread", label: "خوانده‌نشده", count: unread },
          {
            value: "booking",
            label: "رزرو",
            count: list.filter((n) => n.kind === "booking").length,
          },
        ]}
      />

      <div className="mt-4 space-y-6">
        {groups.length ? (
          groups.map((g) => (
            <section key={g.key}>
              <h2 className="mb-2.5 flex items-center gap-2 text-[11.5px] font-bold text-faint">
                {g.label}
                <span className="h-px flex-1 bg-line-soft" />
                {faNum(g.items.length)}
              </h2>
              <ul className="space-y-2.5">
                {g.items.map((n) => {
                  const meta = KIND_META[n.kind];
                  return (
                    <li key={n.id}>
                      <Link
                        href={n.href ?? "#"}
                        onClick={() => markRead(n.id)}
                        className={cn(
                          "group flex items-start gap-3 rounded-lg border p-3.5 transition-colors",
                          n.read
                            ? "border-line-soft bg-surface/60"
                            : "border-line bg-surface hover:border-accent/35",
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-9 w-9 shrink-0 place-items-center rounded-md border",
                            n.read
                              ? "border-line bg-surface-2/60 text-faint"
                              : cn("border-line bg-surface-2", meta.color),
                          )}
                        >
                          {meta.icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                "text-[13.5px] leading-snug",
                                n.read
                                  ? "font-semibold text-muted"
                                  : "font-bold text-ink",
                              )}
                            >
                              {n.title}
                            </span>
                            {!n.read ? (
                              <span
                                className="h-1.5 w-1.5 rounded-full bg-accent"
                                aria-label="خوانده نشده"
                              />
                            ) : null}
                          </span>
                          <span className="mt-1 block text-[12.5px] leading-relaxed text-muted">
                            {n.body}
                          </span>
                          <span className="mt-2 flex items-center gap-2 text-[11px] text-faint">
                            <span>{relativeDay(n.date)}</span>
                            {n.time ? (
                              <span>· ساعت {timeLabel(n.time)}</span>
                            ) : null}
                            <span>· {meta.label}</span>
                            {n.bookingCode ? (
                              <span className="rounded-xs border border-line px-1.5 py-[1px] font-bold text-muted">
                                {n.bookingCode}
                              </span>
                            ) : null}
                          </span>
                        </span>
                        <IconChevron
                          dir="end"
                          size={15}
                          className="mt-1 shrink-0 text-faint transition-transform group-hover:-translate-x-0.5"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        ) : (
          <EmptyState
            glyph={<IconCheckCircle size={18} />}
            tint="mint"
            title={
              filter === "unread"
                ? "اعلان خوانده‌نشده‌ای نیست"
                : "جعبه خالی — به‌معنی خوب"
            }
            body={
              filter === "unread"
                ? "همه‌ی اعلان‌ها را دیدید. وقتی زمان رزروتان نزدیک شود، همین‌جا به شما یادآوری می‌کنیم."
                : "هنوز اعلانی برای این حساب ثبت نشده است."
            }
            action={{ label: "بازگشت به رزروها", href: "/bookings" }}
            secondary={{ label: "کاوش متخصص‌ها", href: "/explore" }}
          />
        )}
      </div>
    </div>
  );
}
