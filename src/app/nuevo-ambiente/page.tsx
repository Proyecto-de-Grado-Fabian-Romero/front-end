"use client";

import { Container, CircularProgress, Box } from "@mui/material";
import React from "react";
import CreateEnvironmentForm from "@/components/form/createEnvironment/CreateEnvironmentForm";

const Page = () => {
  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <React.Suspense
        fallback={
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        }
      >
        <CreateEnvironmentForm />
      </React.Suspense>
    </Container>
  );
};

export default Page;
