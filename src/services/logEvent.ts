import { analytics } from "@/utils/firebase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === "undefined") return;
  if (!analytics) return;

  import("firebase/analytics")
    .then(({ logEvent }) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        logEvent(analytics as any, eventName, params);
      } catch (err) {
        console.error("trackEvent failed:", err);
      }
    })
    .catch((err) => {
      console.error("Failed to load firebase/analytics for trackEvent:", err);
    });
}
