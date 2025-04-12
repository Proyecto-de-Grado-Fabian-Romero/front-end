import Banner from "@/sections/home/Banner";
import ExperienceSection from "@/sections/home/ExperienceSection";
import OccasionsSection from "@/sections/home/OcassionsSection";
import RentPromptSection from "@/sections/home/RentPromptSection";
import { Box } from "@mui/material";
import React from "react";

const Home = () => {
  return (
    <Box sx={{ overflowX: "hidden" }}>
      <Banner />
      <OccasionsSection />
      <RentPromptSection />
      <ExperienceSection />
    </Box>
  );
};

export default Home;
