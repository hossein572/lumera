/** تصاویر پروژه — masterها در public/img و واریانت‌های مشتق با scripts/build-images.sh */

const asset = (path: string) => `/lumera${path.startsWith("/") ? path : `/${path}`}`;

export const HERO_IMG = asset("/img/hero.jpg");

export type CatId = "skin" | "hair" | "nails" | "makeup" | "care" | "massage";

export const categoryArt: Record<
  CatId,
  { tile: string; wide: string; frag: string; work: [string, string, string] }
> = {
  skin: {
    tile: asset("/img/cat-skin.jpg"),
    wide: asset("/img/cat-skin-wide.jpg"),
    frag: asset("/img/frag-skin.jpg"),
    work: [
      asset("/img/work-skin-1.jpg"),
      asset("/img/work-skin-2.jpg"),
      asset("/img/work-skin-3.jpg"),
    ],
  },
  hair: {
    tile: asset("/img/cat-hair.jpg"),
    wide: asset("/img/cat-hair-wide.jpg"),
    frag: asset("/img/frag-hair.jpg"),
    work: [
      asset("/img/work-hair-1.jpg"),
      asset("/img/work-hair-2.jpg"),
      asset("/img/work-hair-3.jpg"),
    ],
  },
  nails: {
    tile: asset("/img/cat-nails.jpg"),
    wide: asset("/img/cat-nails-wide.jpg"),
    frag: asset("/img/frag-nails.jpg"),
    work: [
      asset("/img/work-nails-1.jpg"),
      asset("/img/work-nails-2.jpg"),
      asset("/img/work-nails-3.jpg"),
    ],
  },
  makeup: {
    tile: asset("/img/cat-makeup.jpg"),
    wide: asset("/img/cat-makeup-wide.jpg"),
    frag: asset("/img/frag-makeup.jpg"),
    work: [
      asset("/img/work-makeup-1.jpg"),
      asset("/img/work-makeup-2.jpg"),
      asset("/img/work-makeup-3.jpg"),
    ],
  },
  care: {
    tile: asset("/img/cat-care.jpg"),
    wide: asset("/img/cat-care-wide.jpg"),
    frag: asset("/img/frag-care.jpg"),
    work: [
      asset("/img/work-care-1.jpg"),
      asset("/img/work-care-2.jpg"),
      asset("/img/work-care-3.jpg"),
    ],
  },
  massage: {
    tile: asset("/img/cat-massage.jpg"),
    wide: asset("/img/cat-massage-wide.jpg"),
    frag: asset("/img/frag-massage.jpg"),
    work: [
      asset("/img/work-massage-1.jpg"),
      asset("/img/frag-massage.jpg"),
      asset("/img/work-massage-3.jpg"),
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
    base: asset("/img/portrait-1.jpg"),
    face: asset("/img/portrait-1-face.jpg"),
    alt: asset("/img/portrait-1-alt.jpg"),
    wide: asset("/img/portrait-1-wide.jpg"),
  },
  p2: {
    base: asset("/img/portrait-2.jpg"),
    face: asset("/img/portrait-2-face.jpg"),
    alt: asset("/img/portrait-2-alt.jpg"),
    wide: asset("/img/portrait-2-wide.jpg"),
  },
  p3: {
    base: asset("/img/portrait-3.jpg"),
    face: asset("/img/portrait-3-face.jpg"),
    alt: asset("/img/portrait-3-alt.jpg"),
    wide: asset("/img/portrait-3-wide.jpg"),
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
