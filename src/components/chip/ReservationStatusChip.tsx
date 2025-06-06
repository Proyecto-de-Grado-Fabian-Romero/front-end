import { Chip } from "@mui/material";
import moment from "moment";
import { type ReservationResponse } from "@/types/Reservations";

type Props = {
  reservation: ReservationResponse;
};

const getLatestEndDate = (reservation: ReservationResponse): number => {
  return Math.max(...reservation.timeRanges.map((r) => r.endDate));
};

const ReservationStatusChip: React.FC<Props> = ({ reservation }) => {
  const now = moment().valueOf();
  const latestEnd = getLatestEndDate(reservation);
  const isExpired = reservation.status === "pending" && latestEnd < now;

  const statusLabel = isExpired
    ? "Vencida"
    : {
        confirmed: "Por pagar",
        paid: "Confirmado",
        pending: "Pendiente a confirmar",
        rejected: "Rechazado",
        cancelled: "Cancelado",
      }[reservation.status] || "Desconocido";

  return <Chip label={statusLabel} color={"warning"} sx={{ mt: 2 }} />;
};

export default ReservationStatusChip;
