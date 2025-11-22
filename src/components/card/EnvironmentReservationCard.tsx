import { ReservationResponse } from "@/types/Reservations";
import { PageRoutes } from "@/utils/constants/page-routes";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

interface EnvironmentReservationCardProps {
  reservation: ReservationResponse;
}

const EnvironmentReservationCard: React.FC<EnvironmentReservationCardProps> = ({
  reservation,
}) => {
  return (
    <Link
      href={`${PageRoutes.Environment_Details}/${reservation.environmentPublicId}`}
    >
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
    </Link>
  );
};

export default EnvironmentReservationCard;
