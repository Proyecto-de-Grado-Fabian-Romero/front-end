import React from "react";
import {
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListSubheader,
  Divider,
} from "@mui/material";
import moment from "moment";
import { ReservationResponse } from "@/types/Reservations";

type Props = {
  reservations: ReservationResponse[];
};

const getStatusChip = (status: string) => {
  switch (status) {
    case "pending":
      return <Chip label="Pendiente a confirmar" color="warning" />;
    case "confirmed":
      return <Chip label="Por pagar" color="info" />;
    case "paid":
      return <Chip label="Confirmado" color="success" />;
    case "rejected":
      return <Chip label="Rechazado" color="error" />;
    case "cancelled":
      return <Chip label="Cancelado" color="default" />;
    default:
      return <Chip label="Desconocido" />;
  }
};

const groupReservations = (reservations: ReservationResponse[]) => {
  const grouped: Record<string, Record<string, ReservationResponse[]>> = {};

  for (const res of reservations) {
    for (const range of res.timeRanges) {
      const date = moment(range.startDate).format("YYYY-MM-DD");
      const env = res.environmentTitle;

      if (!grouped[date]) grouped[date] = {};
      if (!grouped[date][env]) grouped[date][env] = [];

      grouped[date][env].push({ ...res, timeRange: range });
    }
  }

  return grouped;
};

const ReservationList: React.FC<Props> = ({ reservations }) => {
  if (!reservations.length) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>No tienes reservas en esta sección.</Typography>
      </Box>
    );
  }

  const grouped = groupReservations(reservations);
  const sortedDates = Object.keys(grouped).sort();

  return (
    <Box>
      {sortedDates.map((date) => (
        <Box key={date} mb={4}>
          <Typography variant="h6" gutterBottom>
            📅 {moment(date).format("DD MMMM YYYY")}
          </Typography>

          {Object.entries(grouped[date]).map(([envTitle, reservas]) => (
            <Box key={envTitle} mb={2} pl={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                🏠 {envTitle}
              </Typography>
              <List dense>
                {reservas.map((res) => {
                  const start = moment(res.timeRange.startDate);
                  const end = moment(res.timeRange.endDate);
                  const isHospedaje = res.rentalUnit === "Días";
                  const range = isHospedaje
                    ? `${start.format("DD MMM")} → ${end.format("DD MMM")}`
                    : `${start.format("HH:mm")} → ${end.format("HH:mm")}`;

                  return (
                    <ListItem
                      key={`${res.publicId}-${res.timeRange.startDate}`}
                    >
                      <Box width="100%">
                        <Typography variant="body2">
                          ⏰ {range} —{" "}
                          <b>
                            {res.currency} {res.totalPrice.toFixed(2)}
                          </b>
                        </Typography>
                        <Box mt={0.5}>{getStatusChip(res.status)}</Box>
                      </Box>
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
