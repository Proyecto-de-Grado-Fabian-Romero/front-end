import { ReservationResponse } from "@/types/Reservations";
import { authFetch } from "./authFetch";
import { trackEvent } from "./logEvent";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL ?? "";
const API_ENV_BASE = process.env.NEXT_PUBLIC_API_BASE_ENVIRONMENTS_URL ?? "";

export const getPaymentSummary = async () => {
  const response = await authFetch(`${API_BASE}/api/owners/payments/summary`);
  if (!response.ok) {
    trackEvent("payment_summary_fetch_failed");
    throw new Error("Failed to fetch payment summary");
  }
  trackEvent("payment_summary_fetch_success");
  return await response.json();
};

export const getIncomeList = async (page = 1, limit = 20) => {
  const response = await authFetch(
    `${API_BASE}/api/owners/payments/income?page=${page}&limit=${limit}`,
  );
  if (!response.ok) {
    trackEvent("income_list_fetch_failed");
    throw new Error("Failed to fetch income list");
  }
  trackEvent("income_list_fetch_success");
  return await response.json();
};

export const getReceivedPayments = async (page = 1, limit = 20) => {
  const response = await authFetch(
    `${API_BASE}/api/owners/payments/received?page=${page}&limit=${limit}`,
  );
  if (!response.ok) {
    trackEvent("received_payments_fetch_failed");
    throw new Error("Failed to fetch received payments");
  }

  trackEvent("received_payments_fetch_success");
  return await response.json();
};

export const getIncomeDetails = async (id: string) => {
  const response = await authFetch(
    `${API_BASE}/api/owners/payments/income/${id}`,
  );
  if (!response.ok) {
    trackEvent("income_details_fetch_failed");
    throw new Error("Failed to fetch income details");
  }
  trackEvent("income_details_fetch_success");
  const incomeData = await response.json();

  const reservationResponse = await authFetch(
    `${API_ENV_BASE}/api/Reservations/${incomeData.reservationId}`,
  );

  if (!reservationResponse.ok) {
    trackEvent("reservation_details_fetch_failed", {
      reservationId: incomeData.reservationId,
    });
    throw new Error("Failed to fetch reservation details");
  }
  const reservationData =
    (await reservationResponse.json()) as ReservationResponse;
  trackEvent("reservation_details_fetch_success", {
    reservationId: incomeData.reservationId,
  });

  return { ...incomeData, reservation: reservationData };
};

export const getReceivedPaymentDetails = async (id: string) => {
  const response = await authFetch(
    `${API_BASE}/api/owners/payments/received/${id}`,
  );
  if (!response.ok) {
    trackEvent("received_payment_details_fetch_failed");
    throw new Error("Failed to fetch received payment details");
  }
  trackEvent("received_payment_details_fetch_success");
  return await response.json();
};
