"use client";

import {
  Box,
  Button,
  Paper,
  Stack,
  Tabs,
  Tab,
  useMediaQuery,
} from "@mui/material";
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
import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";

export default function ProfileSidebarActions() {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md")); // xs/sm => Tabs, md+ => sidebar

  // Definimos las opciones una sola vez
  const allItems = useMemo(() => {
    const base = [
      {
        label: "Perfil",
        icon: <AccountCircleIcon fontSize="small" />,
        route: PageRoutes.Profile,
        show: true,
      },
      {
        label: "Ingresos",
        icon: <PaymentsIcon fontSize="small" />,
        route: PageRoutes.Incomes,
        show: user.role === UserRole.Owner,
      },
      {
        label: "Pagos Recibidos",
        icon: <CreditScoreIcon fontSize="small" />,
        route: PageRoutes.Received_Payments,
        show: user.role === UserRole.Owner,
      },
      {
        label: "Datos bancarios",
        icon: <AccountBalanceIcon fontSize="small" />,
        route: PageRoutes.Update_Bank_Data,
        show: user.role === UserRole.Owner,
      },
      {
        label: "Seguridad",
        icon: <SecurityIcon fontSize="small" />,
        route: PageRoutes.Seguridad,
        show: true,
      },
    ];
    return base.filter((i) => i.show);
  }, [user.role]);

  // Index actual según ruta
  const currentIndex = useMemo(() => {
    const idx = allItems.findIndex((i) => i.route === pathname);
    return idx === -1 ? 0 : idx;
  }, [allItems, pathname]);

  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    const item = allItems[newIndex];
    if (item) router.push(item.route);
  };

  // --- Mobile/Tablet: Tabs horizontales scrollables ---
  if (isSmall) {
    return (
      <Box sx={{ width: "100%", mb: 2 }}>
        <Paper
          elevation={1}
          sx={{
            borderRadius: 2,
            px: 1,
            // que los tabs no “salten” al hacer scroll
            position: "sticky",
            top: 0,
            zIndex: 2,
            bgcolor: "background.paper",
          }}
        >
          <Tabs
            value={currentIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="Navegación perfil"
            sx={{
              minHeight: 48,
              "& .MuiTab-root": {
                minHeight: 48,
                textTransform: "none",
                fontSize: 13,
                px: 1.25,
              },
              "& .MuiTabs-indicator": { height: 2 },
            }}
          >
            {allItems.map((item) => (
              <Tab
                key={item.route}
                icon={item.icon}
                iconPosition="start"
                label={item.label}
              />
            ))}
          </Tabs>
        </Paper>
      </Box>
    );
  }

  // --- Desktop (md+): Sidebar vertical clásico (sin título) ---
  return (
    <Box
      sx={{
        width: "auto",
        minWidth: 280,
        pr: 4,
        position: "sticky",
        top: 24,
        alignSelf: "flex-start",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          width: 360,
        }}
      >
        <Stack spacing={1.25} alignItems="stretch">
          {allItems.map((item) => {
            const isActive = pathname === item.route;
            return (
              <Button
                key={item.route}
                size="small"
                variant={isActive ? "contained" : "outlined"}
                fullWidth
                startIcon={item.icon}
                onClick={() => router.push(item.route)}
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                {item.label}
              </Button>
            );
          })}
        </Stack>
      </Paper>
    </Box>
  );
}
