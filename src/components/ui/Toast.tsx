"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { useLumera } from "@/store/useLumera";
import { IconCheckCircle, IconClose, IconInfo } from "@/components/icons";

export function Toaster() {
  const toasts = useLumera((s) => s.toasts);
  const drop = useLumera((s) => s.dropToast);
  if (!toasts.length) return null;
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-90 flex flex-col items-center gap-2 px-3 sm:bottom-6 sm:items-end sm:px-6"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex w-full max-w-[420px] items-start gap-2.5 rounded-md border bg-bg-2/96 px-3.5 py-2.5 shadow-soft motion-safe:animate-[rise_0.28s_ease-out_both]",
            t.tone === "success"
              ? "border-[rgba(110,242,208,0.35)]"
              : "border-line",
          )}
        >
          <span
            className={cn(
              "mt-[2px] shrink-0",
              t.tone === "success"
                ? "text-mint"
                : t.tone === "warn"
                  ? "text-amber"
                  : "text-faint",
            )}
          >
            {t.tone === "success" ? (
              <IconCheckCircle size={17} />
            ) : (
              <IconInfo size={17} />
            )}
          </span>
          <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-ink">
            {t.text}
          </p>
          {t.action ? (
            <Link
              href={t.action.href}
              className="shrink-0 text-[12.5px] font-bold text-accent hover:underline"
              onClick={() => drop(t.id)}
            >
              {t.action.label}
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => drop(t.id)}
            aria-label="بستن پیام"
            className="-me-1 mt-[2px] shrink-0 rounded-xs p-1 text-faint transition-colors hover:text-ink"
          >
            <IconClose size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
