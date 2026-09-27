import type { Metadata } from "next";
import Link from "next/link";
import { Accordion, FactCard, PageShell } from "@/components/simple-page";
import { Badge, InfoNote } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { faNum } from "@/lib/fa";
import { IconMessage, IconPhone, IconShield } from "@/components/icons";

export const metadata: Metadata = {
  title: "پشتیبانی و قوانین",
  description: "قوانین لغو رزرو، بازگشت وجه، پشتیبانی و سوالات متکرر لومرا.",
};

export default function SupportPage() {
  return (
    <PageShell
      eyebrow="پشتیبانی"
      title="قوانین ساده، بدون متن‌های طولانی"
      lead="لومرا واسطه‌ی رزرو است؛ کیفیت خدمت با متخصص است و شفافیتِ زمان و قیمت با ما. هر اختلافی در همین سه قانون خلاصه می‌شود."
      related={[
        {
          href: "/bookings",
          label: "رزروهای من",
          note: "لغو یا جابه‌جایی زمان در دو قدم.",
        },
        {
          href: "/explore",
          label: "کاوش مجدد",
          note: "اگر متخصص موردنظر وقت ندارد.",
        },
        {
          href: "/account",
          label: "حساب کاربری",
          note: "شماره تماس و آدرس‌ها را به‌روز کنید.",
        },
      ]}
      aside={
        <>
          <div className="rounded-lg border border-mint/28 bg-mint/[0.05] p-4">
            <p className="flex items-center gap-2 text-[13.5px] font-bold text-mint">
              <IconShield size={15} />
              وضعیت سرویس
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
              سیستم رزرو و تقویم آنلاین فعال است. میانگین پاسخ پشتیبانی امروز:{" "}
              {faNum(6)} دقیقه.
            </p>
            <Badge tone="mint" className="mt-3">
              عملیات عادی
            </Badge>
          </div>
          <FactCard
            title="راه‌های تماس"
            lines={[
              "چت درون‌برنامه‌ای — سریع‌ترین راه برای رزروهای همان روز",
              "شماره پشتیبانی: ۰۲۱ — ۱۰۰۰۰ (هر روز ۹ تا ۲۱)",
              "ایمیل: support@lumera.app — پاسخ تا ۲۴ ساعت",
            ]}
          />
        </>
      }
    >
      <div className="space-y-6">
        <Accordion
          items={[
            {
              q: "اگر نتوانم در ساعت رزروشده برسم؟",
              a: (
                <>
                  تا ۲۴ ساعت قبل از جلسه، لغو کاملاً رایگان است. بعد از آن،
                  بسته‌ی سیاست هر متخصص، تا ۲۰٪ مبلغ کسر می‌شود. در صفحه‌ی
                  رزروها می‌توانی به‌جای لغو، ساعت را جابه‌جا کنی — این کار رزرو
                  را به حالت «در انتظار تأیید» می‌برد و برای متخصص اعلان
                  می‌فرستد.
                </>
              ),
            },
            {
              q: "قیمت در اپ با قیمت سالن فرق دارد؟",
              a: "نه. قیمت هر خدمت را خودِ متخصص ثبت و تأیید می‌کند و هر شش هفته یک‌بار بازبینی می‌شود. اگر در سالن مبلغ اضافه‌ای به شما گفته شد، از مسیر «گزارش اختلاف قیمت» بنویسید؛ آن رزرو بررسی و در صورت تأیید، مابه‌التفاوت بازگردانده می‌شود.",
            },
            {
              q: "پرداخت آنلاین اجباری است؟",
              a: "خیر. پیش‌فرض لومرا «پرداخت در محل» است. پرداخت آنلاین فقط وقتی پیشنهاد می‌شود که ظرفیت آن ساعت خیلی کم باشد و بخواهید زمان را قفل کنید.",
            },
            {
              q: "نظرها واقعی‌اند؟",
              a: (
                <>
                  تنها کاربری می‌تواند نظر بدهد که رزروش در وضعیت «انجام شده»
                  باشد. به همین دلیل است که در پروفایل هر متخصص، کنار امتیاز
                  عبارت «بر پایه‌ی نظرهای تأییدشده» نوشته شده است. نظرات دارای
                  توهین یا تبلیغ، پیش از انتشار بازبینی می‌شوند.
                </>
              ),
            },
            {
              q: "چطور متخصص لومرا «تأیید» می‌گیرد؟",
              a: "بررسی مدرک فنی‌وحرفه‌ای، بازدید حضوری از فضای کار، نمونه‌کارهای با تاریخ مشخص، و دو جلسه‌ی آزمایشی با کاربر واقعی. تا تکمیل این چهار مرحله، برچسب «در انتظار تأیید» روی پروفایل می‌ماند و در فیلترها جدا می‌شود.",
            },
            {
              q: "اطلاعات من با متخصص به اشتراک گذاشته می‌شود؟",
              a: "فقط نام، شماره تماس، و یادداشتی که خودتان می‌نویسید. ایمیل و آدرس‌های شما برای متخصص نمایش داده نمی‌شود.",
            },
          ]}
        />

        <div className="grid gap-2.5 sm:grid-cols-2">
          <InfoNote
            tone="violet"
            icon={<IconMessage size={14} className="text-accent" />}
          >
            برای تغییر ساعت یا لغو، لازم است با پشتیبانی تماس نگیرید؛ از بخش
            «رزروها» در دو قدم انجام می‌شود.
          </InfoNote>
          <InfoNote tone="neutral" icon={<IconPhone size={14} />}>
            اگر رزروِ همان روز دارید و به چت دسترسی ندارید، با شماره پشتیبانی
            تماس بگیرید — اولویت با رزروهای امروز است.
          </InfoNote>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-4">
          <p className="max-w-[46ch] text-[13px] leading-relaxed text-muted">
            سوال‌تان اینجا نبود؟ برای ما بنویسید؛ پاسخ‌های پرتکرار به همین صفحه
            اضافه می‌شود.
          </p>
          <LinkButton href="/explore" variant="outline" size="md">
            بازگشت به کاوش
          </LinkButton>
        </div>

        <p className="text-[12px] text-faint">
          نسخه‌ی نمایشی: متن‌های حقوقی لومرا برای نمونه نوشته شده‌اند و بار
          قانونی ندارند.{" "}
          <Link href="/join" className="font-bold text-accent">
            صفحه‌ی همکاری با متخصص‌ها
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
