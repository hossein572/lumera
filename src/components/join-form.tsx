"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { faNum } from "@/lib/fa";
import { categories } from "@/data/categories";
import { activeCities } from "@/data/specialists";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Chip, InfoNote, Toggle } from "@/components/ui/Badge";
import {
  IconAlert,
  IconCheckCircle,
  IconRefresh,
  IconSparkle,
} from "@/components/icons";

interface Form {
  name: string;
  phone: string;
  city: string;
  cat: string;
  years: string;
  studio: string;
  instagram: string;
  note: string;
  consent: boolean;
  onsite: boolean;
}

const EMPTY: Form = {
  name: "",
  phone: "",
  city: "تهران",
  cat: "skin",
  years: "",
  studio: "",
  instagram: "",
  note: "",
  consent: false,
  onsite: true,
};

export function JoinForm() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "ok" | "fail">(
    "idle",
  );

  const set = (patch: Partial<Form>) => setForm((f) => ({ ...f, ...patch }));

  function validate() {
    const e: Partial<Record<keyof Form, string>> = {};
    if (form.name.trim().length < 4)
      e.name = "نام و نام خانوادگی را کامل بنویسید.";
    if (!/^09\d{9}$/.test(form.phone.trim()))
      e.phone = "شماره‌ی موبایل باید ۱۱ رقم و با ۰۹ شروع شود.";
    const y = Number(form.years);
    if (!form.years.trim() || !Number.isFinite(y) || y < 1 || y > 45)
      e.years = "سابقه‌ی کار را به سال وارد کنید (۱ تا ۴۵).";
    if (form.studio.trim().length < 3)
      e.studio = "نام سالن یا استودیو را بنویسید.";
    if (!form.consent) e.consent = "برای ادامه، تیک تأیید مدارک را بزنید.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit() {
    if (!validate()) return;
    setState("sending");
    window.setTimeout(() => {
      // اعتبارسنجی دومرحله‌ای: شماره‌های رندوم با رقم آخر «۰» خطای سرور را شبیه‌سازی می‌کنند
      const fails = form.phone.trim().endsWith("0");
      setState(fails ? "fail" : "ok");
    }, 1100);
  }

  if (state === "ok") {
    return (
      <div className="rounded-lg border border-mint/30 bg-mint/[0.04] p-5 text-center sm:p-7">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-lg border border-mint/40 bg-mint/10 text-mint">
          <IconCheckCircle size={22} />
        </span>
        <h3 className="mt-4 text-[18px] font-extrabold">درخواست شما ثبت شد</h3>
        <p className="mx-auto mt-2 max-w-[46ch] text-[13px] leading-relaxed text-muted">
          کد پیگیری{" "}
          <span className="font-bold text-ink">
            LM-J{faNum(form.phone.slice(-4))}
          </span>{" "}
          — کارشناس پذیرش ظرف ۲ روز کاری با {form.name.trim().split(" ")[0]}{" "}
          تماس می‌گیرد. لینک بارگذاری مدارک برای شما پیامک شد.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            leading={<IconRefresh size={15} />}
            onClick={() => {
              setForm(EMPTY);
              setState("idle");
            }}
          >
            ثبت درخواست جدید
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="space-y-4 rounded-lg border border-line bg-surface p-4 sm:p-5"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {state === "fail" ? (
        <div className="flex items-start gap-2.5 rounded-md border border-[rgba(255,107,116,0.3)] bg-[rgba(255,107,116,0.06)] px-3.5 py-3">
          <IconAlert size={15} className="mt-[3px] shrink-0 text-rose" />
          <div className="min-w-0 text-[12.5px] leading-relaxed text-muted">
            <p className="font-bold text-ink">ثبت درخواست انجام نشد</p>
            <p className="mt-1">
              شماره‌ی واردشده در فهرست فعال مخابراتی نیست. اگر شماره درست است،
              چند دقیقه دیگر دوباره تلاش کنید — سرویس پیامک در حال بازبینی است.
            </p>
            <button
              type="button"
              onClick={() => setState("idle")}
              className="mt-2 text-[12px] font-bold text-accent"
            >
              بستن پیام
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-3.5 sm:grid-cols-2">
        <Input
          label="نام و نام خانوادگی"
          required
          value={form.name}
          error={errors.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="مثلاً: نیلفار رستمی"
          autoComplete="name"
        />
        <Input
          label="موبایل"
          required
          dir="ltr"
          inputMode="numeric"
          className="text-end tabular-nums"
          value={form.phone}
          error={errors.phone}
          hint="نکته‌ی تست: شماره‌ای که به ۰ ختم شود، خطای سرور را شبیه‌سازی می‌کند."
          onChange={(e) =>
            set({ phone: e.target.value.replace(/\D/g, "").slice(0, 11) })
          }
          placeholder="09121234567"
        />
        <Input
          label="سابقه‌ی کار (سال)"
          required
          inputMode="numeric"
          value={form.years}
          error={errors.years}
          onChange={(e) =>
            set({ years: e.target.value.replace(/\D/g, "").slice(0, 2) })
          }
          placeholder="7"
        />
        <Input
          label="نام سالن یا استودیو"
          required
          value={form.studio}
          error={errors.studio}
          onChange={(e) => set({ studio: e.target.value })}
          placeholder="سالن آوین"
        />
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <Select
          label="شهر فعالیت"
          value={form.city}
          onChange={(e) => set({ city: e.target.value })}
        >
          {activeCities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Input
          label="اینستاگرام کاری (اختیاری)"
          dir="ltr"
          className="text-end"
          value={form.instagram}
          onChange={(e) => set({ instagram: e.target.value })}
          placeholder="studio.name"
        />
      </div>

      <div>
        <span className="label mb-2 block text-muted">حوزه‌ی اصلی فعالیت</span>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Chip
              key={c.id}
              active={form.cat === c.id}
              onClick={() => set({ cat: c.id })}
            >
              {c.name}
            </Chip>
          ))}
        </div>
      </div>

      <Textarea
        label="معرفی کوتاه (اختیاری)"
        value={form.note}
        onChange={(e) => set({ note: e.target.value.slice(0, 300) })}
        counter={`${faNum(form.note.length)} / ۳۰۰`}
        placeholder="روی چه خدماتی تمرکز دارید و چرا می‌خواهید در لومرا باشید؟"
        hint="این متن روی پروفایل شما نمی‌آید؛ فقط برای بررسی اولیه است."
      />

      <div className="space-y-2.5">
        <Toggle
          checked={form.onsite}
          onChange={(v) => set({ onsite: v })}
          label="امکان بازدید حضوری از فضای کار را دارم"
          hint="پروفایل‌های دارای بازدید، ۲٫۴ برابر بیشتر رزرو می‌شوند."
        />
        <button
          type="button"
          onClick={() => set({ consent: !form.consent })}
          className={cn(
            "flex w-full items-start gap-2.5 rounded-md border px-3.5 py-3 text-start transition-colors",
            form.consent
              ? "border-mint/45 bg-mint/[0.04]"
              : "border-line bg-surface",
            errors.consent && "border-[#5b2b33]",
          )}
        >
          <span
            className={cn(
              "mt-[2px] grid h-5 w-5 shrink-0 place-items-center rounded-[5px] border",
              form.consent
                ? "border-mint bg-mint text-[#04231d]"
                : "border-line-soft",
            )}
          >
            {form.consent ? <IconCheckCircle size={13} /> : null}
          </span>
          <span className="text-[12.5px] leading-relaxed text-muted">
            <span className="font-bold text-ink">متعهد می‌شوم</span> مدارک
            فنی‌وحرفه‌ای و نمونه‌کارها واقعی باشند؛ در غیر این صورت پروفایل من
            موقتاً غیرفعال می‌شود.
          </span>
        </button>
        {errors.consent ? (
          <p className="text-[12px] font-semibold text-[#ff9aa1]">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 border-t border-line-soft pt-3.5">
        <Button
          size="lg"
          type="submit"
          loading={state === "sending"}
          disabled={state === "sending"}
          leading={<IconSparkle size={16} />}
        >
          {state === "sending" ? "در حال ثبت…" : "ارسال درخواست"}
        </Button>
        <Button
          size="lg"
          variant="ghost"
          onClick={() => {
            setForm(EMPTY);
            setErrors({});
            setState("idle");
          }}
        >
          پاک کردن فرم
        </Button>
      </div>

      <InfoNote tone="neutral">
        همه‌ی فیلدها اعتبارسنجی زنده دارند؛ خطاها زیر همان فیلد نمایش داده
        می‌شود، نه در یک پیام کلی.
      </InfoNote>
    </form>
  );
}
