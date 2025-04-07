"use client";
import React from "react";
import { Toolbar, IconButton, Box, Badge } from "@mui/material";
import { UserType } from "@/utils/constants/user-constants";
import { getHeaderNavItems } from "@/utils/constants/nav-configs";
import { PageRoutes } from "@/utils/constants/page-routes";
import LogoImage from "./LogoImage";

interface MobileHeaderProps {
  userType?: UserType;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  userType = UserType.UNLOGGED,
}) => {
  const hasNotifications = false;

  const headerItems = getHeaderNavItems(userType);

  return (
    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <LogoImage size={32} />
      </Box>
      <Box>
        {userType !== UserType.UNLOGGED && userType !== UserType.RENTER && (
          <IconButton color="inherit" href={PageRoutes.Notifications}>
            <Badge color="error" variant="dot" invisible={!hasNotifications}>
              {
                headerItems.find((item) => item.label === "Notificaciones")
                  ?.icon
              }
            </Badge>
          </IconButton>
        )}
      </Box>
    </Toolbar>
  );
};

export default MobileHeader;
