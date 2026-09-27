"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** تصویر با محو‌شدن ملایم هنگام لود — بدون اسکلتون نمایشی */
export function Img({
  src,
  alt,
  className,
  imgClassName,
  eager,
  position = "center",
  ...rest
}: ComponentProps<"img"> & {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  position?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // تصویرهای کش‌شدهٔ پیش از hydration دوباره onLoad را released نمی‌کنند
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, [src]);

  return (
    <span
      className={cn("relative block overflow-hidden bg-surface-2", className)}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br from-surface-2 to-surface transition-opacity duration-500",
          loaded ? "opacity-0" : "opacity-100",
        )}
      />
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        suppressHydrationWarning
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        style={{ objectPosition: position }}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-500 will-change-[opacity]",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
        {...rest}
      />
    </span>
  );
}
