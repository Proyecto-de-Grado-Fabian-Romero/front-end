import { useEffect } from "react";
import { listenForeground, getFcmToken } from "@/utils/firebase";
import { useAppDispatch } from "@/store";
import { enqueue } from "@/store/slices/notificationSlice";

const bc =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("push-events")
    : null;

export function usePushSetup() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 1) Obtener token y enviarlo a tu backend si aplica
    (async () => {
      try {
        await getFcmToken(/* opcional: VAPID_PUBLIC_KEY */);
        // TODO: POST token a tu UsersService si aún no lo haces
        // await fetch("/api/users/fcm-token", { method: "POST", body: JSON.stringify({ token }) })
      } catch (e) {
        console.error("FCM token error", e);
      }
    })();

    // 2) Mensajes en foreground → dispara Snackbar
    listenForeground((payload) => {
      const d = payload.data || {};
      const title = d.title || payload.notification?.title || "Notificación";
      const message = d.message || payload.notification?.body || "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const type = (d.type as any) || "Info";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(enqueue({ title, message, type, data: d as any }));
      // Broadcast a otras pestañas
      bc?.postMessage({ kind: "foreground", title, message, type, data: d });
    });

    // 3) Mensajes que vienen desde el SW (otras pestañas/background)
    const onBc = (e: MessageEvent) => {
      const msg = e.data;
      if (!msg || (msg.kind !== "sw-push" && msg.kind !== "foreground")) return;
      const { title, body, message, type, data } = msg;
      dispatch(
        enqueue({
          title,
          message: message ?? body ?? "",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          type: (type as any) ?? "Info",
          data,
        }),
      );
    };
    bc?.addEventListener?.("message", onBc);
    return () => bc?.removeEventListener?.("message", onBc);
  }, [dispatch]);
}
