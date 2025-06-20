import { ColorPalette } from "@/utils/constants/ui-constants";
import { Box, Button, Typography } from "@mui/material";

type RentPromptProps = {
  onClick?: () => void;
};

const RentPromptSection = ({ onClick = () => {} }: RentPromptProps) => {
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
        onClick={onClick}
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
    </Box>
  );
};

export default RentPromptSection;
