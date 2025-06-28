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
        height: "100vh",
      }}
    >
      {children}
    </Container>
  );
};

export default CenteredLayout;
