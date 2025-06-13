"use client";

import { Box, Chip, Grid, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";
import VirtualTour from "@/components/tour/VirtualTour";
import PricingDisplay from "@/components/display/PricingDisplay";
import DiscountsDisplay from "@/components/display/DiscountDisplay";
import UsersEnvironmentButtons from "@/components/buttons/UsersEnvironmentButton";
import { Environment } from "@/types/GetEnvironment";
import { CLASS_ID_TO_NAME, OBJECT_ICONS } from "@/utils/constants/class-names";
import { HelpOutline } from "@mui/icons-material";

export default function EnvironmentDetailsClient({
  data,
}: {
  data: Environment;
}) {
  const user = useSelector((state: RootState) => state.user);

  const renderPhotos = () =>
    data.photos?.length > 0 && (
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        spaceBetween={10}
        slidesPerView={1}
        style={{ borderRadius: "12px", marginBottom: "1rem" }}
      >
        {data.photos.map((photo) => (
          <SwiperSlide key={photo.fileId}>
            <div
              style={{ width: "100%", position: "relative", height: "400px" }}
            >
              <Image
                src={photo.url}
                alt={photo.fileName}
                fill
                style={{ objectFit: "cover", borderRadius: 12, width: "100%" }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );

  const renderServices = () =>
    data.services?.length > 0 && (
      <Box mt={3}>
        <Typography variant="subtitle1" fontWeight="bold">
          Servicios incluidos
        </Typography>
        <Grid container spacing={1} mt={1}>
          {data.services.map((s) => (
            <Grid key={s.publicKey}>
              <Chip label={s.name} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );

  const renderEquipment = () => {
    if (!data.equipment || data.equipment === "{}") return null;
    const equipmentData = JSON.parse(data.equipment);
    const equipmentKeys = Object.keys(equipmentData);
    if (equipmentKeys.length === 0) return null;

    return (
      <Box mt={3}>
        <Typography variant="subtitle1" fontWeight="bold">
          Equipamiento
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
          {equipmentKeys.map((id) => (
            <Chip
              key={id}
              icon={OBJECT_ICONS[id] ?? <HelpOutline />}
              label={`${CLASS_ID_TO_NAME[id] ?? id} x${equipmentData[id]}`}
            />
          ))}
        </Box>
      </Box>
    );
  };

  const renderAreas = () =>
    data.environmentAreas?.length > 0 && (
      <Box mt={4}>
        <hr />
        <Typography variant="subtitle1" fontWeight="bold" mt={2}>
          Áreas
        </Typography>
        <ul>
          {data.environmentAreas.map((areaItem) => (
            <li key={areaItem.area.publicKey}>
              {areaItem.area.name} x{areaItem.quantity}
            </li>
          ))}
        </ul>
      </Box>
    );

  const renderPricingPolicies = () =>
    user.publicId === data.ownerId &&
    data.pricingPolicies.length > 0 && (
      <>
        <br />
        <hr />
        <Typography variant="subtitle1" fontWeight="bold">
          Políticas de Precios:
        </Typography>
        {data.pricingPolicies.map((p) => (
          <PricingDisplay key={p.basePrice + p.extraGuestPrice} pricing={p} />
        ))}
      </>
    );

  const renderDiscountPolicies = () =>
    data.discountPolicies.length > 0 && (
      <DiscountsDisplay
        policies={data.discountPolicies}
        isHospedaje={data.type.publicKey === "hospedajes"}
        mt={3}
      />
    );

  return (
    <Box sx={{ padding: 2, maxWidth: 800, margin: "auto", marginTop: 6 }}>
      {renderPhotos()}

      <Typography variant="h5" fontWeight="bold" mt={2}>
        {data.title}
      </Typography>

      <Typography color="text.secondary">{data.location}</Typography>

      <Box
        display="flex"
        gap={2}
        mt={1}
        flexWrap="wrap"
        justifyContent="flex-start"
      >
        <Chip label={`Min. ${data.minRentalTime} ${data.rentalUnit}`} />
        <Chip label={`Máx. ${data.capacity} personas`} />
        <Chip label={`Tipo: ${data.type.name}`} />
      </Box>

      <Typography mt={3}>{data.description}</Typography>

      <br />
      <hr />

      {renderServices()}
      {renderEquipment()}
      {renderAreas()}

      <Box mt={3}>
        {data.tour360Id && <VirtualTour tour360Id={data.tour360Id} />}
      </Box>

      {renderPricingPolicies()}
      {renderDiscountPolicies()}

      <Box mt={16} />

      <UsersEnvironmentButtons
        basePrice={data.pricingPolicies[0]?.basePrice ?? 0}
        rentalUnit={data.rentalUnit}
        forOwner={user.publicId === data.ownerId}
        envPubId={data.publicId}
      />
    </Box>
  );
}
