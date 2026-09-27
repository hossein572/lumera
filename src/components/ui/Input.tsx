import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconClose } from "@/components/icons";

interface FieldShell {
  label?: ReactNode;
  hint?: ReactNode;
  error?: string | null;
  required?: boolean;
  className?: string;
  wrapperClassName?: string;
  trailingLabel?: ReactNode;
}

const controlBase =
  "w-full min-w-0 rounded-md bg-surface border border-line px-3.5 text-[15px] text-ink transition-[border-color,background-color] duration-150 placeholder:text-faint focus:border-accent/70 focus:bg-surface-2/60 outline-none disabled:opacity-50";

export function Field({
  label,
  hint,
  error,
  required,
  trailingLabel,
  className,
  children,
}: FieldShell & { children: ReactNode }) {
  return (
    <label className={cn("block", className)}>
      {label || trailingLabel ? (
        <span className="mb-1.5 flex items-baseline justify-between gap-3">
          <span className="label text-muted">
            {label}
            {required ? <span className="text-accent"> *</span> : null}
          </span>
          {trailingLabel ? (
            <span className="text-[12px] text-faint">{trailingLabel}</span>
          ) : null}
        </span>
      ) : null}
      {children}
      {error ? (
        <span className="mt-1.5 flex items-center gap-1 text-[12.5px] font-semibold text-[#ff9aa1]">
          {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-[12.5px] leading-relaxed text-faint">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function Input({
  label,
  hint,
  error,
  required,
  leading,
  className,
  wrapperClassName,
  ...rest
}: FieldShell & ComponentProps<"input"> & { leading?: ReactNode }) {
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={wrapperClassName}
    >
      <span className="relative block">
        {leading ? (
          <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-faint">
            {leading}
          </span>
        ) : null}
        <input
          className={cn(
            controlBase,
            "h-12",
            leading && "ps-11",
            error && "border-[#5b2b33]",
            className,
          )}
          aria-invalid={!!error}
          {...rest}
        />
      </span>
    </Field>
  );
}

export function Textarea({
  label,
  hint,
  error,
  counter,
  className,
  wrapperClassName,
  ...rest
}: FieldShell & ComponentProps<"textarea"> & { counter?: string }) {
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      trailingLabel={counter}
      className={cn("block", wrapperClassName)}
    >
      <textarea
        className={cn(
          controlBase,
          "min-h-[104px] resize-none py-3 leading-relaxed",
          className,
        )}
        {...rest}
      />
    </Field>
  );
}

export function Select({
  label,
  hint,
  error,
  className,
  wrapperClassName,
  children,
  ...rest
}: FieldShell & ComponentProps<"select">) {
  return (
    <Field label={label} hint={hint} error={error} className={wrapperClassName}>
      <span className="relative block">
        <select
          className={cn(
            controlBase,
            "h-12 appearance-none pe-10 [&>option]:bg-surface",
            className,
          )}
          {...rest}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute inset-y-0 end-3.5 flex items-center text-faint">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="m6 9.5 6 6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
    </Field>
  );
}

export function SearchInput({
  value,
  onValueChange,
  onSubmit,
  placeholder,
  autoFocus,
  size = "md",
  trailing,
  className,
}: {
  value: string;
  onValueChange: (v: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  size?: "md" | "lg";
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-line bg-surface transition-colors focus-within:border-accent/60",
        size === "lg" ? "px-4 py-3" : "px-3 py-2",
        className,
      )}
    >
      <svg
        width={size === "lg" ? 20 : 18}
        height={size === "lg" ? 20 : 18}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="shrink-0 text-faint"
        aria-hidden
      >
        <circle cx="11" cy="11" r="6.4" />
        <path d="m20 20-4.3-4.3" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        inputMode="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder ?? "جستجو"}
        className={cn(
          "min-w-0 flex-1 bg-transparent outline-none",
          size === "lg" ? "text-[16px]" : "text-[14.5px]",
        )}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onValueChange("")}
          aria-label="پاک کردن"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-faint transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <IconClose size={14} />
        </button>
      ) : null}
      {trailing}
    </form>
  );
}
