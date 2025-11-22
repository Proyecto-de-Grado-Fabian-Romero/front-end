export type ReservationTimeRange = {
  startDate: number; // timestamp in ms
  endDate: number; // timestamp in ms
};

export type ReservationResponse = {
  publicId: string;
  environmentId: string;
  environmentPublicId: string;
  environmentTitle: string;
  environmentPhotoUrl?: string;
  status: "pending" | "confirmed" | "rejected" | "cancelled" | "paid";
  isInstant: boolean;
  currency: string;
  totalPrice: number;
  createdAt: number; // timestamp
  confirmedAt?: number;
  ownerId: string;
  renterId: string;
  timeRanges: ReservationTimeRange[];
  rentalUnit: "Horas" | "Días";
  peopleQuantity: number;
};

export type CreateReservationPayload = {
  environmentId: string;
  timeRanges: ReservationTimeRange[];
  totalPrice: number;
  peopleQuantity: number;
  currency?: string;
};
