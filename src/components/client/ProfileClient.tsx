"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Grid, Paper } from "@mui/material";
import LoggedOutProfile from "../profile/LoggedOutProfile";
import ProfileDetails from "../profile/ProfileDetails";
import ProfileSidebarActions from "../profile/ProfileSidebarActions";
import { useState } from "react";
import BankPaymentModal from "../modal/BankPaymentModal";

export default function ProfileClient() {
  const user = useSelector((state: RootState) => state.user);
  const isLoggedIn = !!user?.publicId;

  const [openBankModal, setOpenBankModal] = useState(false);

  if (!isLoggedIn) {
    return (
      <LoggedOutProfile
        imageSrc="/images/illustrations/profile.svg"
        title="Accede para ver tu perfil"
      />
    );
  }

  return (
    <Grid container spacing={4} sx={{ mt: 4 }}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
          <ProfileDetails user={user} />
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <ProfileSidebarActions
          user={user}
          onEditBankData={() => setOpenBankModal(true)}
        />
      </Grid>
      {user.role && (
        <BankPaymentModal
          open={openBankModal}
          onClose={() => setOpenBankModal(false)}
          mode={user.bankPaymentData ? "update" : "create"}
          defaultValues={user.bankPaymentData}
        />
      )}
    </Grid>
  );
}
