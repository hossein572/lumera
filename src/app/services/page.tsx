import type { Metadata } from "next";
import { ServicesView } from "@/components/services-view";

export const metadata: Metadata = {
  title: "خدمات لومرا",
  description:
    "فهرست کامل خدمات زیبایی و مراقبت با مدت، قیمت و تعداد متخصص‌های فعال هر خدمت.",
};

export default function ServicesPage() {
  return <ServicesView />;
}
