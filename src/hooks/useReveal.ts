"use client";

import { useEffect, useRef, useState } from "react";

/**
 * نمایش با اسکرول — مستقیماً کلاس را روی DOM می‌گذارد؛
 * بدون setState در effect و بدون هزینه‌ی رندر اضافه.
 */
export function useRevealRef<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}

/** true می‌شود یک‌ تایم‌اوت کوتاه بعد از mount — برای ورود تدریجی عناصر */
export function useDelayedFlag(delay = 40) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setOn(true), delay);
    return () => window.clearTimeout(id);
  }, [delay]);
  return on;
}
