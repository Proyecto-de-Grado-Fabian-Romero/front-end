"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { getEnvironmentByPublicId } from "@/services/environmentService";
import { CLASS_ID_TO_NAME, OBJECT_ICONS } from "@/utils/constants/class-names";

type Props = {
  open: boolean;
  onClose: () => void;
  publicId: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_ENVIRONMENTS_URL ?? "";

const EquipmentModal: React.FC<Props> = ({ open, onClose, publicId }) => {
  const [equipment, setEquipment] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const env = await getEnvironmentByPublicId(publicId);
        setEquipment(JSON.parse(env.equipment || "{}"));
      } catch {
        setError("No se pudo cargar el equipamiento.");
      } finally {
        setLoading(false);
      }
    };
    if (open) fetchData();
  }, [open, publicId]);

  const handleIncrease = (id: string) => {
    setEquipment((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrease = (id: string) => {
    setEquipment((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [id]: current - 1,
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(
        `${API_BASE}/api/environments/${publicId}/detected-objects`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ detectedObjects: equipment }),
        },
      );

      if (!res.ok) throw new Error("Error al guardar el equipamiento");

      onClose();
    } catch {
      setError("Hubo un problema al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Editar Equipamiento</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} mt={1}>
            {Object.keys(CLASS_ID_TO_NAME).map((id) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={id}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6">{OBJECT_ICONS[id]}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {CLASS_ID_TO_NAME[id]}
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mt={1}
                  >
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDecrease(id)}
                    >
                      <Remove />
                    </IconButton>
                    <Typography variant="body1" sx={{ mx: 1 }}>
                      {equipment[id] || 0}
                    </Typography>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleIncrease(id)}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={saving}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={saving}
        >
          {saving ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            "Enviar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EquipmentModal;
