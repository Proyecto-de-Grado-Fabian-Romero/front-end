"use client";

import { useState } from "react";
import { Button, Alert, Box } from "@mui/material";
import moment, { Moment } from "moment";
import { useRouter } from "next/navigation";
import { createReservation } from "@/services/reservationService";
import { PageRoutes } from "@/utils/constants/page-routes";
import { ScheduleBlock } from "@/types/Booking";
import { Environment } from "@/types/GetEnvironment";

interface Props {
  environment: Environment;
  isHospedaje: boolean;
  dateRange: [Moment | null, Moment | null];
  scheduleBlocks: ScheduleBlock[];
  calculatedPrice: number;
}

const ReservationSubmitButton: React.FC<Props> = ({
  environment,
  isHospedaje,
  dateRange,
  scheduleBlocks,
  calculatedPrice,
}) => {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const environmentId = environment.publicId;

      const timeRanges = isHospedaje
        ? dateRange[0] && dateRange[1]
          ? [
              {
                startDate: dateRange[0].valueOf(),
                endDate: dateRange[1].valueOf(),
              },
            ]
          : []
        : scheduleBlocks
            .filter((b) => b.date && b.start && b.end)
            .map((b) => ({
              startDate: moment(b.date)
                .set({
                  hour: b.start!.hour(),
                  minute: b.start!.minute(),
                })
                .valueOf(),
              endDate: moment(b.date)
                .set({
                  hour: b.end!.hour(),
                  minute: b.end!.minute(),
                })
                .valueOf(),
            }));

      if (!timeRanges.length) {
        alert("Debes seleccionar al menos un rango de tiempo válido.");
        return;
      }

      setLoading(true);
      await createReservation({
        environmentId,
        timeRanges,
        totalPrice: calculatedPrice,
        currency: "Bs.",
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(PageRoutes.Booking);
      }, 3000);
    } catch {
      alert("Ocurrió un error al realizar la reserva, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={2} mb={8}>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ¡Reserva realizada correctamente! Serás redirigido en unos segundos...
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={loading || success}
      >
        {environment.instantBooking ? "RESERVAR" : "SOLICITAR RESERVA"}
      </Button>
    </Box>
  );
};

export default ReservationSubmitButton;
