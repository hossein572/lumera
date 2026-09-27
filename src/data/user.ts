import type { UserProfile } from "./types";

export const defaultUser: UserProfile = {
  name: "آرمیتا نجفی",
  phone: "09121234567",
  email: "armita.n@lumera.app",
  birthDate: "1372-04-18",
  skinNote: "پوست مختلط با ناحیه‌ی T چرب؛ سابقه‌ی حساسیت به عطر.",
  addresses: [
    {
      id: "ad-1",
      label: "خانه",
      city: "تهران",
      district: "منطقه ۶ — امیرآباد",
      detail: "خیابان کارگر شمالی، کوچه بهار، پلاک ۸، واحد ۳",
      isDefault: true,
    },
    {
      id: "ad-2",
      label: "محل کار",
      city: "تهران",
      district: "منطقه ۳ — ونک",
      detail: "خیابان ملاصدرا، پلاک ۹۲، طبقه ۵",
    },
    {
      id: "ad-3",
      label: "خانه‌ی مادر",
      city: "تهران",
      district: "منطقه ۲ — صادقیه",
      detail: "بلوار آیت‌الله کاشانی، مجتمع نگین، واحد ۱۱",
    },
  ],
};

export const defaultFavorites = ["sp1", "sp4"];

export const accountStats = {
  /** سفرهای انجام‌شده */
  trips: 12,
  /** مبلغ ذخیره‌شده (تومان) در یک سال */
  saved: 1840000,
  /** امتیازهای ثبت‌شده */
  reviewsWritten: 5,
};
