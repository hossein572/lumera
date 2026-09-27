import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconSpinner } from "@/components/icons";

type Variant = "primary" | "mint" | "outline" | "ghost" | "subtle" | "danger";
type Size = "sm" | "md" | "lg" | "xl" | "icon" | "icon-sm";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-[#180b26] font-bold hover:bg-[#d684ff] active:bg-[#bd5bf5] shadow-[0_1px_0_rgba(255,255,255,0.14)_inset]",
  mint: "bg-mint text-[#04231d] font-bold hover:bg-[#84f6dc] active:bg-[#5ddcbb]",
  outline:
    "border border-line bg-surface/60 text-ink hover:border-accent/50 hover:bg-surface-2",
  ghost: "text-muted hover:text-ink hover:bg-surface-2/70",
  subtle: "bg-surface-2 text-ink hover:bg-surface-3",
  danger:
    "bg-[#2a1418] text-[#ff9aa1] hover:bg-[#37181e] border border-[#4a2229]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5",
  md: "h-11 px-5 text-[14px] gap-2",
  lg: "h-[52px] px-7 text-[15px] gap-2.5",
  xl: "h-[58px] px-8 text-[16px] gap-2.5",
  icon: "h-11 w-11",
  "icon-sm": "h-9 w-9",
};

interface Common {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  loading?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  className?: string;
  children?: ReactNode;
}

const base =
  "relative inline-flex items-center justify-center rounded-md leading-none select-none transition-[background-color,color,border-color,transform,box-shadow] duration-150 active:scale-[0.985] disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap";

export function Button({
  variant = "primary",
  size = "md",
  block,
  loading,
  leading,
  trailing,
  className,
  children,
  ...rest
}: Common & ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        base,
        variants[variant],
        sizes[size],
        block && "w-full",
        className,
      )}
      disabled={rest.disabled || loading}
      {...rest}
    >
      {loading ? <IconSpinner size={size === "sm" ? 14 : 16} /> : leading}
      {children ? <span className="truncate">{children}</span> : null}
      {trailing}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  block,
  leading,
  trailing,
  className,
  children,
  ...rest
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        base,
        variants[variant],
        sizes[size],
        block && "w-full",
        className,
      )}
      {...rest}
    >
      {leading}
      {children ? <span className="truncate">{children}</span> : null}
      {trailing}
    </Link>
  );
}

/** کنشِ کوچک متن‌محور (دکمه‌ی متنی) */
export function TextAction({
  className,
  children,
  ...rest
}: ComponentProps<"button"> & { href?: string }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-9 items-center gap-1.5 rounded-xs px-1 text-[13px] font-semibold text-muted transition-colors hover:text-ink",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
