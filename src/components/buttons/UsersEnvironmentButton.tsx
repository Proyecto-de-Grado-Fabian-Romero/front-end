import { Box, Button, Typography } from "@mui/material";
import OwnerEnvironmentButtons from "./OwnerEnvironmentButtons";

type Props = {
  basePrice: number;
  rentalUnit: string;
  forOwner?: boolean;
};

const UsersEnvironmentButtons = ({
  basePrice,
  rentalUnit,
  forOwner,
}: Props) => {
  return (
    <Box
      position="fixed"
      left={0}
      right={0}
      bottom={0}
      zIndex={1300}
      bgcolor="background.paper"
      p={2}
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        sx={{ maxWidth: 800, width: "100%", padding: "0 12px" }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {forOwner ? (
          <OwnerEnvironmentButtons />
        ) : (
          <>
            <Box flex={1}>
              <Typography variant="h6" fontWeight="bold">
                Bs. {basePrice} / {rentalUnit.slice(0, rentalUnit.length - 1)}
              </Typography>
            </Box>
            <Box flex={1} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                sx={{
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  maxWidth: "100%",
                }}
              >
                Reservar
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default UsersEnvironmentButtons;
