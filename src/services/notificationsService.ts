const API_BASE = process.env.NEXT_PUBLIC_API_BASE_NOTIFICATIONS_URL ?? "";

export type NotificationDto = {
  id: string;
  userPublicId: string;
  title: string;
  message: string;
  type: string;
  channel: string;
  status: string;
  createdAt: string;
  sentAt?: string | null;
  readAt?: string | null;
};

export type PagedResponse<T> = {
  total: number;
  page: number;
  pageSize: number;
  items: T[];
};

async function fetchJson<T>(
  input: string | URL,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input.toString(), {
    credentials: "include", // envía cookies
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const text = await res.text();
      msg = text || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

/** Lista notificaciones paginadas de un usuario */
export async function listNotifications(
  userPublicId: string,
  page = 1,
  pageSize = 20,
): Promise<PagedResponse<NotificationDto>> {
  const url = new URL("/api/notifications", API_BASE);
  url.searchParams.set("userId", userPublicId);
  url.searchParams.set("page", String(page));
  url.searchParams.set("pageSize", String(pageSize));
  return fetchJson<PagedResponse<NotificationDto>>(url);
}

/** Marca una notificación como leída */
export async function markNotificationRead(id: string): Promise<void> {
  const url = new URL(`/api/notifications/${id}/read`, API_BASE);
  await fetchJson<void>(url, { method: "PATCH" });
}

/** Envía una notificación a un usuario (por si la necesitas en UI) */
export async function sendToUser(params: {
  publicId: string;
  title: string;
  message: string;
  type: string; // mapea a tu enum en backend
  channel: string; // mapea a tu enum en backend
  metadata?: unknown;
}): Promise<{ notificationId: string }> {
  const url = new URL(`/api/notifications/users/${params.publicId}`, API_BASE);
  return fetchJson<{ notificationId: string }>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: params.title,
      message: params.message,
      type: params.type,
      channel: params.channel,
      metadata: params.metadata ?? null,
    }),
  });
}

export async function broadcastToAdmins(params: {
  title: string;
  message: string;
  type: string;
  metadata?: unknown;
}): Promise<void> {
  const url = new URL("/api/notifications/broadcast/admins", API_BASE);
  await fetchJson<void>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: params.title,
      message: params.message,
      type: params.type,
      metadata: params.metadata ?? null,
    }),
  });
}

export async function markAllNotificationsRead(
  userPublicId: string,
): Promise<void> {
  const url = new URL(
    `/api/notifications/users/${userPublicId}/read-all`,
    API_BASE,
  );

  const res = await fetch(url.toString(), {
    method: "PATCH",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (res.status !== 204 && res.headers.get("content-length") !== "0") {
    await res.json().catch(() => {});
  }
}

export async function getUnreadCount(userPublicId: string): Promise<number> {
  const url = new URL("/api/notifications/unread", API_BASE);
  url.searchParams.set("userId", userPublicId);
  const { count } = await fetchJson<{ count: number }>(url);
  return count;
}

/**
 * Borra todas las notificaciones de un usuario.
 */
export const clearAllNotifications = async (
  userPublicId: string,
): Promise<number> => {
  const res = await fetch(
    `${API_BASE}/api/notifications/users/${userPublicId}`,
    {
      method: "DELETE",
    },
  );
  console.log(`${userPublicId}`);

  if (!res.ok) {
    throw new Error(`Error al borrar notificaciones: ${res.statusText}`);
  }

  const data: { deleted: number } = await res.json();
  return data.deleted;
};

/**
 * Borra un token FCM específico.
 */
export const deleteFcmToken = async (token: string): Promise<number> => {
  console.log(`${token}`);
  const res = await fetch(
    `${API_BASE}/api/notifications/fcm-tokens/${encodeURIComponent(token)}`,
    {
      method: "DELETE",
    },
  );

  const data: { deleted: number } = await res.json();
  return data.deleted;
};
