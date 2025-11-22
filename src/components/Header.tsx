"use client";
import React, { useEffect } from "react";
import { AppBar, useTheme, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import MobileHeader from "./header/MobileHeader";
import DesktopHeader from "./header/DesktopHeader";
import { RootState } from "@/store";
import { UserType } from "@/utils/constants/user-constants";

const Header: React.FC = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const role = useSelector((state: RootState) => state.user.role);
  const userType: UserType =
    (role?.toLowerCase() as UserType) || UserType.UNLOGGED;

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((reg) => console.log("SW registrado", reg.scope))
        .catch((err) => console.error("SW falló", err));
    }
  }, []);

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
