import CreateEnvironmentForm from "@/components/form/CreateEnvironmentForm";
import { Container } from "@mui/material";
import React from "react";

const page = () => {
  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <br />
      <CreateEnvironmentForm />
      <br />
      <br />
    </Container>
  );
};

export default page;
