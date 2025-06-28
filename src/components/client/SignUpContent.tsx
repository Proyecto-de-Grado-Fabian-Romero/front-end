"use client";

import SignUpForm from "@/components/form/auth/SignUpForm";
import { RootState } from "@/store";
import { UserType } from "@/utils/constants/user-constants";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function SignUpContent() {
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.down("lg"));
  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const router = useRouter();
  const role = useSelector((state: RootState) => state.user.role);

  const userType: UserType =
    (role?.toLowerCase() as UserType) || UserType.UNLOGGED;

  useEffect(() => {
    if (userType !== UserType.UNLOGGED) router.replace("/");
  }, [userType, router]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
      }}
    >
      <Grid container spacing={4} alignItems="center" width={"100%"}>
        <Grid
          size={{ xs: 12, sm: 12, md: 6 }}
          sx={{ px: isLg ? 12 : isMd ? 8 : isSm ? 4 : 20 }}
        >
          <SignUpForm />
        </Grid>

        {!isMd && (
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Image
              src="/images/illustrations/signup.svg"
              alt="Illustration"
              width={520}
              height={520}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
