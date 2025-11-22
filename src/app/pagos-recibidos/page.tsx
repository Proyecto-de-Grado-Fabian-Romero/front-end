import React from "react";
import dynamic from "next/dynamic";
import CenteredLayout from "@/components/layouts/CenteredLayout";
import { CircularProgress, Box } from "@mui/material";

const OwnerPaymentsClient = dynamic(
  () => import("../../components/client/OwnerPaymentsClient"),
  {
    ssr: true,
    loading: () => (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    ),
  },
);

const ReceivedPaymentsPage = () => {
  return (
    <CenteredLayout>
      <OwnerPaymentsClient />
    </CenteredLayout>
  );
};

export default ReceivedPaymentsPage;
