"use client";

import dynamic from "next/dynamic";
import { Container, CircularProgress, Box } from "@mui/material";
import React from "react";

const CreateEnvironmentForm = dynamic(
  () => import("@/components/form/createEnvironment/CreateEnvironmentForm"),
  {
    ssr: false,
    loading: () => (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    ),
  },
);

const Page = () => {
  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <CreateEnvironmentForm />
    </Container>
  );
};

export default Page;
