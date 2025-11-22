import { getAnalytics } from "firebase/analytics";
import { getApps, initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  MessagePayload,
  onMessage,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCQu4_0svGItpSShmPO2G1DX93aUhBDNHY",
  authDomain: "desarrollo-en-la-nube-7e9ff.firebaseapp.com",
  projectId: "desarrollo-en-la-nube-7e9ff",
  storageBucket: "desarrollo-en-la-nube-7e9ff.firebasestorage.app",
  messagingSenderId: "193650308490",
  appId: "1:193650308490:web:1b9c7d7f12e5ca2a850473",
  measurementId: "G-L8Z0XPBL86",
};

const app =
  typeof window !== "undefined" && !getApps().length
    ? initializeApp(firebaseConfig)
    : getApps()[0] || null;
export const messaging =
  typeof window !== "undefined" && app ? getMessaging(app) : null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const analytics =
  typeof window !== "undefined" && app ? getAnalytics(app) : null;

export async function getFcmToken(): Promise<string | null> {
  if (!messaging) return null;
  try {
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

export function listenForeground(handler: (payload: MessagePayload) => void) {
  if (!messaging) return;
  onMessage(messaging, handler);
}
