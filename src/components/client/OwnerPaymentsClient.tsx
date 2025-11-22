"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Grid, Paper } from "@mui/material";
import LoggedOutProfile from "../profile/LoggedOutProfile";
import ProfileSidebarActions from "../profile/ProfileSidebarActions";
import OwnerReceivedPayments from "../list/OwnerReceivedPayments";

export default function OwnerPaymentsClient() {
  const user = useSelector((state: RootState) => state.user);
  const isLoggedIn = !!user?.publicId;

  if (!isLoggedIn) {
    return (
      <LoggedOutProfile
        imageSrc="/images/illustrations/profile.svg"
        title="Accede para ver tu perfil"
      />
    );
  }

  return (
    <Grid container spacing={4} sx={{ mt: 4, width: "100%" }}>
      <Grid size={{ sm: 12, md: 3 }}>
        <ProfileSidebarActions />
      </Grid>

      <Grid size={{ sm: 12, md: 9 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
          <OwnerReceivedPayments />
        </Paper>
      </Grid>
    </Grid>
  );
}
