import React from "react";
import dynamic from "next/dynamic";
import CenteredLayout from "@/components/layouts/CenteredLayout";
import { CircularProgress, Box } from "@mui/material";

const OwnerReceivedPayments = dynamic(
  () => import("../../components/list/OwnerReceivedPayments"),
  {
    ssr: true,
    loading: () => (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    ),
  }
);

const ReceivedPaymentsPage = () => {
  return (
    <CenteredLayout>
      <OwnerReceivedPayments />
    </CenteredLayout>
  );
};

export default ReceivedPaymentsPage;
