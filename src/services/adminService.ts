import { Scene360 } from "@/types/Tour360";
import { authFetch } from "./authFetch";
import { AdminPayment } from "@/types/Payments";
import { Tour360Request } from "@/types/Tour360Request";
import { OwnerEarningRequest } from "@/types/OwnerEarningRequest";
import { trackEvent } from "./logEvent";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL ?? "";

export const requestTour360 = async (
  environmentId: string,
  ownerId: string,
) => {
  const response = await authFetch(`${API_BASE}/api/tour360requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      environmentId,
      ownerId,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    trackEvent("tour360_request_failed", { environmentId, ownerId });
    throw new Error("Error making POST request");
  }

  trackEvent("tour360_request_success", { environmentId, ownerId });

  return response.json();
};

export const getTour360Requests = async (
  page = 1,
  limit = 10,
  status?: number,
) => {
  try {
    const url = new URL(`${API_BASE}/api/tour360requests`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());
    if (status) {
      url.searchParams.append("status", status.toString());
    } else url.searchParams.append("status", "0");

    const res = await authFetch(url.toString(), {
      credentials: "include",
    });

    if (!res.ok) {
      trackEvent("tour360_requests_fetch_failed", { page, limit, status });
      throw new Error("No se pudieron obtener las solicitudes");
    }

    trackEvent("tour360_requests_fetch_success", { page, limit, status });

    const data = await res.json();
    return data;
  } catch {
    throw new Error("Error inesperado");
  }
};

export const uploadVirtualTour = async (
  environmentPublicId: string,
  scenes: Scene360[],
): Promise<void> => {
  const res = await authFetch(
    // `http://localhost:5150/api/tours?environmentPublicId=${environmentPublicId}`,
    `${API_BASE}/api/tour360requests/${environmentPublicId}/upload`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scenes }),
      credentials: "include",
    },
  );

  if (!res.ok) {
    trackEvent("tour360_upload_failed", { environmentPublicId });
    const errorText = await res.text();
    throw new Error(`Error al subir el recorrido: ${errorText}`);
  }

  trackEvent("tour360_upload_success", { environmentPublicId });
};

export const updateTour360Status = async (
  publicId: string,
  newStatus: number,
): Promise<boolean> => {
  try {
    const res = await authFetch(
      `${API_BASE}/api/tour360requests/${publicId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      },
    );

    trackEvent("tour360_status_update", { publicId, newStatus });
    return res.ok;
  } catch {
    trackEvent("tour360_status_update_failed", { publicId, newStatus });
    return false;
  }
};

export const getDebts = async (page = 1, limit = 20) => {
  const response = await authFetch(
    `${API_BASE}/api/admin/debts?page=${page}&limit=${limit}`,
  );
  if (!response.ok) {
    trackEvent("debts_fetch_failed");
    throw new Error("Failed to fetch debts");
  }
  trackEvent("debts_fetch_success");
  return await response.json();
};

export const getPayments = async (page = 1, limit = 20) => {
  const response = await authFetch(
    `${API_BASE}/api/admin/payments?page=${page}&limit=${limit}`,
  );
  if (!response.ok) {
    trackEvent("payments_fetch_failed");
    throw new Error("Failed to fetch payments");
  }
  trackEvent("payments_fetch_success");
  return await response.json();
};

export const getDebtDetails = async (debtId: string) => {
  const response = await authFetch(`${API_BASE}/api/admin/debts/${debtId}`);
  if (!response.ok) {
    trackEvent("debt_details_fetch_failed");
    throw new Error("Failed to fetch debt details");
  }
  trackEvent("debt_details_fetch_success");
  return await response.json();
};

export const getPaymentDetails = async (paymentId: string) => {
  const response = await authFetch(
    `${API_BASE}/api/admin/payments/${paymentId}`,
  );
  if (!response.ok) {
    trackEvent("payment_details_fetch_failed");
    throw new Error("Failed to fetch payment details");
  }
  trackEvent("payment_details_fetch_success");
  return await response.json();
};

export const markDebtAsPaid = async (
  debtId: string,
  reference: string,
): Promise<AdminPayment> => {
  const requestBody: { reference: string } = { reference };

  const response = await fetch(
    `${API_BASE}/api/admin/debts/${debtId}/mark-as-paid`,
    {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    trackEvent("mark_debt_as_paid_failed", { debtId });
    throw new Error("Failed to mark debt as paid");
  }

  trackEvent("mark_debt_as_paid_success", { debtId });

  return await response.json();
};

export const updateTour360Schedule = async (
  id: string,
  scheduledDateUnix: number,
) => {
  const res = await fetch(`${API_BASE}/api/tour360requests/${id}/schedule`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scheduledDate: scheduledDateUnix }),
  });
  if (!res.ok) {
    trackEvent("tour360_schedule_update_failed", { id, scheduledDateUnix });
    throw new Error("No se pudo actualizar la fecha programada");
  }

  trackEvent("tour360_schedule_update_success", { id, scheduledDateUnix });
};

export const getLastTour360RequestDateByEnv = async (envPublicId: string) => {
  const res = await fetch(
    `${API_BASE}/api/tour360requests/environments/${envPublicId}/last-request-date`,
  );
  if (res.status === 204) return null;
  if (!res.ok) throw new Error("Error obteniendo última fecha de solicitud");
  const data = await res.json();
  trackEvent("fetched_last_tour360_request_date", { envPublicId });
  return data.requestDate as number;
};

export const getTour360RequestsByDay = async (
  page: number = 1,
  limit: number = 16,
  status: number = 0,
  scheduledDayTimestamp: number,
): Promise<{
  items: Tour360Request[];
  totalItems: number;
  totalPages: number;
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) {
    params.append("status", status.toString());
  } else params.append("status", "0");

  params.append("scheduledDayTimestamp", scheduledDayTimestamp.toString());

  const response = await fetch(
    `${API_BASE}/api/tour360requests/by-day?${params.toString()}`,
  );

  if (!response.ok) {
    trackEvent("tour360_requests_by_day_fetch_failed", {
      page,
      limit,
      status,
      scheduledDayTimestamp,
    });
    throw new Error("Error fetching tour360 requests by day");
  }

  trackEvent("tour360_requests_by_day_fetch_success", {
    page,
    limit,
    status,
    scheduledDayTimestamp,
  });
  return response.json();
};

/**
 * Registra las ganancias para un propietario específico.
 * @param earningData Los datos de la ganancia a registrar.
 * @returns Una promesa que resuelve con los datos de respuesta de la API.
 */
export const registerOwnerEarning = async (
  earningData: OwnerEarningRequest,
) => {
  const response = await authFetch(`${API_BASE}/api/owners/earnings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(earningData),
    credentials: "include",
  });

  trackEvent("owner_earning_registration_attempt", {
    ownerId: earningData.ownerId,
    amount: earningData.amount,
  });

  if (!response.ok) {
    trackEvent("owner_earning_registration_failed", {
      ownerId: earningData.ownerId,
    });
    throw new Error("Error registering owner earning");
  }

  return response.json(); // Parsea y retorna la respuesta JSON
};
