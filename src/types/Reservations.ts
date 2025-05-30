export type ReservationTimeRange = {
  startDate: number; // timestamp in ms
  endDate: number; // timestamp in ms
};

export type ReservationResponse = {
  publicId: string;
  environmentId: string;
  environmentTitle: string;
  environmentPhotoUrl?: string;
  status: "pending" | "confirmed" | "rejected" | "cancelled" | "paid";
  isInstant: boolean;
  currency: string;
  totalPrice: number;
  createdAt: number; // timestamp
  timeRanges: ReservationTimeRange[];
};

export type CreateReservationPayload = {
  environmentId: string;
  timeRanges: ReservationTimeRange[];
  totalPrice: number;
  currency?: string;
};
