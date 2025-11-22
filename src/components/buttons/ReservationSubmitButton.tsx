"use client";

import React, { useState } from "react";
import { Button, Alert, Box } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/navigation";
import {
  createReservation,
  updateReservationStatus,
} from "@/services/reservationService";
import { createPayment } from "@/services/paymentService";
import { PageRoutes } from "@/utils/constants/page-routes";
import { ScheduleBlock } from "@/types/Booking";
import { Environment } from "@/types/GetEnvironment";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PaymentModal from "@/components/modal/PaymentModal";

interface Props {
  environment: Environment;
  isHospedaje: boolean;
  dateRange: [moment.Moment | null, moment.Moment | null];
  scheduleBlocks: ScheduleBlock[];
  calculatedPrice: number;
  peopleQuantity: number;
}

const ReservationSubmitButton: React.FC<Props> = ({
  environment,
  isHospedaje,
  dateRange,
  scheduleBlocks,
  calculatedPrice,
  peopleQuantity,
}) => {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.user);

  // State para el modal de pago
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState("");
  const [paymentFailed, setPaymentFailed] = useState(false);

  const handleSubmit = async () => {
    try {
      const environmentId = environment.publicId;

      const timeRanges = isHospedaje
        ? dateRange[0] && dateRange[1]
          ? [
              {
                startDate: Math.floor(dateRange[0]?.valueOf() / 1000),
                endDate: Math.floor(dateRange[1]?.valueOf() / 1000),
              },
            ]
          : []
        : scheduleBlocks
            .filter((b) => b.date && b.start && b.end)
            .map((b) => ({
              startDate: Math.floor(
                moment(b.date)
                  .set({
                    hour: b.start!.hour(),
                    minute: b.start!.minute(),
                  })
                  .valueOf() / 1000,
              ),
              endDate: Math.floor(
                moment(b.date)
                  .set({
                    hour: b.end!.hour(),
                    minute: b.end!.minute(),
                  })
                  .valueOf() / 1000,
              ),
            }));

      if (!timeRanges.length) {
        alert("Debes seleccionar al menos un rango de tiempo válido.");
        return;
      }

      setLoading(true);

      const reservation = await createReservation({
        environmentId,
        timeRanges,
        totalPrice: calculatedPrice,
        peopleQuantity,
        currency: "Bs.",
      });

      setReservationId(reservation.publicId);

      if (environment.instantBooking) {
        const paymentDto = {
          reservationId: reservation.publicId,
          clientEmail: user.email!,
          clientFullName: user.name!,
          clientCI: user.phone || "0",
          clientNIT: "0",
        };

        const fechaVencimiento = moment()
          .utcOffset(-4)
          .add(16, "minutes")
          .format("YYYY-MM-DD HH:mm");

        const { url } = await createPayment(paymentDto, fechaVencimiento);

        setPaymentUrl(url);
        setPaymentModalOpen(true);
        setPaymentFailed(false);

        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(PageRoutes.Booking);
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al realizar la reserva, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      router.push(PageRoutes.Booking);
    }, 2000);
  };

  const handlePaymentFailure = async () => {
    setPaymentFailed(true);
    // Cancelar la reserva si el pago falla
    if (reservationId) {
      await updateReservationStatus(reservationId, "cancelled");
    }
  };

  const handleClosePaymentModal = () => {
    setPaymentModalOpen(false);
    setPaymentUrl(null);
  };

  return (
    <Box mt={2} mb={8}>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ¡Reserva realizada correctamente! Serás redirigido en unos segundos...
        </Alert>
      )}

      {paymentFailed && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Pago fallido — intenta de nuevo.
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={loading || success}
      >
        {environment.instantBooking ? "RESERVAR Y PAGAR" : "SOLICITAR RESERVA"}
      </Button>

      <PaymentModal
        open={paymentModalOpen}
        paymentUrl={paymentUrl}
        reservationId={reservationId}
        environmentPublicId={environment.publicId}
        onClose={handleClosePaymentModal}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />
    </Box>
  );
};

export default ReservationSubmitButton;
