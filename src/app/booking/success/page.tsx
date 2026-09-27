import { SuccessClient } from "./success-client";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const id = typeof raw.id === "string" ? raw.id : undefined;
  return <SuccessClient bookingId={id} />;
}
