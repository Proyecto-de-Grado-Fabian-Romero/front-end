"use client";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";

const ExperienceSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box px={2} py={4} mt={2} mb={6}>
      <Typography variant="h6" textAlign="center" gutterBottom>
        Vive la experiencia antes de reservar
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 500 }}
        textAlign="center"
        gutterBottom
      >
        Explora los ambientes con recorridos 360° y elige con total confianza.
      </Typography>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        mb={6}
        mt={4}
      >
        <Box
          sx={{
            position: "relative",
            width: isMobile ? "100%" : "50%",
            height: "auto",
            aspectRatio: "2 / 1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src="/images/home/tour_vr.png"
            alt="360 Experience"
            fill
            sizes="(max-width: 600px) 100vw, 400px"
            style={{ objectFit: "contain" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ExperienceSection;
