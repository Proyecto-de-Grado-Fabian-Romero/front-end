import React from "react";
import { Container } from "@mui/material";
import OwnerIncomeList from "../../components/list/OwnerIncomeList";

const IncomePage = () => {
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
      <OwnerIncomeList />
    </Container>
  );
};

export default IncomePage;
