"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  Box,
  Typography,
  Avatar,
  Container,
  Divider,
  Chip,
  Grid,
  Paper,
} from "@mui/material";
import LoggedOutProfile from "@/components/profile/LoggedOutProfile";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import VerifiedIcon from "@mui/icons-material/Verified";
import { UserRole } from "@/types/Users";
import LogoutButton from "@/components/buttons/LogOutButton";

export default function ProfilePage() {
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
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mt: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Avatar
            src={user.photoFileUrl || undefined}
            alt={user.name}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h5" fontWeight="bold">
            {user.name}
          </Typography>
          {user.role === UserRole.Admin && (
            <Chip
              icon={<VerifiedIcon />}
              label="Administrador"
              size="small"
              sx={{ mt: 1 }}
            />
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <EmailIcon fontSize="small" />
              <Typography variant="body1">{user.email}</Typography>
              {user.verifiedEmail && (
                <Chip
                  label="Email verificado"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <PhoneIcon fontSize="small" />
              <Typography variant="body1">
                {user.phone || "Sin número telefónico"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Box display="flex" justifyContent="center" mt={2}>
        <LogoutButton />
      </Box>
    </Container>
  );
}
