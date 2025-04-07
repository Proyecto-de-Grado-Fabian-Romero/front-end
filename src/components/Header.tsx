"use client";
import React from "react";
import { AppBar, useTheme, useMediaQuery } from "@mui/material";
import { UserType } from "@/utils/constants/user-constants";
import MobileHeader from "./header/MobileHeader";
import DesktopHeader from "./header/DesktopHeader";

interface HeaderProps {
  userType?: UserType;
}

const Header: React.FC<HeaderProps> = ({ userType = UserType.UNLOGGED }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        [theme.breakpoints.down("sm")]: {
          padding: "0 0",
        },
        [theme.breakpoints.up("md")]: {
          padding: "0 5%",
        },
        [theme.breakpoints.up("lg")]: {
          padding: "0 10%",
        },
      }}
    >
      {isLargeScreen ? (
        <DesktopHeader userType={userType} />
      ) : (
        <MobileHeader userType={userType} />
      )}
    </AppBar>
  );
};

export default Header;
