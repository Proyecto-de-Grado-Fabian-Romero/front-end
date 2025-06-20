import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { UserState as User } from "@/types/Users";
import { updateUserProfile } from "@/services/authService";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultValues: User;
}

export default function EditProfileModal({
  open,
  onClose,
  defaultValues,
}: Props) {
  const [name, setName] = useState(defaultValues.name || "");
  const [phone, setPhone] = useState(defaultValues.phone || "");
  const [photoUrl, setPhotoUrl] = useState(defaultValues.photoFileUrl || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateUserProfile({ name, phone, photoFileUrl: photoUrl });
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar perfil</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Nombre"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Teléfono"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            label="Foto (URL)"
            fullWidth
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
