"use client";

import { cn } from "@/lib/cn";
import { useLumera } from "@/store/useLumera";
import { IconHeart } from "@/components/icons";

export function FavoriteButton({
  id,
  name,
  className,
  size = 18,
  variant = "plain",
}: {
  id: string;
  name?: string;
  className?: string;
  size?: number;
  variant?: "plain" | "solid";
}) {
  const on = useLumera((s) => s.favorites.includes(id));
  const toggle = useLumera((s) => s.toggleFavorite);
  const push = useLumera((s) => s.pushToast);

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
        push({
          text: on
            ? `${name ?? "متخصص"} از علاقه‌مندی‌ها حذف شد`
            : `${name ?? "متخصص"} به علاقه‌مندی‌ها اضافه شد`,
          tone: on ? "neutral" : "success",
          action: on ? undefined : { label: "مشاهده", href: "/favorites" },
        });
      }}
      className={cn(
        "group/fav grid place-items-center rounded-full transition-[background-color,color,border-color] duration-150",
        variant === "solid" ? "h-9 w-9 border" : "h-9 w-9",
        on
          ? "border-rose/45 bg-[rgba(255,122,158,0.14)] text-rose"
          : variant === "solid"
            ? "border-line bg-bg/60 text-muted hover:border-rose/40 hover:text-rose"
            : "text-faint hover:bg-surface-2 hover:text-rose",
        className,
      )}
    >
      <IconHeart
        size={size}
        filled={on}
        className="transition-transform duration-200 group-active/fav:scale-90"
      />
    </button>
  );
}
