"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Grid, Paper } from "@mui/material";
import LoggedOutProfile from "../profile/LoggedOutProfile";
import ProfileDetails from "../profile/ProfileDetails";
import ProfileSidebarActions from "../profile/ProfileSidebarActions";

export default function ProfileClient() {
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
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid container spacing={4} sx={{ mt: 4, width: "100%" }}>
        <Grid size={{ sm: 12, md: 3 }}>
          <ProfileSidebarActions />
        </Grid>

        <Grid size={{ sm: 12, md: 9 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <ProfileDetails user={user} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
