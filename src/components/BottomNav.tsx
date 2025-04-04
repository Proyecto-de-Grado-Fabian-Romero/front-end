"use client";
import React, { useState } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import {
  CalendarToday,
  Notifications,
  Person,
  Search,
  Key,
  Image,
  MonetizationOn,
  Book,
} from "@mui/icons-material";
import { UserType } from "@/utils/constants/user-constants";
import { Typography, useMediaQuery, useTheme } from "@mui/material";

// Define navigation configs based on user type
const NAV_CONFIGS: Record<
  string,
  { label: string; icon: React.ReactElement }[]
> = {
  [UserType.RENTER]: [
    { label: "Explora", icon: <Search /> },
    { label: "Reservas", icon: <Book /> },
    { label: "Notificaciones", icon: <Notifications /> },
    { label: "Perfil", icon: <Person /> },
  ],
  [UserType.OWNER]: [
    { label: "Reservas", icon: <Book /> },
    { label: "Ambientes", icon: <Key /> },
    { label: "Calendario", icon: <CalendarToday /> },
    { label: "Explora", icon: <Search /> },
    { label: "Perfil", icon: <Person /> },
  ],
  [UserType.ADMIN]: [
    { label: "Capturas", icon: <Image /> },
    { label: "Calendario", icon: <CalendarToday /> },
    { label: "Deudas", icon: <MonetizationOn /> },
    { label: "Perfil", icon: <Person /> },
  ],
};

type BottomNavProps = {
  userType?: UserType;
};

/**
 * This component represents the bottom navigation for small devices in the app
 * @param userType is the type of user of the app
 */
const BottomNav: React.FC<BottomNavProps> = ({
  userType = UserType.RENTER,
}) => {
  const [value, setValue] = useState(0);
  const navItems = NAV_CONFIGS[userType] || NAV_CONFIGS.general;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!isSmallScreen) return null;

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        showLabels
      >
        {navItems.map((item, index) => (
          <BottomNavigationAction
            key={index}
            label={
              <Typography
                marginTop={-10}
                sx={{ wordBreak: "auto-phrase" }}
                variant="caption"
              >
                {item.label}
              </Typography>
            }
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
