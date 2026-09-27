export type CategoryId =
  | "skin"
  | "hair"
  | "nails"
  | "makeup"
  | "care"
  | "massage";

export interface Category {
  id: CategoryId;
  name: string;
  latin: string;
  blurb: string;
  serviceCount: number;
  specialistCount: number;
}

export interface Service {
  id: string;
  categoryId: CategoryId;
  name: string;
  minutes: number;
  /** تومان */
  price: number;
  desc: string;
  popular?: boolean;
  includes?: string[];
}

export type SlotState = "free" | "booked" | "blocked";

export interface Specialist {
  id: string;
  name: string;
  title: string;
  categoryId: CategoryId;
  skills: string[];
  rating: number;
  reviews: number;
  visits: number;
  city: string;
  district: string;
  address: string;
  /** تومان، از */
  priceFrom: number;
  years: number;
  verified: boolean;
  responseMinutes: number;
  gender: "female" | "male";
  languages: string[];
  bio: string;
  philosophy: string;
  highlights: string[];
  education: { title: string; org: string; year: string }[];
  serviceIds: string[];
  face?: string;
  tint: "violet" | "mint" | "rose" | "amber";
  workingDays: number[];
  dayStart: string;
  dayEnd: string;
  slotStep: number;
  busyRate: number;
  social: { instagram: string; site: string };
  featured?: boolean;
  studio: string;
  amenities: string[];
}

export interface Review {
  id: string;
  specialistId: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  serviceId: string;
  likeCount: number;
  reply?: string;
  verifiedVisit: boolean;
}

export type BookingStatus =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "completed"
  | "expired";

export interface Booking {
  id: string;
  code: string;
  userId: string;
  specialistId: string;
  serviceId: string;
  date: string;
  time: string;
  price: number;
  status: BookingStatus;
  createdAt: string;
  note?: string;
  phone: string;
  paid: boolean;
  cancelledBy?: "user" | "specialist";
  reason?: string;
}

export type NotificationKind = "booking" | "promo" | "reminder" | "review";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  date: string;
  time?: string;
  read: boolean;
  bookingCode?: string;
  href?: string;
}

export interface UserAddress {
  id: string;
  label: string;
  city: string;
  district: string;
  detail: string;
  isDefault?: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  skinNote: string;
  addresses: UserAddress[];
}

export interface Draft {
  specialistId: string | null;
  serviceId: string | null;
  date: string | null;
  time: string | null;
  name: string;
  phone: string;
  note: string;
  payAtVenue: boolean;
  agreed: boolean;
}
