import type { Metadata } from "next";
import { PageShell } from "@/components/simple-page";
import { JoinForm } from "@/components/join-form";
import { faNum } from "@/lib/fa";
import { specialists } from "@/data/specialists";
import { services } from "@/data/services";
import {
  IconCalendar,
  IconCheckCircle,
  IconSparkle,
  IconUsers,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "همکاری با لومرا",
  description: "پذیرش متخصص‌های زیبایی و مراقبت در پلتفرم لومرا.",
};

const counts = [
  {
    label: "متخصص فعال",
    value: faNum(specialists.length),
    icon: <IconUsers size={14} />,
  },
  {
    label: "خدمت ثبت‌شده",
    value: faNum(services.length),
    icon: <IconSparkle size={14} />,
  },
  {
    label: "میانگین زمان تأیید",
    value: "۴ روز",
    icon: <IconCalendar size={14} />,
  },
  {
    label: "کمیسیون لومرا",
    value: faNum(8) + "٪",
    icon: <IconCheckCircle size={14} />,
  },
];

export default function JoinPage() {
  return (
    <PageShell
      eyebrow="همکاری"
      title="تخصصت را در لومرا ثبت کن"
      lead="ما وقت خالی شما را می‌فروشیم، نه عکس. پروفایل‌ها بر پایه‌ی نمونه‌کار واقعی و رزرو انجام‌شده ساخته می‌شوند؛ به همین دلیل نرخ تبدیل رزرو در لومرا بالاتر از تبلیغ اینستاگرامی است."
      aside={
        <>
          <div className="rounded-lg border border-line bg-surface p-4">
            <h2 className="text-[13.5px] font-bold">سه تعهد ما</h2>
            <ul className="mt-2.5 space-y-2 text-[12.5px] leading-relaxed text-muted">
              {[
                "تقویم یکپارچه با یادآوری خودکار برای مشتری",
                "نمایش فقط رزروهای تأییدشده، بدون رزرو جعلی",
                "تسویه‌ی هفتگی و گزارش شفاف کمیسیون",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <IconCheckCircle
                    size={13}
                    className="mt-[3px] shrink-0 text-mint"
                  />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4">
            <h2 className="text-[13.5px] font-bold">فرآیند پذیرش</h2>
            <ol className="mt-3 space-y-2.5 text-[12.5px] leading-relaxed text-muted">
              {[
                "ارسال فرم و مدارک فنی‌وحرفه‌ای",
                "بازدید از فضای کار یا ویدیوی زنده",
                "ارسال ۶ نمونه‌کار با تاریخ",
                "دو جلسه‌ی آزمایشی با کاربر لومرا",
              ].map((s, i) => (
                <li key={s} className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-[5px] border border-line bg-surface-2 text-[10.5px] font-extrabold text-accent tabular-nums">
                    {faNum(i + 1)}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
        {counts.map((c) => (
          <div key={c.label} className="bg-surface px-3.5 py-3">
            <span className="flex items-center gap-1.5 text-[11px] text-faint">
              {c.icon}
              {c.label}
            </span>
            <p className="mt-1.5 text-[18px] font-extrabold leading-none tabular-nums">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-[17px] font-bold">فرم درخواست همکاری</h2>
      <p className="mt-1.5 max-w-[52ch] text-[13px] leading-relaxed text-muted">
        در نسخه‌ی نمایشی، اطلاعات ارسال نمی‌شود؛ اما اعتبارسنجی واقعی، حالت‌های
        خطا و پیام موفقیت را می‌توانید ببینید.
      </p>
      <div className="mt-4">
        <JoinForm />
      </div>
    </PageShell>
  );
}
