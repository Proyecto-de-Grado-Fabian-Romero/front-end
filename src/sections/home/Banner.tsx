"use client";
import React from "react";
import SearchComponent from "@/components/inputs/searchbar/SearchComponent";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ColorPalette } from "@/utils/constants/ui-constants";

const Banner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/home/banner_bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        maxWidth: "100vw",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          paddingRight: "24px",
          paddingLeft: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Box sx={{ textAlign: "center" }} mb={4}>
          <Typography
            variant="h1"
            sx={{
              color: ColorPalette.NEUTRAL_WHITE,
              fontSize: isMobile ? "1.8em" : "4em",
            }}
            gutterBottom
          >
            Encuentra el ambiente ideal para tí
          </Typography>
          <Typography
            sx={{
              color: ColorPalette.NEUTRAL_WHITE,
              fontSize: isMobile ? "1em" : "1.5em",
            }}
            gutterBottom
          >
            Explora diferentes opciones para hospedarte, trabajar o realizar
            eventos.
          </Typography>
        </Box>
        <SearchComponent />
      </Box>
    </Box>
  );
};

export default Banner;
