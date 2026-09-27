import { Suspense } from "react";
import { SuccessClient } from "./success-client";

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessClient />
    </Suspense>
  );
}
