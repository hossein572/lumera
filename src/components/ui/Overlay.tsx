"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { useEscape, useLockScroll } from "@/hooks/useUi";
import { IconClose } from "@/components/icons";
import { Button } from "./Button";

interface LayerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  headerExtra?: ReactNode;
  /** حداکثر ارتفاع بدنه‌ی اسکرول‌شونده */
  bodyMax?: string;
  className?: string;
  labelledBy?: string;
}

let mountId = 0;

export function BottomSheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  headerExtra,
  bodyMax = "68dvh",
  className,
}: LayerProps) {
  const [shown, setShown] = useState(false);
  const [titleId] = useState(() => `sheet-title-${++mountId}`);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => setShown(true), 20);
    return () => window.clearTimeout(id);
  }, [open]);

  useLockScroll(open);
  useEscape(onClose, open);

  if (!open) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-70 flex items-end justify-center sm:items-center sm:p-6",
        className,
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby={typeof title === "string" ? titleId : undefined}
    >
      <button
        type="button"
        aria-label="بستن"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-[#050409]/78 backdrop-blur-[2px] transition-opacity duration-200",
          shown ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        style={{ "--sheet-max": bodyMax } as React.CSSProperties}
        className={cn(
          "relative flex w-full flex-col overflow-hidden rounded-t-lg border border-line bg-bg-2 pb-[env(safe-area-inset-bottom)]",
          "transition-[transform,opacity] duration-250 ease-out sm:max-w-[560px] sm:rounded-lg",
          shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-70",
        )}
      >
        <span
          aria-hidden
          className="mx-auto mt-2.5 h-1 w-9 shrink-0 rounded-full bg-surface-3 sm:hidden"
        />
        {title ? (
          <header className="flex items-start gap-3 border-b border-line-soft px-4 pb-3 pt-3 sm:px-5 sm:pt-4">
            <div className="min-w-0 flex-1">
              <h2
                id={titleId}
                className="truncate text-[16px] font-bold leading-snug sm:text-[17px]"
              >
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                  {description}
                </p>
              ) : null}
            </div>
            {headerExtra}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              aria-label="بستن پنجره"
            >
              <IconClose size={17} />
            </Button>
          </header>
        ) : (
          <div className="absolute end-2.5 top-2.5 z-10">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              aria-label="بستن پنجره"
              className="bg-bg/50"
            >
              <IconClose size={17} />
            </Button>
          </div>
        )}
        <div
          className="min-h-0 overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-gutter:stable] sm:px-5"
          style={{ maxHeight: "var(--sheet-max)" }}
        >
          {children}
        </div>
        {footer ? (
          <footer className="border-t border-line bg-surface/80 px-4 py-3 sm:px-5">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: LayerProps) {
  return BottomSheet({
    open,
    onClose,
    title,
    children,
    footer,
    className,
    bodyMax: "62dvh",
  });
}

/** پوش‌اور تمام‌عرض برای موبایل (فیلترها) — با انیمیشن از پایین */
export function MobileDrawer({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return BottomSheet({
    open,
    onClose,
    title,
    children,
    footer,
    bodyMax: "72dvh",
  });
}
