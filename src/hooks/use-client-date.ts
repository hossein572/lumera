"use client";

import { useEffect, useState } from "react";

/**
 * «امروز» فقط در کلاینت محاسبه می‌شود تا رندر سرور و مرورگر یکسان بماند.
 * مقدار اولیه null است و در اولین microtask بعد از mount پر می‌شود.
 */
export function useToday(): string | null {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    const id = queueMicrotask(() =>
      setToday(new Date().toISOString().slice(0, 10)),
    );
    void id;
    return () => {};
  }, []);
  return today;
}

/** فقط پس از mount — برای داده‌های شخصی که در سرور در دسترس نیستند */
export function useMountedFlag(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);
  return mounted;
}
