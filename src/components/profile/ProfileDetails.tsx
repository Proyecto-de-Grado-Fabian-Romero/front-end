import React, { useState, useRef, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import VerifiedIcon from "@mui/icons-material/Verified";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

import { UserState as User, UserRole } from "@/types/Users";
import EditProfileModal from "../modal/EditProfileModal";
import RentPromptSection from "@/sections/home/RentPromptSection";
import LogoutButton from "../buttons/LogOutButton";

import { uploadImages } from "@/services/imagesService";
import { updateUserProfile } from "@/services/authService";

interface Props {
  user: User;
}

/**
 * AvatarPreviewModal
 * - Muestra el avatar en grande
 * - Permite seleccionar una nueva imagen (file input)
 * - Sube la imagen y actualiza el perfil del usuario
 */
function AvatarPreviewModal({
  open,
  onClose,
  currentUrl,
  onUpdated,
}: {
  open: boolean;
  onClose: () => void;
  currentUrl?: string | null;
  onUpdated: (newUrl: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = ev.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const results = await uploadImages([file], "users/avatars");

      const first = results?.[0] || {};
      const newUrl = first.fileUrl as string | undefined;

      if (!newUrl) {
        throw new Error("No se recibió la url de la imagen desde el servidor");
      }

      await updateUserProfile({ photoFileUrl: newUrl });

      onUpdated(newUrl);
      setUploading(false);
      onClose();
    } catch {
      setUploading(false);
      setError("Error subiendo la imagen, intentalo de nuevo.");
    }
  };

  const triggerSelect = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Foto de perfil
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <Box
          sx={{
            width: 220,
            height: 220,
            borderRadius: "50%",
            overflow: "hidden",
            boxShadow: 3,
          }}
        >
          <img
            src={preview || currentUrl || undefined}
            alt="Avatar preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        <Typography variant="body2">
          Haz click en "Seleccionar foto" para elegir una nueva imagen.
        </Typography>

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={uploading}>
          Cancelar
        </Button>

        <Box sx={{ position: "relative" }}>
          <Button
            startIcon={<PhotoCamera />}
            onClick={triggerSelect}
            variant="contained"
            disabled={uploading}
          >
            Seleccionar foto
          </Button>
          {uploading && (
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                ml: -1.5,
                mt: -1.5,
              }}
            />
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default function ProfileDetails({ user }: Props) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAvatarModal, setOpenAvatarModal] = useState(false);
  const [localPhotoUrl, setLocalPhotoUrl] = useState<string | null>(
    user.photoFileUrl || null,
  );
  const [localUser, setLocalUser] = useState<User>(user);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  const handleUpdated = (partial: Partial<User>) => {
    setLocalUser((prev) => ({ ...prev, ...partial }) as User);
  };

  return (
    <Box>
      <Grid container spacing={4} alignItems="center">
        <Grid>
          <Box
            sx={{
              position: "relative",
              display: "inline-block",
              cursor: "pointer",
            }}
          >
            <Avatar
              src={localPhotoUrl || undefined}
              alt={user.name}
              sx={{ width: 120, height: 120 }}
              onClick={() => setOpenAvatarModal(true)}
            />
            <IconButton
              size="small"
              onClick={() => setOpenAvatarModal(true)}
              sx={{
                position: "absolute",
                right: -6,
                bottom: -6,
                bgcolor: "background.paper",
              }}
              aria-label="Editar foto"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        </Grid>

        <Grid>
          <Grid>
            <Typography variant="h5" fontWeight="bold">
              {localUser.name}
            </Typography>

            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <EmailIcon fontSize="small" />
              <Typography>{user.email}</Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <PhoneIcon fontSize="small" />
              <Typography>
                {localUser.phone || "Sin número telefónico"}
              </Typography>
              {user.verifiedPhone && (
                <Chip
                  label="Teléfono verificado"
                  size="small"
                  icon={<VerifiedIcon fontSize="small" />}
                />
              )}
            </Box>

            {user.role === UserRole.Admin && (
              <Chip
                icon={<VerifiedIcon />}
                label="Administrador"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Grid>

          <Grid>
            <Button
              startIcon={<EditIcon />}
              variant="contained"
              onClick={() => setOpenEditModal(true)}
              sx={{ marginTop: 4 }}
            >
              Editar perfil
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {user.role === UserRole.User && (
        <Box>
          <RentPromptSection />
        </Box>
      )}

      <EditProfileModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        defaultValues={localUser}
        onUpdated={handleUpdated}
      />

      <AvatarPreviewModal
        open={openAvatarModal}
        onClose={() => setOpenAvatarModal(false)}
        currentUrl={localPhotoUrl}
        onUpdated={(newUrl) => setLocalPhotoUrl(newUrl)}
      />

      <LogoutButton />
      <br />
      <br />
      <br />
    </Box>
  );
}
