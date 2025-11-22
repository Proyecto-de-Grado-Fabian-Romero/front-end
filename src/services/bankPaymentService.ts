import { BankPaymentData } from "@/types/BankPaymentData";
import { trackEvent } from "./logEvent";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_USERS_URL ?? "";

export async function updateBankPayment(data: BankPaymentData): Promise<void> {
  const response = await fetch(`${API_BASE}/api/bank-payment`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    trackEvent("bank_payment_update_failed");
    throw new Error("Error al actualizar los datos bancarios");
  }

  trackEvent("bank_payment_updated");
}

export async function createBankPayment(data: BankPaymentData): Promise<void> {
  const response = await fetch(`${API_BASE}/api/bank-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    trackEvent("bank_payment_create_failed");
    throw new Error("Error al guardar los datos bancarios");
  }

  trackEvent("bank_payment_created");
}
