import React, { useState } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { FormDataCreateEnv } from "@/types/Environments";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface ServicesAreasFormProps {
  formData: FormDataCreateEnv;
  setFormData: (value: React.SetStateAction<FormDataCreateEnv>) => void;
  handleServiceChange: (e: SelectChangeEvent<string[]>) => void;
}

const ServicesAreasForm: React.FC<ServicesAreasFormProps> = ({
  formData,
  setFormData,
  handleServiceChange,
}) => {
  const { areas, services } = useSelector((state: RootState) => state.options);
  const [areaModalOpen, setAreaModalOpen] = useState(false);

  const handleAreasChange = (e: SelectChangeEvent<string[]>) => {
    const selected = e.target.value as string[];
    const updated = selected.map((key) => {
      const existing = formData.areas.find((a) => a.AreaPublicKey === key);
      return {
        AreaPublicKey: key,
        Quantity: existing?.Quantity ?? 1,
      };
    });
    setFormData((prev) => ({ ...prev, areas: updated }));
  };

  const updateAreaQuantity = (key: string, quantity: number) => {
    const updated = formData.areas.map((a) =>
      a.AreaPublicKey === key ? { ...a, Quantity: quantity } : a,
    );
    setFormData((prev) => ({ ...prev, areas: updated }));
  };

  return (
    <Box>
      <Typography variant="h6">Servicios y Áreas Disponibles</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Indica qué servicios y áreas adicionales están disponibles en el
        ambiente.
      </Typography>

      {/* SERVICIOS */}
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Servicios</InputLabel>
        <Select
          multiple
          name="servicePublicKeys"
          value={formData.servicePublicKeys}
          onChange={handleServiceChange}
          input={<OutlinedInput label="Servicios" />}
          renderValue={() => ""}
        >
          {services.map((s) => (
            <MenuItem key={s.publicKey} value={s.publicKey}>
              <Checkbox
                checked={formData.servicePublicKeys.includes(s.publicKey)}
              />
              <ListItemText primary={s.name} />
            </MenuItem>
          ))}
        </Select>
        <Typography variant="body2" mt={1}>
          {formData.servicePublicKeys
            .map((key) => services.find((s) => s.publicKey === key)?.name)
            .filter(Boolean)
            .join(", ") || "Ningún servicio seleccionado"}
        </Typography>
      </FormControl>

      {/* ÁREAS */}
      <FormControl fullWidth sx={{ mt: 3 }}>
        <InputLabel>Áreas</InputLabel>
        <Select
          multiple
          name="areas"
          value={formData.areas.map((a) => a.AreaPublicKey)}
          onChange={handleAreasChange}
          input={<OutlinedInput label="Áreas" />}
          renderValue={() => ""}
        >
          {areas.map((a) => (
            <MenuItem key={a.publicKey} value={a.publicKey}>
              <Checkbox
                checked={formData.areas.some(
                  (ar) => ar.AreaPublicKey === a.publicKey,
                )}
              />
              <ListItemText primary={a.name} />
            </MenuItem>
          ))}
        </Select>
        <Typography variant="body2" mt={1}>
          {formData.areas
            .map((a) => {
              const area = areas.find((ar) => ar.publicKey === a.AreaPublicKey);
              return area ? `${area.name} (x${a.Quantity})` : "";
            })
            .filter(Boolean)
            .join(", ") || "Ninguna área seleccionada"}
        </Typography>
        {formData.areas.length > 0 && (
          <Button onClick={() => setAreaModalOpen(true)} sx={{ mt: 1 }}>
            Configurar cantidades por área
          </Button>
        )}
      </FormControl>

      {/* MODAL PARA CANTIDADES */}
      <Modal open={areaModalOpen} onClose={() => setAreaModalOpen(false)}>
        <Box
          sx={{
            p: 3,
            m: "auto",
            mt: "10%",
            maxWidth: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" mb={2}>
            Cantidad por Área
          </Typography>
          {formData.areas.map((a) => {
            const area = areas.find((ar) => ar.publicKey === a.AreaPublicKey);
            return (
              <Box key={a.AreaPublicKey} mb={2}>
                <Typography>{area?.name}</Typography>
                <TextField
                  type="number"
                  fullWidth
                  value={a.Quantity}
                  onChange={(e) =>
                    updateAreaQuantity(a.AreaPublicKey, Number(e.target.value))
                  }
                  inputProps={{ min: 1 }}
                />
              </Box>
            );
          })}
          <Button
            variant="contained"
            fullWidth
            onClick={() => setAreaModalOpen(false)}
          >
            Listo
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ServicesAreasForm;
