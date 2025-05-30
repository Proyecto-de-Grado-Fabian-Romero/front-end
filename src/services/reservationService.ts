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
): Promise<ReservationResponse[]> => {
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

  return await res.json();
};
