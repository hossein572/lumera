"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { faNum, jDateFull, maskPhone, price, toISO } from "@/lib/fa";
import { accountStats } from "@/data/user";
import { useLumera } from "@/store/useLumera";
import type { UserAddress, UserProfile } from "@/data/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, Toggle } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Field } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Overlay";
import { Skeleton } from "@/components/ui/Skeleton";
import { MetaRow } from "@/components/ui/Cards";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  IconAlert,
  IconBell,
  IconCalendar,
  IconCheck,
  IconCheckCircle,
  IconChevron,
  IconHeart,
  IconLock,
  IconPin,
  IconPlus,
  IconShield,
  IconTrash,
  IconUser,
  IconWallet,
} from "@/components/icons";

export function AccountView() {
  const hydrated = useLumera((s) => s.hydrated);
  const profile = useLumera((s) => s.profile);
  const setProfile = useLumera((s) => s.setProfile);
  const removeAddress = useLumera((s) => s.removeAddress);
  const saveAddress = useLumera((s) => s.saveAddress);
  const setDefaultAddress = useLumera((s) => s.setDefaultAddress);
  const bookings = useLumera((s) => s.bookings);
  const favorites = useLumera((s) => s.favorites);
  const push = useLumera((s) => s.pushToast);

  const [overrides, setOverrides] = useState<Partial<UserProfile>>({});
  const [editing, setEditing] = useState(false);
  const [addrSheet, setAddrSheet] = useState(false);
  const [outSheet, setOutSheet] = useState(false);
  const [draftAddr, setDraftAddr] = useState<UserAddress | null>(null);
  const [prefs, setPrefs] = useState({
    sms: true,
    reminders: true,
    offers: false,
  });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const form = { ...profile, ...overrides };

  const mine = useMemo(
    () => bookings.filter((b) => b.userId === "me"),
    [bookings],
  );
  const upcoming = mine.filter(
    (b) =>
      b.date >= toISO(new Date()) &&
      (b.status === "confirmed" || b.status === "pending"),
  ).length;

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-[1000px] space-y-3 px-4 py-8 sm:px-6 lg:px-10">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  function save() {
    const e: typeof errors = {};
    if (form.name.trim().length < 3) e.name = "نام را کامل بنویسید.";
    if (!/^09\d{9}$/.test(form.phone.trim()))
      e.phone = "شماره موبایل معتبر نیست.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setProfile({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email,
      birthDate: form.birthDate,
      skinNote: form.skinNote,
    });
    setOverrides({});
    setEditing(false);
    push({ text: "اطلاعات حساب ذخیره شد", tone: "success" });
  }

  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 pb-6 pt-4 sm:px-6 lg:px-10 lg:pt-6">
      {/* سربرگ حساب */}
      <header className="relative overflow-hidden rounded-lg border border-line bg-surface p-4 sm:p-5">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-24 -end-20 h-56 w-56 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(201,108,255,0.14), transparent)",
          }}
        />
        <div className="relative flex flex-wrap items-center gap-4">
          <Avatar name={profile.name} category="skin" tint="violet" size="xl" />
          <div className="min-w-0 flex-1">
            <h1 className="text-[21px] font-extrabold leading-tight sm:text-[24px]">
              {profile.name}
            </h1>
            <MetaRow
              className="mt-1"
              items={[
                maskPhone(profile.phone),
                profile.email,
                <span key="b" className="inline-flex items-center gap-1">
                  <IconCalendar size={12} className="text-faint" />
                  متولد {jDateFull(profile.birthDate)}
                </span>,
              ]}
            />
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Button
              variant="outline"
              size="md"
              onClick={() => setEditing((v) => !v)}
            >
              {editing ? "انصراف" : "ویرایش اطلاعات"}
            </Button>
            <LinkButton
              href="/notifications"
              size="md"
              variant="ghost"
              trailing={<IconChevron dir="end" size={14} />}
            >
              اعلان‌ها
            </LinkButton>
          </div>
        </div>

        <div className="relative mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-4">
          <Cell
            label="رزرو پیشِ‌رو"
            value={faNum(upcoming)}
            icon={<IconCalendar size={13} />}
          />
          <Cell
            label="جلسه‌ی انجام‌شده"
            value={faNum(accountStats.trips)}
            icon={<IconCheckCircle size={13} />}
          />
          <Cell
            label="ذخیره‌ی قیمت"
            value={`${price(accountStats.saved, false)}`}
            suffix="تومان"
            icon={<IconWallet size={13} />}
          />
          <Cell
            label="علاقه‌مندی"
            value={faNum(favorites.length)}
            icon={<IconHeart size={13} />}
          />
        </div>
      </header>

      {/* ناوبری سریع */}
      <nav
        className="mt-4 grid gap-2.5 sm:grid-cols-3"
        aria-label="بخش‌های حساب"
      >
        {[
          {
            href: "/bookings",
            label: "رزروهای من",
            note: `${faNum(mine.length)} مورد`,
            icon: <IconCalendar size={15} />,
          },
          {
            href: "/favorites",
            label: "علاقه‌مندی‌ها",
            note: `${faNum(favorites.length)} متخصص`,
            icon: <IconHeart size={15} />,
          },
          {
            href: "/notifications",
            label: "اعلان‌ها",
            note: "یادآوری و وضعیت رزرو",
            icon: <IconBell size={15} />,
          },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group flex items-center gap-3 rounded-md border border-line bg-surface px-3.5 py-3 transition-colors hover:border-accent/40"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-line bg-surface-2 text-accent">
              {l.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-bold">
                {l.label}
              </span>
              <span className="block truncate text-[11.5px] text-faint">
                {l.note}
              </span>
            </span>
            <IconChevron
              dir="end"
              size={15}
              className="shrink-0 text-faint transition-transform group-hover:-translate-x-0.5"
            />
          </Link>
        ))}
      </nav>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* اطلاعات شخصی */}
        <section className="rounded-lg border border-line bg-surface p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-[15px] font-bold">
              <IconUser size={15} className="text-faint" />
              اطلاعات شخصی
            </h2>
            {editing ? <Badge tone="violet">در حال ویرایش</Badge> : null}
          </div>

          {editing ? (
            <div className="space-y-3.5">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Input
                  label="نام و نام خانوادگی"
                  value={form.name}
                  error={errors.name}
                  onChange={(e) => setOverrides({ name: e.target.value })}
                />
                <Input
                  label="شماره موبایل"
                  dir="ltr"
                  className="text-end tabular-nums"
                  value={form.phone}
                  error={errors.phone}
                  onChange={(e) =>
                    setOverrides({
                      phone: e.target.value.replace(/\D/g, "").slice(0, 11),
                    })
                  }
                />
                <Input
                  label="ایمیل"
                  type="email"
                  dir="ltr"
                  className="text-end"
                  value={form.email}
                  onChange={(e) => setOverrides({ email: e.target.value })}
                />
                <Field
                  label="تاریخ تولد (برای تخفیف تولد)"
                  hint="قالب: ۱۳۷/۰۴/۸"
                >
                  <input
                    value={form.birthDate}
                    onChange={(e) =>
                      setOverrides({ birthDate: e.target.value })
                    }
                    dir="ltr"
                    className="h-12 w-full rounded-md border border-line bg-bg-2 px-3.5 text-end text-[15px] tabular-nums outline-none transition-colors focus:border-accent/70"
                  />
                </Field>
              </div>
              <Textarea
                label="نکته‌ی پوستی برای متخصص‌ها"
                value={form.skinNote}
                onChange={(e) => setOverrides({ skinNote: e.target.value })}
                hint="این متن هنگام رزرو برای متخصص نمایش داده می‌شود."
              />
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  onClick={save}
                  leading={<IconCheck size={15} strokeWidth={2.6} />}
                >
                  ذخیره‌ی تغییرات
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setOverrides({});
                    setEditing(false);
                    setErrors({});
                  }}
                >
                  بازگردانی
                </Button>
              </div>
            </div>
          ) : (
            <dl className="divide-y divide-[color:var(--color-line-soft)]">
              {[
                { k: "نام", v: profile.name },
                { k: "موبایل", v: maskPhone(profile.phone) },
                { k: "ایمیل", v: profile.email },
                { k: "تاریخ تولد", v: jDateFull(profile.birthDate) },
                { k: "نکته‌ی پوستی", v: profile.skinNote },
              ].map((r) => (
                <div
                  key={r.k}
                  className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <dt className="w-[92px] shrink-0 text-[11.5px] text-faint">
                    {r.k}
                  </dt>
                  <dd className="min-w-0 flex-1 text-[13.5px] font-semibold leading-relaxed">
                    {r.v}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        {/* ستون کناری */}
        <aside className="space-y-4">
          <section className="rounded-lg border border-line bg-surface p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-[14px] font-bold">
                <IconPin size={14} className="text-faint" />
                آدرس‌ها
              </h2>
              <button
                type="button"
                onClick={() => {
                  setDraftAddr({
                    id: `ad-${Date.now()}`,
                    label: "جدید",
                    city: "تهران",
                    district: "",
                    detail: "",
                  });
                  setAddrSheet(true);
                }}
                className="inline-flex h-7 items-center gap-1 rounded-xs border border-line px-2 text-[11.5px] font-bold text-muted transition-colors hover:text-ink"
              >
                <IconPlus size={11} />
                افزودن
              </button>
            </div>
            {profile.addresses.length ? (
              <ul className="space-y-2.5">
                {profile.addresses.map((a) => (
                  <li
                    key={a.id}
                    className={cn(
                      "group relative rounded-md border px-3 py-2.5 transition-colors",
                      a.isDefault
                        ? "border-accent/45 bg-accent/[0.06]"
                        : "border-line bg-bg-2/50",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 text-[13px] font-bold">
                          {a.label}
                          {a.isDefault ? (
                            <Badge tone="violet">پیش‌فرض</Badge>
                          ) : null}
                        </p>
                        <p className="mt-1 text-[12px] leading-relaxed text-muted">
                          {a.city} · {a.district}
                        </p>
                        <p className="mt-0.5 text-[11.5px] leading-relaxed text-faint">
                          {a.detail}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 border-t border-line-soft pt-2">
                      {!a.isDefault ? (
                        <button
                          type="button"
                          onClick={() => {
                            setDefaultAddress(a.id);
                            push({
                              text: `«${a.label}» به‌عنوان آدرس پیش‌فرض انتخاب شد`,
                              tone: "success",
                            });
                          }}
                          className="text-[11.5px] font-bold text-accent"
                        >
                          پیش‌فرض کن
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => {
                          setDraftAddr(a);
                          setAddrSheet(true);
                        }}
                        className="text-[11.5px] font-semibold text-muted hover:text-ink"
                      >
                        ویرایش
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          removeAddress(a.id);
                          push({ text: "آدرس حذف شد", tone: "warn" });
                        }}
                        aria-label={`حذف ${a.label}`}
                        className="ms-auto text-faint transition-colors hover:text-rose"
                      >
                        <IconTrash size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                compact
                glyph={<IconPin size={16} />}
                tint="mint"
                title="آدرسی ثبت نشده"
                body="با ثبت آدرس، انتخاب سالن نزدیک‌تر در فیلترها سریع‌تر می‌شود."
                action={{
                  label: "افزودن آدرس",
                  onClick: () => setAddrSheet(true),
                }}
              />
            )}
          </section>

          <section className="rounded-lg border border-line bg-surface p-4">
            <h2 className="mb-3 text-[14px] font-bold">ترجیحات</h2>
            <div className="space-y-2">
              <Toggle
                checked={prefs.reminders}
                onChange={(v) => setPrefs({ ...prefs, reminders: v })}
                label="یادآوری شبِ جلسه"
                hint="پیامک و اعلان درون‌برنامه‌ای"
              />
              <Toggle
                checked={prefs.sms}
                onChange={(v) => setPrefs({ ...prefs, sms: v })}
                label="پیامک وضعیت رزرو"
                hint="تأیید، لغو و جابه‌جایی"
              />
              <Toggle
                checked={prefs.offers}
                onChange={(v) => setPrefs({ ...prefs, offers: v })}
                label="پیشنهاد ظرفیت‌های خالی"
                hint="وقتی تخصص‌دوستی وقت اضافه می‌گذارد"
              />
            </div>
          </section>

          <section className="rounded-lg border border-line bg-surface p-4">
            <h2 className="mb-2.5 flex items-center gap-2 text-[14px] font-bold">
              <IconShield size={14} className="text-mint" />
              امنیت حساب
            </h2>
            <ul className="space-y-2 text-[12.5px] text-muted">
              <li className="flex items-start gap-2">
                <IconLock size={13} className="mt-[3px] shrink-0 text-faint" />
                ورود با کد یک‌بارمصرف — رمز عبور ذخیره نمی‌شود.
              </li>
              <li className="flex items-start gap-2">
                <IconCheck size={13} className="mt-[3px] shrink-0 text-mint" />
                شماره‌ی موبایل تأیید شده است.
              </li>
            </ul>
            <div className="mt-3.5 flex items-center gap-2 border-t border-line-soft pt-3">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setOutSheet(true)}
                leading={<IconAlert size={14} className="text-rose" />}
              >
                خروج از حساب
              </Button>
              <LinkButton href="/support" size="sm" variant="ghost">
                پشتیبانی
              </LinkButton>
            </div>
          </section>
        </aside>
      </div>

      {/* شیت آدرس */}
      <Modal
        open={addrSheet && !!draftAddr}
        onClose={() => setAddrSheet(false)}
        title={
          draftAddr && profile.addresses.some((a) => a.id === draftAddr.id)
            ? "ویرایش آدرس"
            : "آدرس جدید"
        }
        footer={
          <div className="flex gap-2.5">
            <Button variant="outline" block onClick={() => setAddrSheet(false)}>
              انصراف
            </Button>
            <Button
              block
              onClick={() => {
                if (!draftAddr) return;
                saveAddress(draftAddr);
                setAddrSheet(false);
                push({ text: "آدرس ذخیره شد", tone: "success" });
              }}
            >
              ذخیره
            </Button>
          </div>
        }
      >
        {draftAddr ? (
          <div className="space-y-3.5">
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Input
                label="برچسب"
                value={draftAddr.label}
                onChange={(e) =>
                  setDraftAddr({ ...draftAddr, label: e.target.value })
                }
                placeholder="خانه، محل کار…"
              />
              <Input
                label="شهر"
                value={draftAddr.city}
                onChange={(e) =>
                  setDraftAddr({ ...draftAddr, city: e.target.value })
                }
              />
            </div>
            <Input
              label="منطقه / محله"
              value={draftAddr.district}
              onChange={(e) =>
                setDraftAddr({ ...draftAddr, district: e.target.value })
              }
              placeholder="منطقه ۶ — امیرآباد"
            />
            <Textarea
              label="جزئیات آدرس"
              value={draftAddr.detail}
              onChange={(e) =>
                setDraftAddr({ ...draftAddr, detail: e.target.value })
              }
              placeholder="کوچه، پلاک، طبقه و واحد"
            />
            <Toggle
              checked={!!draftAddr.isDefault}
              onChange={(v) => setDraftAddr({ ...draftAddr, isDefault: v })}
              label="این آدرس پیش‌فرض باشد"
              hint="برای محاسبه‌ی فاصله و پیشنهاد سالن‌های نزدیک استفاده می‌شود."
            />
          </div>
        ) : null}
      </Modal>

      {/* خروج */}
      <Modal
        open={outSheet}
        onClose={() => setOutSheet(false)}
        title="خروج از حساب"
        description="در این نسخه‌ی نمایشی، خارج شدن فقط علاقه‌مندی‌ها و پیش‌نویس رزرو را پاک می‌کند."
        footer={
          <div className="flex gap-2.5">
            <Button
              variant="danger"
              block
              onClick={() => {
                useLumera.setState({
                  favorites: [],
                  draft: {
                    ...useLumera.getState().draft,
                    date: null,
                    time: null,
                  },
                });
                setOutSheet(false);
                push({
                  text: "از حساب نمونه خارج شدید (داده‌های محلی پاک شد)",
                  tone: "warn",
                });
              }}
            >
              خروج
            </Button>
            <Button variant="outline" block onClick={() => setOutSheet(false)}>
              ماندن
            </Button>
          </div>
        }
      >
        <p className="text-[13px] leading-relaxed text-muted">
          رزروها روی سرور می‌مانند و با ورود دوباره بازمی‌گردند. اگر دستگاه را
          عوض می‌کنید، لازم نیست خارج شوید.
        </p>
      </Modal>
    </div>
  );
}

function Cell({
  label,
  value,
  suffix,
  icon,
}: {
  label: string;
  value: string;
  suffix?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-surface px-3 py-2.5">
      <span className="flex items-center gap-1.5 text-[11px] text-faint">
        {icon}
        {label}
      </span>
      <p className="mt-1 text-[15px] font-extrabold leading-none tabular-nums">
        {value}
        {suffix ? (
          <span className="ms-1 text-[10.5px] font-medium text-faint">
            {suffix}
          </span>
        ) : null}
      </p>
    </div>
  );
}
