importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyCQu4_0svGItpSShmPO2G1DX93aUhBDNHY",
  authDomain: "desarrollo-en-la-nube-7e9ff.firebaseapp.com",
  projectId: "desarrollo-en-la-nube-7e9ff",
  storageBucket: "desarrollo-en-la-nube-7e9ff.firebasestorage.app",
  messagingSenderId: "193650308490",
  appId: "1:193650308490:web:1b9c7d7f12e5ca2a850473",
  measurementId: "G-L8Z0XPBL86",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.data;
  self.registration.showNotification(title, { body, icon: "/images/logo.png" });
});

/* global self, clients */
self.addEventListener("push", (event) => {
  let raw = {};
  try {
    raw = event.data ? event.data.json() : {};
  } catch {}
  const d = raw.data || raw; // FCM a veces envuelve en data

  const title = d.title || "Notificación";
  const body = d.message || "";
  const url = d.url || "/";
  const tag = d.notificationId || Date.now().toString();
  const type = d.type || "Info";

  event.waitUntil(
    (async () => {
      // 1) Notificación del sistema
      await self.registration.showNotification(title, {
        body,
        tag,
        data: { url, id: tag, type, data: d },
        icon: "/images/logo.png",
        badge: "/images/logo.png",
      });

      // 2) Avisar a pestañas activas para que muestren Snackbar
      if ("BroadcastChannel" in self) {
        const bc = new BroadcastChannel("push-events");
        bc.postMessage({ kind: "sw-push", title, body, type, data: d });
      }
    })(),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "/";
  event.waitUntil(
    (async () => {
      const all = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      const origin = self.location.origin;
      const target = new URL(url, origin).href;
      const same = all.find((c) => c.url === target);
      if (same) {
        same.focus();
        same.postMessage?.({ kind: "navigate", url: target });
      } else {
        await clients.openWindow(target);
      }
    })(),
  );
});
