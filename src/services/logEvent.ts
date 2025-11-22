import { analytics } from "@/utils/firebase";
import { logEvent } from "firebase/analytics";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === "undefined") return;
  if (!analytics) return;

  logEvent(analytics, eventName, params);
}
