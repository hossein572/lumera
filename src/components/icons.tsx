import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  className?: string;
};

function Base({ size = 20, className, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconHome = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 10.6 12 4l8 6.6V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1z" />
  </Base>
);

export const IconSearch = (p: IconProps) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="6.4" />
    <path d="m20 20-4.3-4.3" />
  </Base>
);

export const IconCalendar = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2.4" />
    <path d="M3.5 9.5h17M8 3.5V6M16 3.5V6" />
  </Base>
);

export const IconCalendarCheck = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2.4" />
    <path d="M3.5 9.5h17M8 3.5V6M16 3.5V6M9 14.6l2.1 2.1L15.6 12" />
  </Base>
);

export const IconHeart = ({
  filled,
  ...p
}: IconProps & { filled?: boolean }) => (
  <Base {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20.3s-7.6-4.6-7.6-9.8A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 7.6 3.1c0 5.2-7.6 9.8-7.6 9.8Z" />
  </Base>
);

export const IconUser = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="8.4" r="3.6" />
    <path d="M5 20c.6-3.5 3.4-5.4 7-5.4s6.4 1.9 7 5.4" />
  </Base>
);

export const IconBell = ({
  filled,
  ...p
}: IconProps & { filled?: boolean }) => (
  <Base {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M6.4 16.6V11a5.6 5.6 0 1 1 11.2 0v5.6l1.4 2H5z" />
    <path d="M10 20.8a2.2 2.2 0 0 0 4 0" />
  </Base>
);

export const IconChevron = ({
  dir = "down",
  ...p
}: IconProps & { dir?: "up" | "down" | "start" | "end" }) => {
  const d =
    dir === "down"
      ? "m6 9.5 6 6 6-6"
      : dir === "up"
        ? "m6 14.5 6-6 6 6"
        : dir === "end"
          ? "m14.5 6-6 6 6 6"
          : "m9.5 6 6 6-6 6";
  return (
    <Base {...p}>
      <path d={d} />
    </Base>
  );
};

export const IconCheck = (p: IconProps) => (
  <Base {...p} strokeWidth={2}>
    <path d="m4.8 12.6 4.5 4.5L19.4 7" />
  </Base>
);

export const IconCheckCircle = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="m8.2 12.3 2.5 2.5 5.1-5.4" />
  </Base>
);

export const IconClose = (p: IconProps) => (
  <Base {...p}>
    <path d="M6.3 6.3 17.7 17.7M17.7 6.3 6.3 17.7" />
  </Base>
);

export const IconPlus = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);

export const IconMinus = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h14" />
  </Base>
);

export const IconStar = ({
  fill = "full",
  ...p
}: IconProps & { fill?: "full" | "half" | "none" }) => (
  <Base {...p} strokeWidth={1.2}>
    {fill === "half" && (
      <defs>
        <linearGradient id="half-star" x1="0" x2="1" y1="0" y2="0">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
    )}
    <path
      d="m12 3.6 2.6 5.3 5.9.85-4.3 4.15 1.02 5.9L12 17.02 6.78 19.8l1.02-5.9L3.5 9.75l5.9-.85z"
      fill={
        fill === "none"
          ? "none"
          : fill === "half"
            ? "url(#half-star)"
            : "currentColor"
      }
    />
  </Base>
);

export const IconClock = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M12 7.4V12l3.1 1.9" />
  </Base>
);

export const IconPin = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21c4.4-5.1 6.6-8 6.6-11a6.6 6.6 0 1 0-13.2 0c0 3 2.2 5.9 6.6 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </Base>
);

export const IconSparkle = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4.4c.8 3.4 1.8 4.4 5.2 5.2-3.4.8-4.4 1.8-5.2 5.2-.8-3.4-1.8-4.4-5.2-5.2 3.4-.8 4.4-1.8 5.2-5.2Z" />
    <path d="M17.8 15.2c.4 1.6.9 2.1 2.5 2.5-1.6.4-2.1.9-2.5 2.5-.4-1.6-.9-2.1-2.5-2.5 1.6-.4 2.1-.9 2.5-2.5Z" />
  </Base>
);

export const IconShield = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.6l6.6 2.2v5.9c0 4.2-2.8 6.9-6.6 8.1-3.8-1.2-6.6-3.9-6.6-8.1V5.8z" />
    <path d="m9.4 12.2 1.9 1.9 3.5-3.7" />
  </Base>
);

export const IconPhone = (p: IconProps) => (
  <Base {...p}>
    <path d="M7.4 3.8h2.3l1.4 3.5-1.8 1.4a10.8 10.8 0 0 0 5.4 5.4l1.4-1.8 3.5 1.4v2.3c0 1.4-1.2 2.4-2.6 2.2C10.4 17.6 6.4 13.6 5.2 6.4 5 5 6 3.8 7.4 3.8Z" />
  </Base>
);

export const IconMessage = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 12.4c0 3.8-3.6 6.6-8 6.6-1 0-2-.15-2.9-.45L4.4 20l1.2-3.1A6.6 6.6 0 0 1 4 12.4C4 8.6 7.6 5.8 12 5.8s8 2.8 8 6.6Z" />
  </Base>
);

export const IconSend = (p: IconProps) => (
  <Base {...p}>
    <path d="M20.4 4.2 3.8 10.4l6.4 2.3 2.3 6.4z" />
    <path d="m10.2 12.7 4.6-4.6" />
  </Base>
);

export const IconFilter = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 6.4h16M7.4 12h9.2M10.4 17.6h3.2" />
  </Base>
);

