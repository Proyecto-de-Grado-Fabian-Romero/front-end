"use client";

import LogInForm from "@/components/form/auth/LogInForm";
import { RootState } from "@/store";
import { UserType } from "@/utils/constants/user-constants";
import { Container, Grid, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function LoginContent() {
  const theme = useTheme();
  const isMdOrSm = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const role = useSelector((state: RootState) => state.user.role);

  const userType: UserType =
    (role?.toLowerCase() as UserType) || UserType.UNLOGGED;

  useEffect(() => {
    if (userType !== UserType.UNLOGGED) router.replace("/");
  }, [userType, router]);

  return (
    <Container
      maxWidth={false}
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        spacing={4}
        alignItems="center"
        width={"100%"}
        sx={{ px: isMdOrSm ? 0 : 8 }}
      >
        <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ px: isMdOrSm ? 2 : 8 }}>
          <LogInForm />
        </Grid>

        {!isMdOrSm && (
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Image
              src="/images/illustrations/login.svg"
              alt="Illustration"
              width={400}
              height={400}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
