"use client";

import CenteredLayout from "@/components/layouts/CenteredLayout";
import ClientEnvironmentsPage from "@/components/client/ClientEnvironmentsPage";
import { Box, CircularProgress } from "@mui/material";
import { Suspense } from "react";

export default function EnvironmentsPage() {
  return (
    <CenteredLayout>
      <br />
      <br />
      <br />
      <Suspense
        fallback={
          <Box display="flex" justifyContent="center" mt={6}>
            <CircularProgress />
          </Box>
        }
      >
        <ClientEnvironmentsPage />
      </Suspense>
    </CenteredLayout>
  );
}
