import Link from "next/link";
import { categories } from "@/data/categories";
import { activeCities } from "@/data/specialists";
import { BrandMark } from "@/components/layout/navbar";

export function Footer() {
  return (
    <footer className="relative z-10 mt-16 border-t border-line bg-bg-2/40 lg:mt-24">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_2fr]">
          <div className="max-w-[420px]">
            <div className="flex items-center gap-2.5">
              <BrandMark />
              <span className="text-[16px] font-extrabold tracking-[0.16em]">
                لومرا
              </span>
              <span className="text-[10px] font-bold tracking-[0.3em] text-faint">
                LUMERA
              </span>
            </div>
            <p className="mt-4 text-[13.5px] leading-[1.9] text-muted">
              لومرا یک پلتفرم رزرو آنلاین است: متخصصان زیبایی و مراقبت را با
              پروفایل کامل، نمونه‌کار واقعی، قیمت شفاف و زمان‌های آزاد لحظه‌ای
              کنار هم جمع می‌کند.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-faint">
              {activeCities.slice(0, 6).map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            <FooterCol
              title="دسته‌ها"
              links={categories.map((c) => ({
                label: c.name,
                href: `/explore?cat=${c.id}`,
              }))}
            />
            <FooterCol
              title="لومرا"
              links={[
                { label: "کاوش متخصص‌ها", href: "/explore" },
                { label: "همه‌ی خدمات", href: "/services" },
                { label: "رزروهای من", href: "/bookings" },
                { label: "علاقه‌مندی‌ها", href: "/favorites" },
              ]}
            />
            <FooterCol
              title="پشتیبانی"
              links={[
                { label: "سوالات متکرر", href: "/support" },
                { label: "قوانین لغو رزرو", href: "/support" },
                { label: "حریم خصوصی", href: "/support" },
                { label: "تماس با ما", href: "/support" },
              ]}
            />
            <FooterCol
              title="همکاری"
              links={[
                { label: "پذیرش متخصص", href: "/join" },
                { label: "پنل سالن", href: "/join" },
                { label: "فرصت‌های شغلی", href: "/join" },
              ]}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line-soft pt-5 sm:flex-row sm:items-center">
          <p className="text-[12px] text-faint">
            © ۱۴۰۴ لومرا — نمونه‌پروژه‌ی طراحی و توسعه. داده‌های این نسخه
            نمایشی است.
          </p>
          <p className="flex items-center gap-4 text-[12px] text-faint sm:ms-auto">
            <span>ساخته‌شده با دقت در تهران</span>
            <Link href="/support" className="transition-colors hover:text-ink">
              وضعیت سرویس
            </Link>
          </p>
        </div>
      </div>

      {/* امضای بصری — فقط دسکتاپ */}
      <div
        aria-hidden
        className="pointer-events-none hidden overflow-hidden border-t border-line-soft lg:block"
      >
        <p className="translate-y-6 select-none text-center text-[110px] font-extrabold leading-none tracking-[0.22em] text-[#141019] xl:text-[140px]">
          LUMERA
        </p>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-3 text-[12.5px] font-bold text-ink">{title}</h3>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-[13px] text-muted transition-colors hover:text-accent"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
