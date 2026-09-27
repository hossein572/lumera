import { cn } from "@/lib/cn";
import { initials } from "@/lib/fa";
import { categoryArt, tints, type CatId, type TintKey } from "@/lib/images";
import { IconCheck } from "@/components/icons";
import type { FaceArt } from "@/lib/images";
import { Img } from "./Image";

const boxSize = {
  xs: "h-8 w-8 text-[11px]",
  sm: "h-10 w-10 text-[12px]",
  md: "h-12 w-12 text-[14px]",
  lg: "h-16 w-16 text-[17px]",
  xl: "h-24 w-24 text-[24px]",
  "2xl": "h-32 w-32 text-[30px]",
} as const;

const ringSize = {
  xs: "p-[1.5px]",
  sm: "p-[1.5px]",
  md: "p-[2px]",
  lg: "p-[2px]",
  xl: "p-[2.5px]",
  "2xl": "p-[3px]",
} as const;

export function Avatar({
  name,
  face,
  category,
  tint = "violet",
  size = "md",
  verified,
  className,
  showMonogram = true,
}: {
  name: string;
  face?: FaceArt | null;
  category?: CatId;
  tint?: TintKey;
  size?: keyof typeof boxSize;
  verified?: boolean;
  className?: string;
  showMonogram?: boolean;
}) {
  const tone = tints[tint];
  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center rounded-full border bg-surface-2",
        ringSize[size],
        className,
      )}
      style={{ borderColor: tone.border }}
    >
      <span
        className={cn(
          "relative grid place-items-center overflow-hidden rounded-full font-bold leading-none",
          boxSize[size],
        )}
        style={{ background: tone.bg, color: tone.fg }}
      >
        {face?.face ? (
          <Img
            src={face.face}
            alt={name}
            className="absolute inset-0 h-full w-full rounded-full"
          />
        ) : category ? (
          <>
            <Img
              src={categoryArt[category].frag}
              alt=""
              position="70% 40%"
              className="absolute inset-0 h-full w-full rounded-full opacity-45"
              imgClassName="grayscale-[18%]"
            />
            {showMonogram ? (
              <span className="relative">{initials(name)}</span>
            ) : null}
          </>
        ) : (
          <span>{initials(name)}</span>
        )}
      </span>
      {verified ? (
        <span
          className="absolute -bottom-0.5 -start-0.5 grid h-[17px] w-[17px] place-items-center rounded-full border-2 border-bg bg-mint text-[#04231d]"
          title="تأیید لومرا"
        >
          <IconCheck size={10} strokeWidth={3} />
        </span>
      ) : null}
    </span>
  );
}
