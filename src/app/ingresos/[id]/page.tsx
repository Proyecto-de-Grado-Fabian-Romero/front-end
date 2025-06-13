import React from "react";
import OwnerIncomeDetail from "../../../components/detail/OwnerIncomeDetail";
import { Container } from "@mui/material";

const IncomeDetailPage = () => {
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
      <OwnerIncomeDetail />
    </Container>
  );
};

export default IncomeDetailPage;
