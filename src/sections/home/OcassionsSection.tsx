"use client";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

const categories = [
  { label: "Hospedajes", image: "/images/home/lodge.jpg" },
  { label: "Oficinas", image: "/images/home/office.jpg" },
  { label: "Coworkings", image: "/images/home/cowork.jpg" },
  { label: "Salas de Conferencias", image: "/images/home/conferences.jpg" },
  { label: "Salones de Eventos", image: "/images/home/events.jpg" },
];

const OccasionsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ py: 4, px: 2, my: 4 }}>
      <Typography variant="h6" fontWeight={600} mb={4} textAlign="center">
        Ambientes para cada ocasión
      </Typography>
      <Box
        sx={
          isMobile
            ? {
                display: "flex",
                overflowX: "auto",
                gap: 2,
                px: 2,
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
              }
            : {
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 2,
                px: 4,
              }
        }
      >
        {categories.map((item, index) => (
          <Box
            key={index}
            sx={{
              width: isMobile ? 200 : "100%",
              height: 300,
              borderRadius: 2,
              overflow: "hidden",
              position: "relative",
              backgroundImage: `url(${item.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "flex-end",
              scrollSnapAlign: isMobile ? "start" : undefined,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: "100%",
                position: "absolute",
                bottom: 0,
                left: 0,
                height: "100%",
                background:
                  "linear-gradient(to bottom, #7e7e7e40 30%, #000 100%)",
                zIndex: 1,
              }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                position: "relative",
                zIndex: 2,
                color: "#fff",
                width: "100%",
                textAlign: "center",
                py: 1,
                px: 2,
                fontWeight: 600,
                backgroundColor: "transparent",
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OccasionsSection;
