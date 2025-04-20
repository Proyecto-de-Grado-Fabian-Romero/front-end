"use client";

import { Environment } from "@/types/AllEnvironments";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

interface Props {
  environment: Environment;
}

const EnvironmentCard = ({ environment }: Props) => {
  const { title, photoUrls, instantBooking, capacity, pricingPolicies } =
    environment;

  return (
    <Card sx={{ borderRadius: 2, cursor: "pointer", height: "100%" }}>
      <CardMedia
        component="img"
        height="180"
        image={photoUrls[0]}
        alt={title}
      />
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          {instantBooking ? "⚡ Reserva Instantánea" : ""}
        </Typography>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Bs. {pricingPolicies[0]?.basePrice} por{" "}
          {pricingPolicies[0]?.priceUnit.toLowerCase()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          👥 {capacity} asistentes
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EnvironmentCard;
