"use client";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { PageRoutes } from "@/utils/constants/page-routes";
import { UserRole } from "@/types/Users";
import PaymentsIcon from "@mui/icons-material/Payments";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SecurityIcon from "@mui/icons-material/Security";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function ProfileSidebarActions() {
  const user = useSelector((state: RootState) => state.user);

  const router = useRouter();
  const pathname = usePathname();

  const isCurrent = (path: string) => pathname === path;

  const content = (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Opciones
      </Typography>
      <Stack spacing={2} alignItems="stretch">
        <Button
          variant={isCurrent(PageRoutes.Profile) ? "contained" : "outlined"}
          fullWidth
          startIcon={<AccountCircleIcon />}
          onClick={() => router.push(PageRoutes.Profile)}
          sx={{ justifyContent: "flex-start" }}
        >
          Perfil
        </Button>

        {user.role === UserRole.Owner && (
          <>
            <Button
              variant={isCurrent(PageRoutes.Incomes) ? "contained" : "outlined"}
              fullWidth
              startIcon={<PaymentsIcon />}
              onClick={() => router.push(PageRoutes.Incomes)}
              sx={{ justifyContent: "flex-start" }}
            >
              Ingresos
            </Button>
            <Button
              variant={
                isCurrent(PageRoutes.Received_Payments)
                  ? "contained"
                  : "outlined"
              }
              fullWidth
              startIcon={<CreditScoreIcon />}
              onClick={() => router.push(PageRoutes.Received_Payments)}
              sx={{ justifyContent: "flex-start" }}
            >
              Pagos Recibidos
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AccountBalanceIcon />}
              onClick={() => router.push(PageRoutes.Update_Bank_Data)}
              sx={{ justifyContent: "flex-start" }}
            >
              Datos bancarios
            </Button>
          </>
        )}

        <Button
          variant={isCurrent(PageRoutes.Seguridad) ? "contained" : "outlined"}
          fullWidth
          startIcon={<SecurityIcon />}
          onClick={() => router.push(PageRoutes.Seguridad)}
          sx={{ justifyContent: "flex-start" }}
        >
          Seguridad
        </Button>
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ minWidth: { md: 280 }, mt: { xs: 4, md: 0 }, pr: { md: 4 } }}>
      {content}
    </Box>
  );
}
