// firebaseAnalytics.ts
let analyticsInstance: any = null;

export function getAnalyticsSafe(app: any) {
  if (typeof window === "undefined") return null;
  if (analyticsInstance) return analyticsInstance;

  try {
    const { getAnalytics, isSupported } = require("firebase/analytics");
    isSupported().then((ok: boolean) => {
      if (ok) {
        analyticsInstance = getAnalytics(app);
      }
    });
  } catch (err) {
    console.error("Analytics init failed:", err);
  }

  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let app: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let messaging: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let analytics: any = null;

if (typeof window !== "undefined") {
  const { getAnalytics } = require("firebase/analytics");
  const { getApps, initializeApp } = require("firebase/app");
  const {
    getMessaging,
  } = require("firebase/messaging");

  const firebaseConfig = {
    apiKey: "AIzaSyCQu4_0svGItpSShmPO2G1DX93aUhBDNHY",
    authDomain: "desarrollo-en-la-nube-7e9ff.firebaseapp.com",
    projectId: "desarrollo-en-la-nube-7e9ff",
    storageBucket: "desarrollo-en-la-nube-7e9ff.firebasestorage.app",
    messagingSenderId: "193650308490",
    appId: "1:193650308490:web:1b9c7d7f12e5ca2a850473",
    measurementId: "G-L8Z0XPBL86",
  };

  app =
    !getApps().length
      ? initializeApp(firebaseConfig)
      : getApps()[0] || null;
  messaging = app ? getMessaging(app) : null;
  analytics = getAnalyticsSafe(app);
}

export { app, messaging, analytics };

export async function getFcmToken(): Promise<string | null> {
  if (!messaging) return null;
  try {
    const { getToken } = await import("firebase/messaging");
    const status = await Notification.requestPermission();
    if (status !== "granted") return null;
    const token = await getToken(messaging, {
      vapidKey:
        "BHFYdf1bzO-yIwpvuoOaJWCplPDu4PWsbFWSHf1IS0JG9XYJvyamv7122Nplk7qcQqSI-dmW5VpmNfFc-EAmyww",
    });
    return token ?? null;
  } catch {
    return null;
  }
}

export async function listenForeground(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (payload: any) => void,
) {
  if (!messaging) return;
  const { onMessage } = await import("firebase/messaging");
  onMessage(messaging, handler);
}
