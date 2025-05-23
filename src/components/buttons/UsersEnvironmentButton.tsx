import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import OwnerEnvironmentButtons from "./OwnerEnvironmentButtons";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserType } from "@/utils/constants/user-constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageRoutes } from "@/utils/constants/page-routes";

type Props = {
  basePrice: number;
  rentalUnit: string;
  envPubId: string;
  forOwner?: boolean;
};

const UsersEnvironmentButtons = ({
  basePrice,
  rentalUnit,
  forOwner,
  envPubId,
}: Props) => {
  const role = useSelector((state: RootState) => state.user.role);
  const userType: UserType =
    (role?.toLowerCase() as UserType) || UserType.UNLOGGED;
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);

  const handleReserveClick = () => {
    if (userType === UserType.UNLOGGED) {
      setOpenDialog(true);
    } else {
      router.push(`${PageRoutes.Book}/${envPubId}`);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
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
        sx={{ boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.1)" }}
      >
        <Box
          sx={{ maxWidth: 800, width: "100%", padding: "0 12px" }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {forOwner ? (
            <OwnerEnvironmentButtons envPubId={envPubId} />
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
                  onClick={handleReserveClick}
                >
                  Reservar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Inicia sesión para continuar</DialogTitle>
        <DialogContent>
          <Typography>
            Debes iniciar sesión o crear una cuenta para poder realizar una
            reserva.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button sx={{ paddingX: 2 }} onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push(`${PageRoutes.SignUp}`)}
            color="secondary"
            sx={{ paddingX: 2 }}
          >
            Crear cuenta
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push(`${PageRoutes.LogIn}`)}
            color="primary"
            sx={{ marginX: 2, paddingX: 2 }}
          >
            Iniciar sesión
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersEnvironmentButtons;
