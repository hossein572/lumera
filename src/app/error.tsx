"use client";

import { useEffect } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconAlert, IconRefresh } from "@/components/icons";

/** خطای سراسری مسیرها — لومرا کاربر را در بن‌بست نمی‌گذارد */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // در پروژه‌ی واقعی اینجا به سرویس لاگ گزارش می‌شود
    console.warn("lumera: خطای مسیر", error?.digest ?? error?.message);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-[560px] px-4 py-16 sm:py-24">
      <EmptyState
        glyph={<IconAlert size={22} />}
        tint="amber"
        title="اتصال به لومرا قطع شد"
        body="این بخش نتوانست بارگذاری شود. رزروهای شما جای دیگری است؛ یک بار دیگر تلاش کنید."
        action={{ label: "تلاش دوباره", onClick: reset }}
        secondary={{ label: "بازگشت به خانه", href: "/" }}
        note={
          error?.digest ? (
            <span className="block font-mono text-[10.5px]" dir="ltr">
              {error.digest}
            </span>
          ) : undefined
        }
      />
    </div>
  );
}
