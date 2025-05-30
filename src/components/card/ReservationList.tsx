import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
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

const ReservationList: React.FC<Props> = ({ reservations }) => {
  if (!reservations.length) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>No tienes reservas en esta sección.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {reservations.map((res) => (
        <Card key={res.publicId} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 3 }}>
                <Avatar
                  variant="rounded"
                  src={res.environmentPhotoUrl}
                  sx={{ width: "100%", height: 80 }}
                />
              </Grid>
              <Grid size={{ xs: 9 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {res.environmentTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  {res.timeRanges
                    .map((range) => {
                      const start = moment(range.startDate);
                      const end = moment(range.endDate);
                      const isHospedaje = res.rentalUnit === "Días";

                      if (isHospedaje) {
                        return `${start.format("DD MMM")} → ${end.format("DD MMM")}`;
                      } else {
                        return `${start.format("DD MMM HH:mm")} → ${end.format("HH:mm")}`;
                      }
                    })
                    .join(" / ")}
                </Typography>

                <Typography mt={0.5}>
                  Total:{" "}
                  <b>
                    {res.currency} {res.totalPrice.toFixed(2)}
                  </b>
                </Typography>
                <Box mt={1}>{getStatusChip(res.status)}</Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ReservationList;
