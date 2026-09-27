import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { specialistById, specialists } from "@/data/specialists";
import { BookingWizard } from "@/components/booking-wizard";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { IconChevron, IconLock, IconShield } from "@/components/icons";
import { faces } from "@/lib/images";

export function generateStaticParams() {
  return specialists.map((s) => ({ specialistId: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ specialistId: string }>;
}): Promise<Metadata> {
  const { specialistId } = await params;
  const sp = specialistById[specialistId];
  return {
    title: sp ? `رزرو با ${sp.name}` : "رزرو نوبت",
    description: sp
      ? `انتخاب خدمت، تاریخ و ساعت با ${sp.name} — ${sp.title} در ${sp.city}.`
      : "رزرو آنلاین خدمات زیبایی و مراقبت.",
  };
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ specialistId: string }>;
}) {
  const { specialistId } = await params;
  const sp = specialistById[specialistId];
  if (!sp) notFound();

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={`/specialists/${sp.id}`}
            aria-label="بازگشت به پروفایل متخصص"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-line bg-surface text-muted transition-colors hover:text-ink"
          >
            <IconChevron dir="start" size={16} />
          </Link>
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar
              name={sp.name}
              face={sp.face ? faces[sp.face] : null}
              category={sp.categoryId}
              tint={sp.tint}
              size="sm"
            />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-bold leading-tight">
                رزرو با {sp.name}
                <span className="ms-2 inline-flex align-middle">
                  {sp.verified ? (
                    <Badge tone="mint">تأییدشده</Badge>
                  ) : (
                    <Badge tone="amber">در انتظار</Badge>
                  )}
                </span>
              </p>
              <p className="mt-0.5 truncate text-[11.5px] text-faint">
                {sp.studio} · {sp.district}
              </p>
            </div>
          </div>
        </div>
        <div className="hidden items-center gap-4 text-[11.5px] text-faint sm:flex">
          <span className="inline-flex items-center gap-1.5">
            <IconLock size={13} />
            بدون پرداخت اطلاعات بانکی
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconShield size={13} className="text-mint" />
            لغو رایگان تا ۲۴ ساعت قبل
          </span>
        </div>
      </div>

      <BookingWizard specialistId={sp.id} />
    </div>
  );
}
