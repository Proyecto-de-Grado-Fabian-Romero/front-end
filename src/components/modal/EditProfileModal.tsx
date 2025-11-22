import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { UserState as User } from "@/types/Users";
import { updateUserProfile } from "@/services/authService";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultValues: User;
  onUpdated?: (partial: Partial<User>) => void;
}

export default function EditProfileModal({
  open,
  onClose,
  defaultValues,
  onUpdated,
}: Props) {
  const [name, setName] = useState(defaultValues.name || "");
  const [phone, setPhone] = useState(defaultValues.phone || "");
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);

  // Sincronizar cuando defaultValues cambie (evita valores stale)
  useEffect(() => {
    setName(defaultValues.name || "");
    setPhone(defaultValues.phone || "");
  }, [defaultValues]);

  // mounted guard para evitar setState después de un unmount
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload: { name?: string; phone?: string; photoFileUrl?: string } =
        {
          name,
          phone,
          photoFileUrl: defaultValues.photoFileUrl,
        };

      await updateUserProfile(payload);

      // Si tu backend devuelve el usuario actualizado como body, podrías usar `result`.
      // Pero para compatibilidad, mandamos el partial que actualizamos.
      if (onUpdated)
        onUpdated({ name, phone, photoFileUrl: defaultValues.photoFileUrl });
      // Cerrar modal
      onClose();
    } catch (error) {
      console.error("Error updating profile", error);
      // Opcional: mostrar snackbar o mensaje de error
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose()}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Editar perfil</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Nombre"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          <TextField
            label="Teléfono"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? (
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <CircularProgress size={18} />
              Guardando...
            </span>
          ) : (
            "Guardar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
