import React from "react";
import {
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  Divider,
  ListItemButton,
} from "@mui/material";
import moment from "moment";
import { type ReservationResponse } from "@/types/Reservations";
import { useRouter } from "next/navigation";
import { PageRoutes } from "@/utils/constants/page-routes";

type Props = {
  reservations: ReservationResponse[];
};

const getStatusChip = (
  status: ReservationResponse["status"],
  isExpired: boolean,
) => {
  const labelMap: Record<ReservationResponse["status"], string> = {
    pending: isExpired ? "Vencida" : "Pendiente a confirmar",
    confirmed: "Por pagar",
    paid: "Confirmado",
    rejected: "Rechazado",
    cancelled: "Cancelado",
  };

  const colorMap: Record<
    ReservationResponse["status"],
    "default" | "info" | "success" | "warning" | "error"
  > = {
    pending: isExpired ? "default" : "warning",
    confirmed: "info",
    paid: "success",
    rejected: "error",
    cancelled: "error",
  };

  return <Chip label={labelMap[status]} color={colorMap[status]} />;
};

const groupReservations = (reservations: ReservationResponse[]) => {
  const grouped: Record<string, Record<string, ReservationResponse>> = {};

  for (const res of reservations) {
    for (const range of res.timeRanges) {
      const date = moment(range.startDate).format("YYYY-MM-DD");
      const env = res.environmentTitle;

      if (!grouped[date]) grouped[date] = {};
      if (!grouped[date][env]) grouped[date][env] = { ...res, timeRanges: [] };

      grouped[date][env].timeRanges.push(range);
    }
  }

  return grouped;
};

const ReservationList: React.FC<Props> = ({ reservations }) => {
  const router = useRouter();

  if (!reservations.length) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>No tienes reservas en esta sección.</Typography>
      </Box>
    );
  }

  const grouped = groupReservations(reservations);
  const sortedDates = Object.keys(grouped).sort();
  const now = Date.now();

  return (
    <Box>
      {sortedDates.map((date) => (
        <Box key={date} mb={4}>
          <Typography variant="h6" gutterBottom>
            🗕️ {moment(date).format("DD MMMM YYYY")}
          </Typography>

          {Object.entries(grouped[date]).map(([envTitle, res]) => (
            <Box key={envTitle} mb={2} pl={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                🏠 {envTitle}
              </Typography>
              <List dense>
                {res.timeRanges.map((range, index) => {
                  const start = moment(range.startDate);
                  const end = moment(range.endDate);
                  const isHospedaje = res.rentalUnit === "Días";
                  const rangeText = isHospedaje
                    ? `${start.format("DD MMM")} → ${end.format("DD MMM")}`
                    : `${start.format("HH:mm")} → ${end.format("HH:mm")}`;

                  const isExpired = end.valueOf() < now;

                  return (
                    <ListItem
                      key={`${res.publicId}-${range.startDate}-${index}`}
                      disablePadding
                    >
                      <ListItemButton
                        onClick={() =>
                          router.push(`${PageRoutes.Booking}/${res.publicId}`)
                        }
                      >
                        <Box width="100%" px={1}>
                          <Typography variant="body2">
                            ⏰ {rangeText} —{" "}
                            <b>
                              {res.currency} {res.totalPrice.toFixed(2)}
                            </b>
                          </Typography>
                          <Box mt={0.5}>
                            {getStatusChip(res.status, isExpired)}
                          </Box>
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
              <Divider />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default ReservationList;
