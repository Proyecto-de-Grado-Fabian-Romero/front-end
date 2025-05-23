import React from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { FormDataCreateEnv } from "@/types/Environments";

interface RentSettingFormProps {
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (e: SelectChangeEvent) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: FormDataCreateEnv;
}

const RentSettingForm: React.FC<RentSettingFormProps> = ({
  handleInputChange,
  handleSelectChange,
  handleCheckboxChange,
  formData,
}) => {
  return (
    <Box>
      <Typography variant="h6">Configuración de Alquiler</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Establece las condiciones mínimas y máximas para el alquiler de este
        ambiente.
      </Typography>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Unidad de Tiempo de Alquiler</InputLabel>
        <Select
          name="rentalUnit"
          value={formData.rentalUnit}
          onChange={handleSelectChange}
          input={<OutlinedInput label="Unidad de Alquiler" />}
        >
          <MenuItem value="Horas">Horas</MenuItem>
          <MenuItem value="Días">Días</MenuItem>
        </Select>
      </FormControl>
      <TextField
        name="minRentalTime"
        label="Tiempo mínimo de alquiler (en unidades seleccionadas)"
        placeholder="Ej: 2"
        type="number"
        fullWidth
        onChange={handleInputChange}
        sx={{ mt: 2 }}
      />
      <TextField
        name="maxRentalTime"
        label="Tiempo máximo de alquiler (en unidades seleccionadas)"
        placeholder="Ej: 8"
        type="number"
        fullWidth
        onChange={handleInputChange}
        sx={{ mt: 2 }}
      />
      <FormControlLabel
        sx={{ mt: 2 }}
        control={
          <Checkbox
            name="instantBooking"
            checked={formData.instantBooking}
            onChange={handleCheckboxChange}
          />
        }
        label="Permitir reservas instantáneas"
      />
    </Box>
  );
};

export default RentSettingForm;
