import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** سطح پایه‌ی کارت — باریک، بی‌سایه، با مویرای بالای سطح */
export function Card({
  children,
  className,
  interactive,
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  as?: "div" | "section" | "article" | "li";
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={cn(
        "relative rounded-lg border border-line bg-surface",
        interactive &&
          "transition-[border-color,background-color,transform] duration-200 hover:border-line-soft hover:bg-surface/85 active:scale-[0.997]",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function SectionHead({
  eyebrow,
  title,
  desc,
  action,
  align = "start",
  className,
  size = "md",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  desc?: ReactNode;
  action?: ReactNode;
  align?: "start" | "center";
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div
        className={cn("min-w-0 max-w-[54ch]", align === "center" && "mx-auto")}
      >
        {eyebrow ? <span className="eyebrow mb-2.5">{eyebrow}</span> : null}
        <h2
          className={cn(
            "font-bold leading-[1.35] tracking-tight",
            size === "lg"
              ? "text-[24px] sm:text-[30px] lg:text-[34px]"
              : size === "md"
                ? "text-[20px] sm:text-[23px]"
                : "text-[17px]",
          )}
        >
          {title}
        </h2>
        {desc ? (
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted sm:text-[14.5px]">
            {desc}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className="flex shrink-0 items-center gap-2">{action}</div>
      ) : null}
    </div>
  );
}

export function Divider({
  className,
  label,
}: {
  className?: string;
  label?: ReactNode;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-line" />
      {label ? (
        <span className="text-[11.5px] font-semibold tracking-wide text-faint">
          {label}
        </span>
      ) : null}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export function MetaRow({
  items,
  className,
}: {
  items: (ReactNode | null | undefined)[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px] text-muted",
        className,
      )}
    >
      {items.filter(Boolean).map((it, i) => (
        <span key={i} className="inline-flex items-center gap-2.5">
          {i > 0 ? (
            <span aria-hidden className="h-1 w-1 rounded-full bg-faint/60" />
          ) : null}
          {it}
        </span>
      ))}
    </div>
  );
}
