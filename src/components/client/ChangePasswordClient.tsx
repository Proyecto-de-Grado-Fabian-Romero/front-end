"use client";

import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { changePassword } from "@/services/authService";
import { useRouter } from "next/navigation";
import { validatePassword } from "@/utils/methods/validations";
import PasswordField from "../inputs/field/PasswordField";
import ProfileSidebarActions from "../profile/ProfileSidebarActions";
import LoggedOutProfile from "../profile/LoggedOutProfile";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const ChangePasswordClient = () => {
  const user = useSelector((state: RootState) => state.user);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validatePassword(newPassword)) {
      setError(
        "La contraseña debe tener al menos 6 caracteres, con un número, mayúscula, minúscula y un carácter especial."
      );
      return;
    }

    setLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      router.push("/profile");
    } catch {
      setError("La contraseña actual es incorrecta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

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
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 8, maxWidth: 400, mx: "auto", width: "100%" }}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <Typography variant="h5" fontWeight="bold" textAlign="center">
              Cambiar Contraseña
            </Typography>

            <PasswordField
              label="Contraseña Actual"
              value={currentPassword}
              onChange={setCurrentPassword}
            />

            <PasswordField
              label="Nueva Contraseña"
              value={newPassword}
              onChange={setNewPassword}
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={loading || !currentPassword || !newPassword}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Update Password"
              )}
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ChangePasswordClient;
