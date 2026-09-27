import type { Metadata } from "next";
import { NotificationsView } from "@/components/notifications-view";

export const metadata: Metadata = {
  title: "اعلان‌ها",
  description: "وضعیت رزرو، یادآوری مراقبت و ظرفیت‌های تازه.",
};

export default function NotificationsPage() {
  return <NotificationsView />;
}
