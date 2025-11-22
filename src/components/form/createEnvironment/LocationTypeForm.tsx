import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { FormDataCreateEnv } from "@/types/Environments";
import { cities, environments } from "@/utils/constants/constants";

interface LocationTypeFormProps {
  handleSelectChange: (e: SelectChangeEvent) => void;
  formData: FormDataCreateEnv;
}

const LocationTypeForm: React.FC<LocationTypeFormProps> = ({
  formData,
  handleSelectChange,
}) => {
  return (
    <Box sx={{ maxWidth: "800px", width: "100%" }}>
      <Typography variant="h6">Ubicación y Tipo de Ambiente</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Selecciona la ubicación y la categoría a la que pertenece el ambiente.
      </Typography>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Ubicación</InputLabel>
        <Select
          name="location"
          value={formData.location}
          onChange={handleSelectChange}
          input={<OutlinedInput label="Ubicación" />}
        >
          {cities.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Tipo de Ambiente</InputLabel>
        <Select
          name="typePublicKey"
          value={formData.typePublicKey}
          onChange={handleSelectChange}
          input={<OutlinedInput label="Tipo de Ambiente" />}
        >
          {environments.map((env) => (
            <MenuItem key={env.key} value={env.key}>
              {env.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LocationTypeForm;
