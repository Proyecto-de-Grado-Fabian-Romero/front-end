"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Box, Typography, Avatar, Button, Container } from "@mui/material";
import LoggedOutProfile from "@/components/profile/LoggedOutProfile";

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

  console.log(user.photoFileUrl)

  return (
    <Container>
      <Box p={4}>
        <Typography variant="h4" mb={2}>
          Mi Perfil
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={user.photoFileUrl || undefined}
            alt={user.name}
            sx={{ width: 80, height: 80 }}
          />
          <Box>
            <Typography variant="h6">{user.name}</Typography>
            <Typography variant="body1">{user.email}</Typography>
            <Typography variant="body2" color="textSecondary">
              Rol: {user.role}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
