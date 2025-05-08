"use client";

import {
  Box,
  Button,
  Chip,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import VirtualTour from "@/components/tour/VirtualTour";
import { Environment } from "@/types/GetEnvironment";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PricingDisplay from "@/components/display/PricingDisplay";
import UsersEnvironmentButtons from "@/components/buttons/UsersEnvironmentButton";
import { getEnvironmentByPublicId } from "@/services/environmentService";

export default function EnvironmentDetailsPage() {
  const { publicId } = useParams();
  const [data, setData] = useState<Environment | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchEnvironment = async () => {
      try {
        const result = await getEnvironmentByPublicId(
          publicId?.toString() ?? ""
        );
        setData(result);
      } catch (err: any) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (publicId) {
      fetchEnvironment();
    }
  }, [publicId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={4}
        sx={{ height: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>Ambiente no encontrado.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2, maxWidth: 800, margin: "auto", marginTop: 6 }}>
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        spaceBetween={10}
        slidesPerView={1}
        style={{ borderRadius: "12px", marginBottom: "1rem" }}
      >
        {data.photos?.map((photo) => (
          <SwiperSlide key={photo.fileId}>
            <div
              style={{ width: "100%", position: "relative", height: "400px" }}
            >
              <Image
                src={photo.url}
                alt={photo.fileName}
                fill
                style={{
                  objectFit: "cover",
                  borderRadius: 12,
                  width: "100%",
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

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

      <Box mt={3}>
        <Typography variant="subtitle1" fontWeight="bold">
          Servicios incluidos
        </Typography>
        <Grid container spacing={1} mt={1}>
          {data.services.map((s) => (
            <Grid key={s.name}>
              <Chip label={s.name} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box mt={3}></Box>

      <hr />

      <Box mt={3}>
        <Typography variant="subtitle1" fontWeight="bold">
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

      <Box mt={3}>
        {data.tour360Id && <VirtualTour tour360Id={data.tour360Id} />}
      </Box>

      {user.publicId === data.ownerId && (
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
      )}

      <Box mt={16} />

      <UsersEnvironmentButtons
        basePrice={data.pricingPolicies[0].basePrice}
        rentalUnit={data.rentalUnit}
        forOwner={user.publicId === data.ownerId}
        envPubId={data.publicId}
      />
    </Box>
  );
}
