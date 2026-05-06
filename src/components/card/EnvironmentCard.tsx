"use client";

import { Environment } from "@/types/AllEnvironments";
import { CLASS_ID_TO_NAME, OBJECT_ICONS } from "@/utils/constants/class-names";
import { PageRoutes } from "@/utils/constants/page-routes";
import { VisibilityOff, Vrpano } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Tooltip,
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
    searchParams.forEach((_value, key) => {
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
      <Box sx={{ position: "relative", borderRadius: 2, overflow: "hidden" }}>
        {environment.tour360Id && (
          <Chip
            icon={<Vrpano fontSize="small" color="primary" />}
            label="Recorrido 360°"
            color="success"
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              zIndex: 1,
              fontWeight: 600,
              fontSize: 11,
              backdropFilter: "blur(4px)",
              color: "black",
            }}
          />
        )}
        <Card
          sx={{
            borderRadius: 2,
            cursor: "pointer",
            height: "100%",
            background: "#fbfbfbff",
            transition: "box-shadow 0.2s ease, transform 0.2s ease",
            boxShadow: "20px 2px 8px rgba(28, 6, 6, 0.24)",
            "&:hover": {
              boxShadow: "0px 4px 14px rgba(0, 0, 0, 0.3)",
              transform: "translateY(-2px)",
            },
          }}
        >
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
            <Typography variant="body1" color="text.secondary">
              Bs. {pricingPolicies[0]?.basePrice} por{" "}
              {(() => {
                const unit = pricingPolicies[0]?.priceUnit?.toLowerCase() ?? "";
                if (unit === "dias" || unit === "días" || unit === "día")
                  return unit;
                return unit.slice(0, Math.max(unit.length - 1, 0));
              })()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              👥 Máx: {capacity} asistentes
            </Typography>

            {environment.hidden && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.45)",
                  zIndex: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Tooltip title="Ambiente oculto" arrow>
                  <Box
                    sx={{
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <VisibilityOff fontSize="large" />
                    <Typography variant="subtitle1" color="white">
                      Oculto
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>
            )}

            {equipmentChips.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "nowrap",
                  gap: 0.5,
                  mt: 1,
                  overflowX: "auto",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {equipmentChips.map(([id, qty]) => (
                  <Chip
                    key={id}
                    icon={OBJECT_ICONS[id]}
                    label={`${CLASS_ID_TO_NAME[id] || id} x${qty}`}
                    size="small"
                    color={"primary"}
                    sx={{
                      flexShrink: 0,
                      userSelect: "none",
                      mb: 1,
                      fontSize: 16,
                      color: "#424242ff",
                    }}
                  />
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default EnvironmentCard;
