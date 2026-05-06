"use client";
import React, { useEffect, useState } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import { useMediaQuery, useTheme, Typography } from "@mui/material";
import { UserType } from "@/utils/constants/user-constants";
import { getBottomNavItems } from "@/utils/constants/nav-configs";
import { useRouter, usePathname } from "next/navigation";
import { PageRoutes } from "@/utils/constants/page-routes";

interface BottomNavProps {
  userType?: UserType;
}

const BottomNav: React.FC<BottomNavProps> = ({
  userType = UserType.UNLOGGED,
}) => {
  const [value, setValue] = useState(0);
  const navItems = getBottomNavItems(userType);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"), {
    noSsr: true,
  });

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    navItems.forEach((item) => {
      router.prefetch(item.to);
    });
  }, [router, navItems]);

  if (!isSmallScreen || pathname.includes(PageRoutes.Environment_Details))
    return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100000,
        transform: "translateZ(0)",
      }}
    >
      <Paper sx={{ pb: 2 }} elevation={3}>
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
                  {item.label.split(" ").length > 1
                    ? item.label.split(" ").slice(1).join(" ")
                    : item.label}
                </Typography>
              }
              icon={item.icon}
              onClick={() => router.push(`${item.to}`)}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </div>
  );
};

export default BottomNav;
