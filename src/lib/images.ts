/** تصاویر پروژه — masterها در public/img و واریانت‌های مشتق با scripts/build-images.sh */

export const HERO_IMG = "/img/hero.jpg";

export type CatId = "skin" | "hair" | "nails" | "makeup" | "care" | "massage";

export const categoryArt: Record<
  CatId,
  { tile: string; wide: string; frag: string; work: [string, string, string] }
> = {
  skin: {
    tile: "/img/cat-skin.jpg",
    wide: "/img/cat-skin-wide.jpg",
    frag: "/img/frag-skin.jpg",
    work: [
      "/img/work-skin-1.jpg",
      "/img/work-skin-2.jpg",
      "/img/work-skin-3.jpg",
    ],
  },
  hair: {
    tile: "/img/cat-hair.jpg",
    wide: "/img/cat-hair-wide.jpg",
    frag: "/img/frag-hair.jpg",
    work: [
      "/img/work-hair-1.jpg",
      "/img/work-hair-2.jpg",
      "/img/work-hair-3.jpg",
    ],
  },
  nails: {
    tile: "/img/cat-nails.jpg",
    wide: "/img/cat-nails-wide.jpg",
    frag: "/img/frag-nails.jpg",
    work: [
      "/img/work-nails-1.jpg",
      "/img/work-nails-2.jpg",
      "/img/work-nails-3.jpg",
    ],
  },
  makeup: {
    tile: "/img/cat-makeup.jpg",
    wide: "/img/cat-makeup-wide.jpg",
    frag: "/img/frag-makeup.jpg",
    work: [
      "/img/work-makeup-1.jpg",
      "/img/work-makeup-2.jpg",
      "/img/work-makeup-3.jpg",
    ],
  },
  care: {
    tile: "/img/cat-care.jpg",
    wide: "/img/cat-care-wide.jpg",
    frag: "/img/frag-care.jpg",
    work: [
      "/img/work-care-1.jpg",
      "/img/work-care-2.jpg",
      "/img/work-care-3.jpg",
    ],
  },
  massage: {
    tile: "/img/cat-massage.jpg",
    wide: "/img/cat-massage-wide.jpg",
    frag: "/img/frag-massage.jpg",
    work: [
      "/img/work-massage-1.jpg",
      "/img/work-massage-2.jpg",
      "/img/work-massage-3.jpg",
    ],
  },
};

export type FaceArt = {
  base: string;
  face: string;
  alt: string;
  wide: string;
} | null;

/** پرتره‌های عکاسی‌شده؛ سایر متخصص‌ها با مونوگرام و قطعه‌ی تصویری دسته نمایش داده می‌شوند */
export const faces: Record<string, FaceArt> = {
  p1: {
    base: "/img/portrait-1.jpg",
    face: "/img/portrait-1-face.jpg",
    alt: "/img/portrait-1-alt.jpg",
    wide: "/img/portrait-1-wide.jpg",
  },
  p2: {
    base: "/img/portrait-2.jpg",
    face: "/img/portrait-2-face.jpg",
    alt: "/img/portrait-2-alt.jpg",
    wide: "/img/portrait-2-wide.jpg",
  },
  p3: {
    base: "/img/portrait-3.jpg",
    face: "/img/portrait-3-face.jpg",
    alt: "/img/portrait-3-alt.jpg",
    wide: "/img/portrait-3-wide.jpg",
  },
};

export const tints = {
  violet: {
    fg: "#C96CFF",
    bg: "rgba(201,108,255,0.14)",
    border: "rgba(201,108,255,0.34)",
  },
  mint: {
    fg: "#6EF2D0",
    bg: "rgba(110,242,208,0.12)",
    border: "rgba(110,242,208,0.3)",
  },
  rose: {
    fg: "#FF7A9E",
    bg: "rgba(255,122,158,0.12)",
    border: "rgba(255,122,158,0.3)",
  },
  amber: {
    fg: "#F2C46E",
    bg: "rgba(242,196,110,0.12)",
    border: "rgba(242,196,110,0.28)",
  },
} as const;

export type TintKey = keyof typeof tints;
