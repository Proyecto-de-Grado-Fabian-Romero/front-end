interface TimeRange {
  startDate: number;
  endDate: number;
}

interface CreateReservationPayload {
  environmentId: string;
  timeRanges: TimeRange[];
  totalPrice: number;
  currency?: string;
}

export const createReservation = async (
  payload: CreateReservationPayload,
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
