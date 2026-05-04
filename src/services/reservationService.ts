import { PagedResult } from "@/types/PagedResult";
import {
  CreateReservationPayload,
  ReservationResponse,
} from "@/types/Reservations";
import { trackEvent } from "./logEvent";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_ENVIRONMENTS_URL ?? "";

export const createReservation = async (
  payload: CreateReservationPayload,
): Promise<ReservationResponse> => {
  const res = await fetch(`${API_BASE}/api/Reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  console.log(payload)

  if (!res.ok) {
    trackEvent("reservation_create_failed");
    const error = await res.json();
    console.log(error);
    throw new Error(error.message || "Error al crear la reserva");
  }

  trackEvent("reservation_created", { environmentId: payload.environmentId });

  return (await res.json()) as ReservationResponse;
};

export const getMyReservations = async (
  status: string = "confirmed",
  page: number = 1,
  limit: number = 10,
  type: string = "mine", // nuevo param por defecto
): Promise<PagedResult<ReservationResponse>> => {
  const params = new URLSearchParams({
    status,
    page: page.toString(),
    limit: limit.toString(),
    type,
  });

  const res = await fetch(
    `${API_BASE}/api/Reservations/mine?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!res.ok) {
    trackEvent("reservations_list_failed");
    throw new Error("Error al obtener las reservas");
  }

  trackEvent("reservations_list_success");
  const data: PagedResult<ReservationResponse> = await res.json();
  return data;
};

export const getReservationById = async (
  publicId: string,
): Promise<ReservationResponse> => {
  const res = await fetch(`${API_BASE}/api/Reservations/${publicId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    trackEvent("reservation_detail_failed", { publicId });
    throw new Error("Error al obtener la reserva");
  }

  trackEvent("reservation_detail_success", { publicId });

  return res.json();
};

export const updateReservationStatus = async (
  publicId: string,
  newStatus: string,
): Promise<void> => {
  const res = await fetch(`${API_BASE}/api/Reservations/${publicId}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!res.ok) {
    trackEvent("reservation_status_update_failed", { publicId, newStatus });
    throw new Error("Error al actualizar el estado de la reserva");
  }

  trackEvent("reservation_status_update_success", { publicId, newStatus });
};

export const checkReservationConflicts = async (
  environmentId: string,
  start: number,
  end: number,
): Promise<boolean> => {
  const params = new URLSearchParams({
    environmentId,
    start: start.toString(),
    end: end.toString(),
  });

  const res = await fetch(`${API_BASE}/api/Reservations/conflicts?${params}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    trackEvent("reservation_conflict_check_failed", {
      environmentId,
      start,
      end,
    });
    throw new Error("Error al verificar conflictos de reservas");
  }

  const { hasConflict } = await res.json();

  trackEvent("reservation_conflict_check_success", {
    environmentId,
    start,
    end,
    hasConflict,
  });
  return hasConflict;
};

export const getMyReservationsByDay = async (
  scheduledDayTimestamp: number,
  status?: string,
  page: number = 1,
  limit: number = 10,
  type?: string,
): Promise<{
  items: ReservationResponse[];
  totalPages: number;
  totalItems: number;
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    scheduledDayTimestamp: scheduledDayTimestamp.toString(),
  });

  if (status) {
    params.append("status", status);
  }
  if (type) {
    params.append("type", type);
  }

  const response = await fetch(
    `${API_BASE}/api/Reservations/mine/by-day?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    trackEvent("reservations_by_day_failed", {
      scheduledDayTimestamp,
      status,
      page,
      limit,
      type,
    });
    throw new Error("Error fetching reservations by day");
  }

  trackEvent("reservations_by_day_success", {
    scheduledDayTimestamp,
    status,
    page,
    limit,
    type,
  });

  return response.json();
};
