import { trackEvent } from "./logEvent";

export interface CreatePaymentDto {
  reservationId: string;
  clientEmail: string;
  clientFullName: string;
  clientCI: string;
  clientNIT: string;
}

export interface PaymentUrlResponse {
  url: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_ENVIRONMENTS_URL ?? "";

export async function createPayment(
  dto: CreatePaymentDto,
  fechaVencimiento: string,
): Promise<PaymentUrlResponse> {
  const response = await fetch(
    `${API_BASE}/api/reservations/pay?fechaVencimiento=${fechaVencimiento}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    },
  );

  if (!response.ok) {
    trackEvent("payment_creation_failed", { reservationId: dto.reservationId });
    throw new Error("Failed to create payment");
  }

  trackEvent("payment_creation_success", { reservationId: dto.reservationId });

  return response.json();
}

export interface PaymentStatusResponse {
  status: "pending" | "paid";
  invoiceUrl?: string;
  paidAt?: number;
}

export async function checkPaymentStatus(
  reservationId: string,
): Promise<PaymentStatusResponse> {
  const response = await fetch(
    `${API_BASE}/api/reservations/payments/status/${reservationId}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    trackEvent("payment_status_fetch_failed", { reservationId });
    throw new Error("Failed to fetch payment status");
  }

  trackEvent("payment_status_fetch_success", { reservationId });

  return response.json();
}
