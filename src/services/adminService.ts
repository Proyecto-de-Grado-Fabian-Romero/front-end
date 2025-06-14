import { Scene360 } from "@/types/Tour360";
import { authFetch } from "./authFetch";

export const requestTour360 = async (
  environmentId: string,
  ownerId: string
) => {
  const response = await authFetch(
    "http://localhost:5101/api/tour360requests",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        environmentId,
        ownerId,
      }),
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Error making POST request");
  }

  return response.json();
};

export const getTour360Requests = async (
  page = 1,
  limit = 10,
  status?: number
) => {
  try {
    const url = new URL("http://localhost:5101/api/tour360requests");
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());
    if (status) {
      url.searchParams.append("status", status.toString());
    }

    const res = await authFetch(url.toString(), {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("No se pudieron obtener las solicitudes");
    }

    const data = await res.json();
    return data;
  } catch {
    throw new Error("Error inesperado");
  }
};

export const uploadVirtualTour = async (
  environmentPublicId: string,
  scenes: Scene360[]
): Promise<void> => {
  const res = await authFetch(
    `http://localhost:5150/api/tours?environmentPublicId=${environmentPublicId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scenes }),
      credentials: "include",
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al subir el recorrido: ${errorText}`);
  }
};

export const updateTour360Status = async (
  publicId: string,
  newStatus: number
): Promise<boolean> => {
  try {
    const res = await authFetch(
      `http://localhost:5101/api/tour360requests/${publicId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      }
    );

    return res.ok;
  } catch {
    return false;
  }
};

export const getDebts = async (page = 1, limit = 20) => {
  const response = await authFetch(
    `http://localhost:5101/api/admin/debts?page=${page}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch debts");
  }
  return await response.json();
};

export const getPayments = async (page = 1, limit = 20) => {
  const response = await authFetch(
    `http://localhost:5101/api/admin/payments?page=${page}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch payments");
  }
  return await response.json();
};

export const getDebtDetails = async (debtId: string) => {
  const response = await authFetch(
    `http://localhost:5101/api/admin/debts/${debtId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch debt details");
  }
  return await response.json();
};

export const getPaymentDetails = async (paymentId: string) => {
  const response = await authFetch(
    `http://localhost:5101/api/admin/payments/${paymentId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch payment details");
  }
  return await response.json();
};
