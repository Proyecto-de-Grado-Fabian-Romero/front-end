"use client";

import { Environment } from "@/types/AllEnvironments";
import { PageRoutes } from "@/utils/constants/page-routes";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  environment: Environment;
}

const EnvironmentCard = ({ environment }: Props) => {
  const router = useRouter();

  const {
    title,
    photoUrls,
    instantBooking,
    capacity,
    pricingPolicies,
    publicId,
  } = environment;

  const searchParams = useSearchParams();

  const handleNavigate = () => {
    const params = new URLSearchParams();

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const minCapacity = searchParams.get("minCapacity");

    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (minCapacity) params.set("minCapacity", minCapacity);

    const queryString = params.toString();
    const path = `${PageRoutes.Environment_Details}/${publicId}${queryString ? `?${queryString}` : ""}`;

    router.push(path);
  };

  return (
    <div onClick={handleNavigate}>
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
    </div>
  );
};

export default EnvironmentCard;
