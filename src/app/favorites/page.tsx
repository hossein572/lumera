import type { Metadata } from "next";
import { FavoritesView } from "@/components/favorites-view";

export const metadata: Metadata = {
  title: "علاقه‌مندی‌ها",
  description: "فهرست متخصص‌هایی که نشان کرده‌اید.",
};

export default function FavoritesPage() {
  return <FavoritesView />;
}
