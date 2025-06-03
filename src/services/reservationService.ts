import { PagedResult } from "@/types/PagedResult";
import {
  CreateReservationPayload,
  ReservationResponse,
} from "@/types/Reservations";

export const createReservation = async (
  payload: CreateReservationPayload
): Promise<void> => {
  const res = await fetch("http://localhost:5150/api/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.mensaje || "Error al crear la reserva");
  }
};

export const getMyReservations = async (
  status: string = "confirmed",
  page: number = 1,
  limit: number = 10
): Promise<PagedResult<ReservationResponse>> => {
  const params = new URLSearchParams({
    status,
    page: page.toString(),
    limit: limit.toString(),
  });

  const res = await fetch(
    `http://localhost:5150/api/Reservations/mine?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Error al obtener las reservas");
  }

  const data: PagedResult<ReservationResponse> = await res.json();
  return data;
};

export const getReservationById = async (
  publicId: string
): Promise<ReservationResponse> => {
  const res = await fetch(
    `http://localhost:5150/api/Reservations/${publicId}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Error al obtener la reserva");
  }

  return res.json();
};

export const updateReservationStatus = async (
  publicId: string,
  newStatus: string
): Promise<void> => {
  const res = await fetch(
    `http://localhost:5150/api/Reservations/${publicId}/status`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    }
  );

  if (!res.ok) {
    const { mensaje } = await res.json();
    throw new Error(mensaje || "Error al actualizar el estado de la reserva");
  }
};

export const checkReservationConflicts = async (
  environmentId: string,
  start: number,
  end: number
): Promise<boolean> => {
  const params = new URLSearchParams({
    environmentId,
    start: start.toString(),
    end: end.toString(),
  });

  const res = await fetch(
    `http://localhost:5150/api/Reservations/conflicts?${params}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Error al verificar conflictos de reservas");
  }

  const { hasConflict } = await res.json();
  return hasConflict;
};

export const getReservationsByDay = async (
  timestamp: number
): Promise<ReservationResponse[]> => {
  const res = await fetch(
    `http://localhost:5150/api/Reservations/day?timestamp=${timestamp}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Error al obtener las reservas del día");
  }

  return await res.json();
};
