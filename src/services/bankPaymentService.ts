import { BankPaymentData } from "@/types/BankPaymentData";

export async function updateBankPayment(data: BankPaymentData): Promise<void> {
  const response = await fetch("http://localhost:5123/api/bank-payment", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar los datos bancarios");
  }
}

export async function createBankPayment(data: BankPaymentData): Promise<void> {
  const response = await fetch("http://localhost:5123/api/bank-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al guardar los datos bancarios");
  }
}
