"use client";

import ClientTour360RequestsPage from "@/components/client/ClientTour360RequestPage";
import { Box, CircularProgress } from "@mui/material";
import { Suspense } from "react";

export default function Tour360RequestsPage() {
  return (
    <Suspense
      fallback={
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress />
        </Box>
      }
    >
      <ClientTour360RequestsPage />
    </Suspense>
  );
}
