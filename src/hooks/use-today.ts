"use client";

import { useEffect, useState } from "react";

const FALLBACK = "2026-01-01";

/**
 * «امروز» در رندر سرور مقدار پیش‌فرض ثابت دارد و در کلاینت اصلاح می‌شود؛
 * برای داده‌های وابسته‌ی تاریخ (ظرفیت، رزروها) تا hydration mismatch ندهیم.
 */
export function useToday(): string {
  const [today, setToday] = useState(FALLBACK);
  useEffect(() => {
    queueMicrotask(() => setToday(new Date().toISOString().slice(0, 10)));
  }, []);
  return today;
}

export { FALLBACK as FALLBACK_TODAY };
