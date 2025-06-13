import React from "react";
import { Container } from "@mui/material";
import OwnerReceivedPayments from "../../components/list/OwnerReceivedPayments";

const ReceivedPaymentsPage = () => {
  return (
    <Container
      maxWidth={false}
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <OwnerReceivedPayments />
    </Container>
  );
};

export default ReceivedPaymentsPage;
