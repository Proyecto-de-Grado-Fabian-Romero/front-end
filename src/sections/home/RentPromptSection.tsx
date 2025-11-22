"use client";

import BankPaymentModal from "@/components/modal/BankPaymentModal";
import { RootState } from "@/store";
import { UserRole } from "@/types/Users";
import { ColorPalette } from "@/utils/constants/ui-constants";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

const RentPromptSection = () => {
  const user = useSelector((state: RootState) => state.user);
  const [openBankModal, setOpenBankModal] = useState(false);

  if (user.role === UserRole.Owner || user.role === UserRole.Admin)
    return <></>;

  return (
    <Box sx={{ backgroundColor: "#000", py: 4, px: 4, textAlign: "center" }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: ColorPalette.NEUTRAL_WHITE }}
      >
        ¿TIENES UN AMBIENTE PARA ALQUILAR?
      </Typography>
      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{ color: ColorPalette.NEUTRAL_WHITE, fontWeight: "500" }}
      >
        Publica tu ambiente en Spacio y llega a personas interesadas en
        alquilarla.
      </Typography>
      <Button
        onClick={() => setOpenBankModal(true)}
        variant="contained"
        sx={{
          mt: 2,
          backgroundColor: `${ColorPalette.NEUTRAL_WHITE} !important`,
          color: `${ColorPalette.NEUTRAL_BLACK} !important`,
          fontWeight: 600,
        }}
      >
        Publica tu Ambiente Ahora
      </Button>

      <BankPaymentModal
        open={openBankModal}
        onClose={() => setOpenBankModal(false)}
        mode={"create"}
      />
    </Box>
  );
};

export default RentPromptSection;
