import React from "react";
import { useRouter } from "next/navigation";
import { Fab, Box, Container } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { PageRoutes } from "@/utils/constants/page-routes";

const EnvironmentsPage = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push(PageRoutes.New_Environment);
  };

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <Box sx={{ p: 3 }}></Box>

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleClick}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default EnvironmentsPage;
