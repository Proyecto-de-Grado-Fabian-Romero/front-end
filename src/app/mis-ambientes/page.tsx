"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Box, Container } from "@mui/material";
import { PageRoutes } from "@/utils/constants/page-routes";
import ResponsiveFab from "@/components/buttons/ResponsiveFabButton";

const EnvironmentsPage = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push(PageRoutes.New_Environment);
  };

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <Box sx={{ p: 3 }}></Box>

      <ResponsiveFab onClick={handleClick} />
    </Container>
  );
};

export default EnvironmentsPage;
