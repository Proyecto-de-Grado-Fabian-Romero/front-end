"use client";

import { Environment } from "@/types/AllEnvironments";
import { CLASS_ID_TO_NAME } from "@/utils/constants/class-names";
import { PageRoutes } from "@/utils/constants/page-routes";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

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

  const userEquipmentFilter = useMemo(() => {
    const filters: string[] = [];
    searchParams.forEach((value, key) => {
      if (key.startsWith("equipment_")) {
        filters.push(key.replace("equipment_", ""));
      }
    });
    return filters;
  }, [searchParams]);

  const equipmentChips = useMemo(() => {
    if (!environment.equipment) return [];

    let equipmentDict: Record<string, number> = {};

    try {
      equipmentDict = JSON.parse(environment.equipment);
    } catch {
      return [];
    }

    return Object.entries(equipmentDict)
      .filter(([, qty]) => qty > 0)
      .sort((a, b) => {
        const [aId, aQty] = a;
        const [bId, bQty] = b;

        const aIsFiltered = userEquipmentFilter.includes(aId) ? 0 : 1;
        const bIsFiltered = userEquipmentFilter.includes(bId) ? 0 : 1;

        if (aIsFiltered !== bIsFiltered) return aIsFiltered - bIsFiltered;
        return (bQty as number) - (aQty as number);
      });
  }, [environment.equipment, userEquipmentFilter]);

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
            👥 Máx: {capacity} asistentes
          </Typography>
          {equipmentChips.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
              {equipmentChips.map(([id, qty]) => (
                <Chip
                  key={id}
                  label={`${CLASS_ID_TO_NAME[id] || id} (${qty})`}
                  size="small"
                  color={
                    userEquipmentFilter.includes(id) ? "primary" : "default"
                  }
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentCard;
