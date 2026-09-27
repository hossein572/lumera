import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { specialistById, specialists } from "@/data/specialists";
import { SpecialistView } from "@/components/specialist-view";

export function generateStaticParams() {
  return specialists.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const sp = specialistById[id];
  if (!sp) return { title: "متخصص پیدا نشد" };
  return {
    title: `${sp.name} — ${sp.title}`,
    description: `${sp.bio.slice(0, 110)}… | امتیاز ${sp.rating} از ${sp.reviews} نظر در لومرا.`,
  };
}

export default async function SpecialistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sp = specialistById[id];
  if (!sp) notFound();
  return <SpecialistView sp={sp} />;
}
