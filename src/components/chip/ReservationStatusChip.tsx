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

  const statusColorMap: Record<
    string,
    "default" | "info" | "success" | "warning" | "error"
  > = {
    confirmed: "info",
    paid: "success",
    pending: "warning",
    rejected: "error",
    cancelled: "error",
  };

  const color: "default" | "info" | "success" | "warning" | "error" = isExpired
    ? "default"
    : statusColorMap[reservation.status] || "default";

  return <Chip label={statusLabel} color={color} sx={{ mt: 2 }} />;
};

export default ReservationStatusChip;
