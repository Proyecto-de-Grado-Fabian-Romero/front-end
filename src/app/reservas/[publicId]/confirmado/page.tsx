"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CircularProgress, Typography, Box, Button } from "@mui/material";
import { checkPaymentStatus } from "@/services/paymentService";
import CenteredLayout from "@/components/layouts/CenteredLayout";
import { updateReservationStatus } from "@/services/reservationService";

export default function ConfirmacionReservaPage() {
  const { publicId } = useParams<{ publicId: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<
    "loading" | "paid" | "pending" | "error"
  >("loading");

  useEffect(() => {
    async function checkPayment() {
      try {
        const result = await checkPaymentStatus(publicId);
        setStatus(result.status);
      } catch {
        setStatus("error");
      }
    }

    checkPayment();
  }, [publicId]);

  const executedRef = useRef(false);

  useEffect(() => {
    if (executedRef.current) return;
    executedRef.current = true;

    updateReservationStatus(publicId, "paid");

    // getReservationById(publicId).then(({ ownerId, totalPrice }) => {
    //   console.log({ ownerId, reservationId: publicId, totalPrice });
    //   registerOwnerEarning({
    //     ownerId,
    //     reservationId: publicId,
    //     amount: totalPrice,
    //     currency: 0,
    //     generatedAt: Date.now(),
    //   }).catch(console.error);
    // });
  }, [publicId]);

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
        <Typography ml={2}>Confirmando tu pago...</Typography>
      </Box>
    );
  }

  if (status === "paid") {
    return (
      <CenteredLayout>
        <Box textAlign="center" mt={10}>
          <Typography variant="h5" color="success">
            ¡Pago confirmado con éxito!
          </Typography>

          <Button
            sx={{ mt: 2 }}
            variant="outlined"
            onClick={() => router.push("/reservas")}
          >
            Volver a mis reservas
          </Button>
        </Box>
      </CenteredLayout>
    );
  }

  if (status === "pending") {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6" color="warning.main">
          El pago aún está pendiente ⏳
        </Typography>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => router.refresh()}
        >
          Reintentar Confirmación
        </Button>
      </Box>
    );
  }

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h6" color="error">
        Hubo un error al confirmar tu pago ❌
      </Typography>
      <Button
        sx={{ mt: 2 }}
        variant="outlined"
        onClick={() => router.push("/reservas")}
      >
        Volver a mis reservas
      </Button>
    </Box>
  );
}
