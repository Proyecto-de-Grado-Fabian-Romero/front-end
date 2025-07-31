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

export async function createPayment(
  dto: CreatePaymentDto,
  gateway: string = "Libelula"
): Promise<PaymentUrlResponse> {
  const response = await fetch(
    `http://localhost:5150/api/reservations/pay?gateway=${gateway}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create payment");
  }

  return response.json();
}

export interface PaymentStatusResponse {
  status: "pending" | "paid";
  invoiceUrl?: string;
  paidAt?: number;
}

export async function checkPaymentStatus(
  reservationId: string
): Promise<PaymentStatusResponse> {
  const response = await fetch(
    `http://localhost:5150/api/reservations/payments/status/${reservationId}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch payment status");
  }

  return response.json();
}

