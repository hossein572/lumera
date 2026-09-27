"use client";

import { useEffect } from "react";
import { ensureSeed } from "@/store/useLumera";
import { Toaster } from "@/components/ui/Toast";
import { useRevealObserver } from "@/hooks/useRevealObserver";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ensureSeed();
  }, []);
  useRevealObserver();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-90 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-[13px] focus:font-bold focus:text-ink-950"
      >
        پرش به محتوای اصلی
      </a>
      {children}
      <Toaster />
    </>
  );
}