export const IconSort = (p: IconProps) => (
  <Base {...p}>
    <path d="M6.4 4.6v14M3.6 15.8l2.8 2.8 2.8-2.8M17.6 19.4v-14M14.8 8.2l2.8-2.8 2.8 2.8" />
  </Base>
);

export const IconGrid = (p: IconProps) => (
  <Base {...p}>
    <rect x="4" y="4" width="6.6" height="6.6" rx="1.6" />
    <rect x="13.4" y="4" width="6.6" height="6.6" rx="1.6" />
    <rect x="4" y="13.4" width="6.6" height="6.6" rx="1.6" />
    <rect x="13.4" y="13.4" width="6.6" height="6.6" rx="1.6" />
  </Base>
);

export const IconImage = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.6" y="5.2" width="16.8" height="13.6" rx="2.2" />
    <path d="m5 16.4 4.2-4.2 3 3 2.4-2.4 4.4 4.4" />
    <circle cx="9" cy="9.6" r="1.3" />
  </Base>
);

export const IconTrash = (p: IconProps) => (
  <Base {...p}>
    <path d="M4.8 7.2h14.4M9.6 7.2V4.8h4.8v2.4M6.6 7.2l.9 12.1a1.4 1.4 0 0 0 1.4 1.3h6.2a1.4 1.4 0 0 0 1.4-1.3l.9-12.1" />
  </Base>
);

export const IconCopy = (p: IconProps) => (
  <Base {...p}>
    <rect x="8.6" y="8.6" width="11.8" height="11.8" rx="2.2" />
    <path d="M15.4 5.6H5.8a2 2 0 0 0-2 2v9.6" />
  </Base>
);

export const IconInfo = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M12 11v5.4M12 7.7h.01" />
  </Base>
);

export const IconAlert = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.8 21 19.6H3z" />
    <path d="M12 9.6v4.2M12 16.6h.01" />
  </Base>
);

export const IconLock = (p: IconProps) => (
  <Base {...p}>
    <rect x="5.4" y="10.6" width="13.2" height="9.4" rx="2.2" />
    <path d="M8.4 10.6V8a3.6 3.6 0 0 1 7.2 0v2.6" />
  </Base>
);

export const IconWallet = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.4" y="6.2" width="17.2" height="12.6" rx="2.4" />
    <path d="M3.4 10.4h17.2M16.4 14.6h1.6" />
  </Base>
);

export const IconTicket = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 8.4V6.2h16v2.2a2.6 2.6 0 0 0 0 5.2v2.2H4v-2.2a2.6 2.6 0 0 0 0-5.2Z" />
    <path d="M11 6.2v2.4M11 11.6v.9M11 15.4v2.4" />
  </Base>
);

export const IconQuote = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 6.4 9 12l5 5.6M19 6.4 14 12l5 5.6" />
  </Base>
);

export const IconCamera = (p: IconProps) => (
  <Base {...p}>
    <path d="M4.4 8.4h2.8l1.4-2h5.4l1.4 2h4.2v10.2H4.4z" />
    <circle cx="12" cy="13.2" r="3.2" />
  </Base>
);

export const IconLink = (p: IconProps) => (
  <Base {...p}>
    <path d="M9.6 14.4a3.6 3.6 0 0 0 5.1 0l2.6-2.6a3.6 3.6 0 1 0-5.1-5.1l-.9.9" />
    <path d="M14.4 9.6a3.6 3.6 0 0 0-5.1 0L6.7 12.2a3.6 3.6 0 1 0 5.1 5.1l.9-.9" />
  </Base>
);

export const IconInstagram = (p: IconProps) => (
  <Base {...p}>
    <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.4" />
    <circle cx="12" cy="12" r="3.6" />
    <path d="M16.6 7.4h.01" />
  </Base>
);

export const IconGlobe = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M3.8 12h16.4M12 3.8c2.2 2.4 2.2 13.9 0 16.4-2.2-2.5-2.2-14 0-16.4Z" />
  </Base>
);

export const IconUsers = (p: IconProps) => (
  <Base {...p}>
    <circle cx="9.4" cy="8.6" r="3.2" />
    <path d="M3.6 19c.6-3.2 2.9-4.9 5.8-4.9s5.2 1.7 5.8 4.9" />
    <path d="M15.6 5.9a3 3 0 0 1 0 5.6M17.4 14.4c2 .5 3.1 2 3.4 4.1" />
  </Base>
);

export const IconArrow = ({
  dir = "end",
  ...p
}: IconProps & { dir?: "start" | "end" }) => (
  <Base {...p}>
    <path
      d={
        dir === "end"
          ? "M4 12h15m-5.2-5.2L19 12l-5.2 5.2"
          : "M20 12H5m5.2-5.2L5 12l5.2 5.2"
      }
    />
  </Base>
);

export const IconBookmark = ({
  filled,
  ...p
}: IconProps & { filled?: boolean }) => (
  <Base {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M6.4 4.6h11.2v15.6L12 16.4l-5.6 3.8z" />
  </Base>
);

export const IconEye = (p: IconProps) => (
  <Base {...p}>
    <path d="M2.8 12S6 6.4 12 6.4 21.2 12 21.2 12 18 17.6 12 17.6 2.8 12 2.8 12Z" />
    <circle cx="12" cy="12" r="2.6" />
  </Base>
);

export const IconRefresh = (p: IconProps) => (
  <Base {...p}>
    <path d="M19.6 12a7.6 7.6 0 1 1-2.5-5.6" />
    <path d="M19.8 4.4v3.4h-3.4" />
  </Base>
);

export const IconSpinner = ({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={cn("animate-[spin_0.9s_linear_infinite]", className)}
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeOpacity="0.25"
      strokeWidth="2"
    />
    <path
      d="M21 12a9 9 0 0 0-9-9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
