"use client";

import { useSyncExternalStore } from "react";

const EMPTY_SUBSCRIBE = () => () => {};

/** آیا در مرورگر هستیم؟ (بدون setState در effect) */
export function useIsBrowser() {
  return useSyncExternalStore(
    EMPTY_SUBSCRIBE,
    () => true,
    () => false,
  );
}
