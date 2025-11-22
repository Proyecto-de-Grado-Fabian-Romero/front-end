import { Container } from "@mui/material";
import { ReactNode } from "react";

interface CenteredLayoutProps {
  children: ReactNode;
}

const CenteredLayout = ({ children }: CenteredLayoutProps) => {
  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      {children}
    </Container>
  );
};

export default CenteredLayout;
