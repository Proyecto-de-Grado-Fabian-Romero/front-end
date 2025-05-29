import { Environment } from "@/types/GetEnvironment";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";
import DiscountsDisplay from "./DiscountDisplay";

interface EnvironmentPreviewDisplayProps {
  data: Environment;
}

const EnvironmentPreviewDisplay: React.FC<EnvironmentPreviewDisplayProps> = ({
  data,
}) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        mb: 4,
      }}
    >
      <CardMedia
        component="img"
        image={data.photos[0]?.url || "/no-image.jpg"}
        alt={data.title}
        sx={{
          width: { xs: "100%", sm: 240 },
          height: "auto",
          objectFit: "cover",
          aspectRatio: "4 / 3",
        }}
      />
      <CardContent>
        <Typography variant="h6">{data.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {data.description.substring(0, 100)}...
        </Typography>
        <br />
        <Typography variant="body1" color="text.secondary">
          👥 {data.capacity} asistentes
        </Typography>
        <br />
        <Typography variant="subtitle2" fontWeight="bold">
          Desde {data.pricingPolicies[0]?.currency}{" "}
          {data.pricingPolicies[0]?.basePrice} por{" "}
          {data.rentalUnit.toLowerCase().slice(0, -1)}
        </Typography>
        <DiscountsDisplay
          policies={data.discountPolicies}
          isHospedaje={data.type.publicKey === "hospedajes"}
        />
      </CardContent>
    </Card>
  );
};

export default EnvironmentPreviewDisplay;
