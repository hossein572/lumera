import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { IconArrow, IconSearch } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[68dvh] w-full max-w-[1000px] place-items-center px-4 py-10 sm:px-6">
      <div className="grid w-full items-center gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <p className="font-sans text-[64px] font-extrabold leading-none tracking-[-0.04em] text-accent/85 sm:text-[86px]">
            ۴۰۴
          </p>
          <h1 className="mt-4 text-[22px] font-extrabold leading-snug sm:text-[26px]">
            این صفحه در لومرا نیست.
          </h1>
          <p className="mt-2.5 max-w-[46ch] text-[13.5px] leading-relaxed text-muted">
            ممکن است لینک را از منوی قدیمی باز کرده باشید، یا رزرو لغو شده و
            صفحه‌اش حذف شده باشد. سریع‌ترین راه، شروع دوباره از کاوش است.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <LinkButton
              href="/explore"
              size="lg"
              leading={<IconSearch size={16} />}
            >
              شروع جستجو
            </LinkButton>
            <LinkButton href="/" size="lg" variant="outline">
              بازگشت به خانه
            </LinkButton>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4 text-[12px]">
            {[
              { href: "/bookings", label: "رزروهای من" },
              { href: "/services", label: "فهرست خدمات" },
              { href: "/favorites", label: "علاقه‌مندی‌ها" },
              { href: "/account", label: "حساب کاربری" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-1 font-semibold text-muted transition-colors hover:text-ink"
              >
                {l.label}
                <IconArrow size={12} />
              </Link>
            ))}
          </div>
        </div>

        <div className="relative hidden overflow-hidden rounded-lg border border-line lg:block">
          <img
            src="/img/cat-care-wide.jpg"
            alt=""
            className="h-[300px] w-full object-cover opacity-65"
          />
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(13,11,16,0.9),transparent_60%)]" />
          <p className="absolute bottom-4 start-4 text-[13px] leading-relaxed text-muted">
            اگر فکر می‌کنید این صفحه باید وجود داشته باشد، از بخش پشتیبانی برای
            ما بنویسید.
          </p>
        </div>
      </div>
    </div>
  );
}
