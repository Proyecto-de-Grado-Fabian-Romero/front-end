"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Paper } from "@mui/material";
import LoggedOutProfile from "../profile/LoggedOutProfile";
import ProfileDetails from "../profile/ProfileDetails";

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
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mt: 4 }}>
      <ProfileDetails user={user} />
    </Paper>
  );
}
