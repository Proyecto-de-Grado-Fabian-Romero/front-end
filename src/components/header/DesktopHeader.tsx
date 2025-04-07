"use client";
import React from "react";
import {
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Badge,
} from "@mui/material";
import Link from "next/link";
import { PageRoutes } from "@/utils/constants/page-routes";
import { UserType } from "@/utils/constants/user-constants";
import { getHeaderNavItems } from "@/utils/constants/nav-configs";
import Image from "next/image";

interface DesktopHeaderProps {
  userType?: UserType;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  userType = UserType.UNLOGGED,
}) => {
  const hasNotifications = true;
  const headerItems = getHeaderNavItems(userType);

  return (
    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          textDecoration: "none",
        }}
        component={Link}
        href={PageRoutes.Home}
      >
        <Image src="/images/logo.png" alt="Logo" style={{ height: 40 }} />
        <Typography variant="h6">SPACIO</Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {userType === UserType.UNLOGGED ? (
          <>
            <Button color="inherit">Iniciar Sesión</Button>
            <Button variant="contained">Regístrate</Button>
          </>
        ) : (
          <>
            {headerItems.map(
              (item) =>
                item.label !== "Perfil" &&
                item.label !== "Notificaciones" && (
                  <Button
                    key={item.label}
                    startIcon={item.icon}
                    color="inherit"
                  >
                    {item.label}
                  </Button>
                ),
            )}
            <IconButton color="inherit">
              <Badge color="error" variant="dot" invisible={!hasNotifications}>
                {
                  headerItems.find((item) => item.label === "Notificaciones")
                    ?.icon
                }
              </Badge>
            </IconButton>
            <IconButton color="inherit">
              {headerItems.find((item) => item.label === "Perfil")?.icon}
            </IconButton>
          </>
        )}
      </Box>
    </Toolbar>
  );
};

export default DesktopHeader;
