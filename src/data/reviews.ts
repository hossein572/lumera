import { addDays, toISO } from "@/lib/fa";
import { pick, rngFrom } from "@/lib/rng";
import { serviceById } from "./services";
import { specialists } from "./specialists";
import type { Review } from "./types";

const AUTHORS = [
  "مریم صادقی",
  "نگین فتاحی",
  "سحر موسوی",
  "پریا اکبری",
  "زهرا کاظمی",
  "هلیا رستمی",
  "آرمیتا نجفی",
  "فاطمه یوسفی",
  "رویا قنبری",
  "سمیرا حدادی",
  "نازنین سلطانی",
  "شیما رضایی",
  "المیرا باقری",
  "ترانه محمدی",
  "پویا کیانی",
  "مهسا جعفری",
  "ایلخان نوری",
  "غزل امیری",
  "رها شریفی",
  "آیدافرهادی",
];

const POSITIVE = [
  "دقیقاً همان چیزی بود که می‌خواستم. تمیزی کار و وقت‌شناسی هر دو عالی بود.",
  "اولین بارم بود این خدمت را انجام می‌دهم و همه‌چیز را آرام توضیح دادند. هیچ فشار یا عجله‌ای نبود.",
  "نتیجه بعد از دو هفته هنوز سر جایش است؛ به‌خصوص لبه‌ها و فرم‌دهی که برایم مهم بود.",
  "از مشاوره‌ی قبل از رزرو خیلی راضی بودم. صادقانه گفتند این خدمت برای پوست من مناسب نیست و گزینه‌ی دیگر را پیشنهاد دادند.",
  "محیط تمیز و آرام، بوی خوب، و متریال یک‌بارمصرف که واقعاً حس خوبی داد.",
  "قیمت را در همان صفحه شفاف دیده بودم و در سالن هیچ هزینه‌ی اضافه‌ای حساب نشد.",
  "وقت رزرم ۱۸ بود و دقیقاً همان دقیقه شروع شد. برای کسی مثل من که وقتش محدوده، این مهم‌ترین چیز است.",
  "عکس قبل و بعد گرفتند و برام فرستادند؛ جزئیاتی که هیچ‌جا ندیده بودم.",
  "پوستم بعد از کار کمی قرمز شد ولی با همان ماسک آرام‌ساز تا شب کامل درست شد.",
  "دو بار دیگر هم رزرو کردم و کیفیت ثابت مانده؛ این برای من یعنی قابل اعتماد.",
];

const NEUTRAL = [
  "کار خوب بود ولی سالن کمی شلوغ بود و معطلی داشتم. خودِ خدمت کیفیتش خوب بود.",
  "نتیجه راضی‌کننده بود، هرچند انتظار بیشتری از ماندگاری رنگ داشتم. برای جلسات بعدی هماهنگ می‌کنم.",
  "کیفیت کار خوب است، فقط جای پارک در آن منطقه کمی سخت است؛ اگر با مترو بروید راحت‌ترید.",
];

const REPLIES = [
  "ممنون از وقتی که گذاشتید. برای جلسه‌ی بعد، همان پروتکل را سبک‌تر انجام می‌دهیم تا پوست اذیت نشود.",
  "سپاس از لطف شما. اگر تا ۷ روز احساس نیاز کردید، ترمیم شامل پکیج شماست؛ فقط پیام بدهید.",
  "ممنون. برای شلوغی آن روز عذر می‌خواهم؛ از این به بعد زمان‌های عصر را با فاصله‌ی بیشتر رزرو می‌کنم.",
];

function buildForSpecialist(): Review[] {
  const out: Review[] = [];
  const today = toISO(new Date());
  specialists.forEach((sp, si) => {
    const rand = rngFrom(`review-${sp.id}`);
    const count = 3 + (hashCount(si) % 3);
    for (let i = 0; i < count; i++) {
      const r = rand();
      const rating = r > 0.78 ? 4 : r > 0.7 ? 3 : 5;
      const pool =
        rating >= 5
          ? POSITIVE
          : rating === 4
            ? [...POSITIVE.slice(5), ...NEUTRAL]
            : NEUTRAL;
      const text = pick(rand, pool);
      const serviceId = sp.serviceIds[i % sp.serviceIds.length] ?? "";
      out.push({
        id: `rv-${sp.id}-${i + 1}`,
        specialistId: sp.id,
        author: pick(rand, AUTHORS),
        rating,
        date: addDays(today, -(4 + Math.floor(rand() * 150))),
        text,
        serviceId,
        likeCount: Math.floor(rand() * 40),
        reply: rand() > 0.72 ? pick(rand, REPLIES) : undefined,
        verifiedVisit: rand() > 0.15,
      });
    }
  });
  return out;
}

function hashCount(i: number) {
  return (i * 7 + 3) % 5;
}

export const reviews: Review[] = buildForSpecialist();

export function reviewsFor(specialistId: string): Review[] {
  return reviews
    .filter((r) => r.specialistId === specialistId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const reviewTextFor = (serviceId: string) =>
  serviceById[serviceId]?.name ?? "خدمت";

export interface RatingSummary {
  total: number;
  average: number;
  buckets: { stars: number; count: number; pct: number }[];
  withPhoto: number;
  recommend: number;
}

export function ratingSummary(specialistId: string): RatingSummary {
  const list = reviewsFor(specialistId);
  const sp = specialists.find((s) => s.id === specialistId);
  const total = Math.max(list.length, sp?.reviews ?? list.length);
  const average = sp?.rating ?? 4.8;
  const five = Math.round(total * (0.45 + (average - 4.5) * 0.9));
  const four = Math.round(total * 0.28);
  const three = Math.round(total * 0.08);
  const two = Math.round(total * 0.04);
  const one = Math.max(0, total - five - four - three - two);
  const order = [5, 4, 3, 2, 1];
  const counts = [five, four, three, two, one];
  return {
    total,
    average,
    buckets: order.map((stars, i) => ({
      stars,
      count: counts[i] ?? 0,
      pct: total ? Math.round(((counts[i] ?? 0) / total) * 100) : 0,
    })),
    withPhoto: Math.round(total * 0.31),
    recommend: Math.min(99, 84 + Math.round((average - 4.3) * 30)),
  };
}
