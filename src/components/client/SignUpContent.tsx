"use client";

import SignUpForm from "@/components/form/auth/SignUpForm";
import { Container, Grid, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";

export default function SignUpContent() {
  const theme = useTheme();
  const isMdOrSm = useMediaQuery(theme.breakpoints.down("md"));

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
          <SignUpForm />
        </Grid>

        {!isMdOrSm && (
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Image
              src="/images/illustrations/signup.svg"
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
