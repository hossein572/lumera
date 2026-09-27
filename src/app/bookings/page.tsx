import type { Metadata } from "next";
import { BookingsView } from "@/components/bookings-view";

export const metadata: Metadata = {
  title: "رزروهای من",
  description: "مدیریت نوبت‌ها: رزروهای آینده، تاریخچه، لغو و جابه‌جایی زمان.",
};

export default function BookingsPage() {
  return <BookingsView />;
}
