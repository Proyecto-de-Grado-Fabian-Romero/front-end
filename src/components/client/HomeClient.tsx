"use client";

import Banner from "@/sections/home/Banner";
import ExperienceSection from "@/sections/home/ExperienceSection";
import OccasionsSection from "@/sections/home/OcassionsSection";
import RentPromptSection from "@/sections/home/RentPromptSection";
import { RootState } from "@/store";
import { UserRole } from "@/types/Users";
import { Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import AdminHome from "../dashboard/AdminHome";
import CenteredLayout from "../layouts/CenteredLayout";

const Home = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <Box sx={{ overflowX: "hidden" }}>
      {user.role === UserRole.Admin ? (
        <CenteredLayout>
          <AdminHome />
        </CenteredLayout>
      ) : (
        <>
          <Banner />
          <OccasionsSection />
          <RentPromptSection />
          <ExperienceSection />
        </>
      )}
    </Box>
  );
};

export default Home;
