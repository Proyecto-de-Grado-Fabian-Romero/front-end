"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ReservationResponse } from "@/types/Reservations";
import {
  CircularProgress,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  Alert as MuiAlert,
} from "@mui/material";
import moment from "moment";
import {
  checkReservationConflicts,
  getReservationById,
  updateReservationStatus,
} from "@/services/reservationService";
import { PageRoutes } from "@/utils/constants/page-routes";
import ConfirmReservationDialog from "@/components/modal/ConfirmReservationDialog";
import EnvironmentReservationCard from "@/components/card/EnvironmentReservationCard";
import ReservationStatusChip from "@/components/chip/ReservationStatusChip";
import CenteredLayout from "@/components/layouts/CenteredLayout";
import UserPreviewCard from "@/components/card/UserPreviewCard";
import { createPayment } from "@/services/paymentService";
import PaymentModal from "@/components/modal/PaymentModal";

const getLatestEndDate = (reservation: ReservationResponse | null): number => {
  return reservation
    ? Math.max(...reservation.timeRanges.map((r) => r.endDate))
    : 0;
};

const ReservationDetailPage = () => {
  const router = useRouter();
  const { publicId } = useParams();

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user.role) router.replace(`/`);
  }, [router, user.role]);

  const [reservation, setReservation] = useState<ReservationResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const now = moment().valueOf();
  const latestEnd = getLatestEndDate(reservation) * 1000;
  const isExpired = reservation?.status === "pending" && latestEnd < now;

  // Calcular fecha límite de pago
  const calculatePaymentDeadline = (
    reservation: ReservationResponse,
  ): { deadline: number; message: string } => {
    const earliestStart = Math.min(
      ...reservation.timeRanges.map((r) => r.startDate),
    );

    if (reservation.isInstant) {
      // Instantáneas: 15 minutos desde createdDate (timestamp en segundos, timezone -4)
      const createdDate = moment(reservation.createdAt * 1000); // Convertir a ms
      const deadline = createdDate.add(15, "minutes").valueOf();
      return {
        deadline,
        message: `Tienes hasta ${moment(deadline).format("DD/MM/YYYY HH:mm")} para pagar (15 minutos desde la creación)`,
      };
    } else {
      // No instantáneas: 12 horas desde confirmedAt (timestamp en segundos, timezone -4)
      // O hasta 30 minutos antes del start time (lo que ocurra primero)

      // Si no hay confirmedAt, usar createdAt como fallback
      const confirmedDate = reservation.confirmedAt
        ? moment(reservation.confirmedAt * 1000)
        : moment(reservation.createdAt * 1000);

      const twelveHoursFromConfirmed = confirmedDate.clone().add(12, "hours");
      const thirtyMinutesBeforeStart = moment(earliestStart * 1000).subtract(
        30,
        "minutes",
      );

      // Usar el tiempo más cercano (lo que ocurra primero)
      const deadline = moment
        .min(twelveHoursFromConfirmed, thirtyMinutesBeforeStart)
        .valueOf();

      // Determinar qué límite se está aplicando para el mensaje
      let timeMessage = "";
      if (twelveHoursFromConfirmed.isBefore(thirtyMinutesBeforeStart)) {
        timeMessage = "12 horas desde la confirmación";
      } else {
        timeMessage = "30 minutos antes del inicio";
      }

      return {
        deadline,
        message: `Tienes hasta ${moment(deadline).format("DD/MM/YYYY HH:mm")} para pagar (${timeMessage})`,
      };
    }
  };

  // Verificar si puede pagar
  const canPay = (
    reservation: ReservationResponse,
  ): { canPay: boolean; reason?: string } => {
    if (reservation.status === "paid") {
      return { canPay: false, reason: "Ya está pagada" };
    }

    if (
      reservation.status === "cancelled" ||
      reservation.status === "rejected"
    ) {
      return { canPay: false, reason: "Reserva cancelada/rechazada" };
    }

    if (reservation.isInstant) {
      // Instantáneas: solo si es confirmed y no han pasado 15 minutos desde createdDate
      if (reservation.status !== "confirmed") {
        return { canPay: false, reason: "Debe estar confirmada para pagar" };
      }

      const createdDate = moment(reservation.createdAt * 1000); // Convertir a ms
      const fifteenMinutesAgo = moment().subtract(15, "minutes");

      if (createdDate.isBefore(fifteenMinutesAgo)) {
        return {
          canPay: false,
          reason: "Tiempo de pago expirado (15 minutos desde la creación)",
        };
      }

      return { canPay: true };
    } else {
      // No instantáneas: si es confirmed y está dentro del tiempo de pago desde confirmedDate
      if (reservation.status !== "confirmed") {
        return { canPay: false, reason: "Debe estar confirmada para pagar" };
      }

      const { deadline } = calculatePaymentDeadline(reservation);
      if (now > deadline) {
        return { canPay: false, reason: "Tiempo de pago expirado" };
      }

      return { canPay: true };
    }
  };

  // Verificar si está expirada (para instantáneas no pagadas después de 15 min)
  const isEffectivelyCancelled = (
    reservation: ReservationResponse,
  ): boolean => {
    if (reservation.isInstant && reservation.status === "confirmed") {
      const createdDate = moment(reservation.createdAt * 1000);
      const fifteenMinutesAgo = moment().subtract(15, "minutes");
      return createdDate.isBefore(fifteenMinutesAgo);
    }
    return false;
  };

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        if (!publicId || typeof publicId !== "string") return;

        const res = await getReservationById(publicId);

        if (res.ownerId !== user.publicId && res.renterId !== user.publicId) {
          router.push(PageRoutes.Home);
          return;
        }

        setReservation(res);
      } catch {
        router.push(PageRoutes.Home);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [publicId, user.publicId, router]);

  const handleStatusChange = async (newStatus: "confirmed" | "rejected") => {
    if (!reservation) return;
    setUpdatingStatus(true);
    try {
      if (newStatus !== "confirmed") {
        await updateReservationStatus(reservation.publicId, newStatus);
      } else {
        const start = Math.min(
          ...reservation.timeRanges.map((r) => r.startDate),
        );
        const end = Math.max(...reservation.timeRanges.map((r) => r.endDate));

        const conflicts = await checkReservationConflicts(
          reservation.environmentId,
          start,
          end,
        );

        if (conflicts) {
          setShowDialog(true);
        } else {
          await updateReservationStatus(reservation.publicId, "confirmed");
        }
      }
      setSuccessMessage(
        `Reserva ${newStatus === "confirmed" ? "confirmada" : "rechazada"} correctamente`,
      );
      setReservation({ ...reservation, status: newStatus });
    } catch {
      alert("Error al actualizar estado de la reserva");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePayment = async () => {
    if (!reservation) return;

    setProcessingPayment(true);
    try {
      const { deadline } = calculatePaymentDeadline(reservation);
      const fechaVencimiento = moment(deadline).format("YYYY-MM-DD HH:mm");

      const paymentData = {
        reservationId: reservation.publicId,
        amount: reservation.totalPrice,
        currency: reservation.currency,
        clientEmail: user.email!,
        clientFullName: user.name!,
        clientCI: user.phone || "0",
        clientNIT: "0",
      };

      const paymentResponse = await createPayment(
        paymentData,
        fechaVencimiento,
      );

      setPaymentUrl(paymentResponse.url);
      setPaymentModalOpen(true);
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Error al procesar el pago, intenta de nuevo");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading || !reservation) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  const isOwner = reservation.ownerId === user.publicId;
  const isRenter = reservation.renterId === user.publicId;
  const paymentInfo = canPay(reservation);
  const effectivelyCancelled = isEffectivelyCancelled(reservation);
  const { message } = calculatePaymentDeadline(reservation);

  return (
    <CenteredLayout>
      <Box mt={4} px={2} pt={4}>
        <Typography variant="h5" gutterBottom mt={1} mb={4}>
          Detalle de Reserva
        </Typography>

        {/* Alertas de estado de pago */}
        {isRenter && (
          <>
            {/* Reserva pagada */}
            {reservation.status === "paid" && (
              <MuiAlert severity="success" sx={{ mb: 3 }}>
                <strong>Reserva pagada</strong> - Tu reserva ha sido pagada
                exitosamente.
              </MuiAlert>
            )}

            {reservation.status === "confirmed" && paymentInfo.canPay && (
              <MuiAlert severity="warning" sx={{ mb: 3 }}>
                <strong>Pendiente de pago</strong> - {message}
              </MuiAlert>
            )}

            {reservation.status === "confirmed" && !paymentInfo.canPay && (
              <MuiAlert severity="error" sx={{ mb: 3 }}>
                <strong>No se puede pagar</strong> - {paymentInfo.reason}
              </MuiAlert>
            )}

            {effectivelyCancelled && (
              <MuiAlert severity="error" sx={{ mb: 3 }}>
                <strong>Reserva expirada</strong> - Esta reserva instantánea no
                fue pagada dentro del tiempo límite (15 minutos) y está
                efectivamente cancelada.
              </MuiAlert>
            )}
          </>
        )}

        <EnvironmentReservationCard reservation={reservation} />

        <UserPreviewCard
          publicId={isOwner ? reservation.renterId : reservation.ownerId}
        />

        <br />

        <Typography variant="subtitle2">
          {reservation.timeRanges.map((r) => {
            const start = moment(r.startDate);
            const end = moment(r.endDate);
            const isHospedaje = reservation.rentalUnit === "Días";

            return isHospedaje
              ? `${start.format("DD MMM")} → ${end.format("DD MMM")}`
              : `${start.format("DD MMM HH:mm")} → ${end.format("HH:mm")}`;
          })}
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 1 }}>
          Cantidad de Personas: {reservation.peopleQuantity}
        </Typography>

        <Typography sx={{ mt: 1 }} variant="subtitle1">
          Total:{" "}
          <b>
            {reservation.currency} {reservation.totalPrice.toFixed(2)}
          </b>
        </Typography>

        <ReservationStatusChip reservation={reservation} />

        {/* Botón de pago para el renter cuando puede pagar */}
        {isRenter && paymentInfo.canPay && (
          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePayment}
              disabled={processingPayment}
              size="large"
            >
              {processingPayment ? "Procesando..." : "Completar Pago"}
            </Button>
          </Box>
        )}

        <ConfirmReservationDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          onConfirm={async () => {
            setShowDialog(false);
            await updateReservationStatus(reservation.publicId, "confirmed");
          }}
        />

        {isOwner && reservation.status === "pending" && !isExpired && (
          <Box mt={3}>
            <Button
              variant="contained"
              color="success"
              sx={{ mr: 1 }}
              onClick={() => handleStatusChange("confirmed")}
              disabled={updatingStatus}
            >
              {updatingStatus ? "Actualizando..." : "Confirmar"}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleStatusChange("rejected")}
              disabled={updatingStatus}
            >
              {updatingStatus ? "Actualizando..." : "Rechazar"}
            </Button>
          </Box>
        )}

        <PaymentModal
          open={paymentModalOpen}
          paymentUrl={paymentUrl}
          reservationId={reservation.publicId}
          environmentPublicId={reservation.environmentPublicId}
          onClose={() => setPaymentModalOpen(false)}
          onPaymentSuccess={() => {
            setPaymentModalOpen(false);
            setReservation({ ...reservation, status: "paid" });
            setSuccessMessage("Pago realizado correctamente");
          }}
          onPaymentFailure={() => {
            setPaymentModalOpen(false);
            alert("El pago no pudo ser procesado");
          }}
        />

        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </CenteredLayout>
  );
};

export default ReservationDetailPage;
