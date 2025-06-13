import { ReservationResponse } from "./Reservations";

export type PaymentSummary = {
  totalEarnings: number;
  totalPaid: number;
  outstandingDebt: number;
};

export type IncomeDetail = {
  reservationId: string;
  amount: number;
  currency: string;
  generatedAt: number;
  reservation: ReservationResponse;
};
export type OwnerPaymentDetail = {
  id: string;
  amountPaid: number;
  currency: string;
  reference: string;
  paymentMethod: string;  
  createdAt: number;  
};
