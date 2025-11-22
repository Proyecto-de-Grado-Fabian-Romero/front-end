"use client";
import React from "react";
import { Toolbar, Box } from "@mui/material";
import { UserType } from "@/utils/constants/user-constants";
import { getHeaderNavItems } from "@/utils/constants/nav-configs";
import LogoImage from "./LogoImage";
import { NotificationsIconButton } from "../buttons/NotificationsIconButton";

interface MobileHeaderProps {
  userType?: UserType;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  userType = UserType.UNLOGGED,
}) => {
  const headerItems = getHeaderNavItems(userType);

  return (
    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <LogoImage size={32} />
      </Box>
      <Box>
        {userType !== UserType.UNLOGGED && userType !== UserType.RENTER && (
          <NotificationsIconButton headerItems={headerItems} />
        )}
      </Box>
    </Toolbar>
  );
};

export default MobileHeader;
