"use client";
import React from "react";
import { Toolbar, IconButton, Box, Button, Badge } from "@mui/material";
import Link from "next/link";
import { PageRoutes } from "@/utils/constants/page-routes";
import { UserType } from "@/utils/constants/user-constants";
import { getHeaderNavItems } from "@/utils/constants/nav-configs";
import LogoImage from "./LogoImage";
import { useRouter } from "next/navigation";

interface DesktopHeaderProps {
  userType?: UserType;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  userType = UserType.UNLOGGED,
}) => {
  const hasNotifications = true;
  const headerItems = getHeaderNavItems(userType);
  const router = useRouter();

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
        <LogoImage />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {userType === UserType.UNLOGGED ? (
          <>
            <Link href={PageRoutes.LogIn} passHref>
              <Button color="inherit">Iniciar Sesión</Button>
            </Link>

            <Link href={PageRoutes.SignUp} passHref>
              <Button variant="contained">Regístrate</Button>
            </Link>
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
                    onClick={() => router.push(`${item.to}`)}
                    sx={{ paddingLeft: 3, paddingRight: 2 }}
                  >
                    {item.label}
                  </Button>
                )
            )}
            <Link href={PageRoutes.Notifications} passHref>
              <IconButton color="secondary">
                <Badge
                  color="error"
                  variant="dot"
                  invisible={!hasNotifications}
                >
                  {
                    headerItems.find((item) => item.label === "Notificaciones")
                      ?.icon
                  }
                </Badge>
              </IconButton>
            </Link>

            <Link href={PageRoutes.Profile} passHref>
              <IconButton color="secondary">
                {headerItems.find((item) => item.label === "Perfil")?.icon}
              </IconButton>
            </Link>
          </>
        )}
      </Box>
    </Toolbar>
  );
};

export default DesktopHeader;
