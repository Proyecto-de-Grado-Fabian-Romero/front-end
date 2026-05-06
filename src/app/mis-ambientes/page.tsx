"use client";

import CenteredLayout from "@/components/layouts/CenteredLayout";
import ClientOwnerEnvironments from "@/components/client/ClientOwnerEnvironments";
import { Box, CircularProgress } from "@mui/material";
import { Suspense } from "react";

export default function OwnerEnvironmentsPage() {
  return (
    <CenteredLayout>
      <Suspense
        fallback={
          <Box display="flex" justifyContent="center" mt={8}>
            <CircularProgress />
          </Box>
        }
      >
        <ClientOwnerEnvironments />
      </Suspense>
    </CenteredLayout>
  );
}
