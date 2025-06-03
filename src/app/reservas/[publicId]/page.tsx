import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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

const getLatestEndDate = (reservation: ReservationResponse | null): number => {
  return reservation
    ? Math.max(...reservation.timeRanges.map((r) => r.endDate))
    : 0;
};

const ReservationDetailPage = () => {
  const router = useRouter();
  const { publicId } = router.query;

  const [reservation, setReservation] = useState<ReservationResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const userId = useSelector((state: RootState) => state.user.publicId);

  const now = moment().valueOf();
  const latestEnd = getLatestEndDate(reservation);
  const isExpired = reservation?.status === "pending" && latestEnd < now;

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        if (!publicId || typeof publicId !== "string") return;

        const res = await getReservationById(publicId);

        if (res.ownerId !== userId && res.renterId !== userId) {
          router.push(PageRoutes.Home);
          return;
        }

        setReservation(res);
      } catch (err) {
        router.push(PageRoutes.Home);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [publicId, userId, router]);

  const handleStatusChange = async (newStatus: "confirmed" | "rejected") => {
    if (!reservation) return;
    setUpdatingStatus(true);
    try {
      if (newStatus !== "confirmed") {
        await updateReservationStatus(reservation.publicId, newStatus);
      } else {
        const start = Math.min(
          ...reservation.timeRanges.map((r) => r.startDate)
        );
        const end = Math.max(...reservation.timeRanges.map((r) => r.endDate));

        const conflicts = await checkReservationConflicts(
          reservation.environmentId,
          start,
          end
        );

        if (conflicts) {
          setShowDialog(true);
        } else {
          await updateReservationStatus(reservation.publicId, "confirmed");
        }
      }
      setSuccessMessage(
        `Reserva ${newStatus === "confirmed" ? "confirmada" : "rechazada"} correctamente`
      );
      setReservation({ ...reservation, status: newStatus });
    } catch (err) {
      alert("Error al actualizar estado de la reserva");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading || !reservation) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  const isOwner = reservation.ownerId === userId;

  return (
    <Box mt={4} px={2}>
      <Typography variant="h5" gutterBottom>
        Detalle de Reserva
      </Typography>

      <EnvironmentReservationCard reservation={reservation} />

      <Typography>
        {reservation.timeRanges.map((r) => {
          const start = moment(r.startDate);
          const end = moment(r.endDate);
          const isHospedaje = reservation.rentalUnit === "Días";

          return isHospedaje
            ? `${start.format("DD MMM")} → ${end.format("DD MMM")}`
            : `${start.format("DD MMM HH:mm")} → ${end.format("HH:mm")}`;
        })}
      </Typography>

      <Typography sx={{ mt: 1 }}>
        Total:{" "}
        <b>
          {reservation.currency} {reservation.totalPrice.toFixed(2)}
        </b>
      </Typography>

      <ReservationStatusChip reservation={reservation} />

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
  );
};

export default ReservationDetailPage;
