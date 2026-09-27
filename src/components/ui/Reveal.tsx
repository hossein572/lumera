import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** پوشش نمایش با اسکرول — در سرور محتوا دیده می‌شود (class اضافه نمی‌شود) */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  id?: string;
}) {
  return (
    <Tag id={id} data-reveal className={cn("reveal", className)}>
      {children}
    </Tag>
  );
}
