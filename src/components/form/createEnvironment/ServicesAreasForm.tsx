import React from "react";
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

  return (
    <Box>
      <Typography variant="h6">Servicios y Áreas Disponibles</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Indica qué servicios y áreas adicionales están disponibles en el
        ambiente.
      </Typography>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Servicios</InputLabel>
        <Select
          multiple
          name="servicePublicKeys"
          value={formData.servicePublicKeys}
          onChange={handleServiceChange}
          input={<OutlinedInput label="Servicios" />}
          renderValue={(selected) =>
            (selected as string[])
              .map(
                (key) => services.find((s) => s.publicKey === key)?.name ?? ""
              )
              .join(", ")
          }
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
      </FormControl>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Áreas</InputLabel>
        <Select
          multiple
          name="areas"
          value={formData.areas.map((a) => a.AreaPublicKey)}
          onChange={(e) => {
            const selected = [...e.target.value] as string[];
            const updated = selected.map((key) => ({
              AreaPublicKey: key,
              Quantity: 1,
            }));
            setFormData((prev) => ({ ...prev, areas: updated }));
          }}
          input={<OutlinedInput label="Áreas" />}
          renderValue={(selected) =>
            (selected as string[])
              .map((key) => areas.find((s) => s.publicKey === key)?.name ?? "")
              .join(", ")
          }
        >
          {areas.map((a) => (
            <MenuItem key={a.publicKey} value={a.publicKey}>
              <Checkbox
                checked={formData.areas.some(
                  (ar) => ar.AreaPublicKey === a.publicKey
                )}
              />
              <ListItemText primary={a.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ServicesAreasForm;
