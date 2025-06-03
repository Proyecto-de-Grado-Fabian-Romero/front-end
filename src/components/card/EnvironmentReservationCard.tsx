import { ReservationResponse } from "@/types/Reservations";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import React from "react";

interface EnvironmentReservationCardProps {
  reservation: ReservationResponse;
}

const EnvironmentReservationCard: React.FC<EnvironmentReservationCardProps> = ({
  reservation,
}) => {
  return (
    <Card
      sx={{
        display: "flex",
        mb: 2,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <CardMedia
        component="img"
        sx={{ width: 120 }}
        image={reservation.environmentPhotoUrl}
        alt={reservation.environmentTitle}
      />
      <CardContent sx={{ flex: "1 0 auto" }}>
        <Typography variant="h6">{reservation.environmentTitle}</Typography>
      </CardContent>
    </Card>
  );
};

export default EnvironmentReservationCard;
