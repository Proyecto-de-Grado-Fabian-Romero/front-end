import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ReservationResponse } from "@/types/Reservations";
import { CircularProgress, Box, Typography, Chip, Button } from "@mui/material";
import moment from "moment";
import { getReservationById } from "@/services/reservationService";
import { PageRoutes } from "@/utils/constants/page-routes";

const ReservationDetailPage = () => {
  const router = useRouter();
  const { publicId } = router.query;

  const [reservation, setReservation] = useState<ReservationResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const userId = useSelector((state: RootState) => state.user.publicId);

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

      <Typography variant="h6">{reservation.environmentTitle}</Typography>

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

      <Chip
        label={reservation.status}
        color={
          reservation.status === "confirmed"
            ? "info"
            : reservation.status === "paid"
              ? "success"
              : reservation.status === "pending"
                ? "warning"
                : reservation.status === "rejected"
                  ? "error"
                  : "default"
        }
        sx={{ mt: 2 }}
      />

      {isOwner && reservation.status === "pending" && (
        <Box mt={3}>
          <Button variant="contained" color="success" sx={{ mr: 1 }}>
            Confirmar
          </Button>
          <Button variant="outlined" color="error">
            Rechazar
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ReservationDetailPage;
