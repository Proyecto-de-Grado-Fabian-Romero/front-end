import React, { useEffect } from "react";
import {
  Box,
  FormControl,
  FormGroup,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Switch,
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
  setFormData: React.Dispatch<React.SetStateAction<FormDataCreateEnv>>;
}

const RentSettingForm: React.FC<RentSettingFormProps> = ({
  handleInputChange,
  handleSelectChange,
  handleCheckboxChange,
  formData,
  setFormData,
}) => {
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      rentalUnit: formData.typePublicKey === "hospedajes" ? "Días" : "Horas",
    }));
  }, [formData.typePublicKey]);

  return (
    <Box>
      <Typography variant="h6">Configuración de Alquiler</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Establece las condiciones mínimas y máximas para el alquiler de este
        ambiente.
      </Typography>
      <TextField
        name="minRentalTime"
        label={`Tiempo mínimo de alquiler (en ${formData.rentalUnit})`}
        placeholder="Ej: 2"
        type="number"
        fullWidth
        onChange={handleInputChange}
        sx={{ mt: 2 }}
      />
      <TextField
        name="maxRentalTime"
        label={`Tiempo máximo de alquiler (en ${formData.rentalUnit})`}
        placeholder="Ej: 8"
        type="number"
        fullWidth
        onChange={handleInputChange}
        sx={{ mt: 2 }}
      />
      <br />
      <br />
      <hr />
      <br />

      <FormControl component="fieldset" variant="standard">
        <Typography variant="h6">Reservas instantáneas</Typography>
        <FormGroup>
          <Switch
            name="instantBooking"
            checked={formData.instantBooking}
            onChange={handleCheckboxChange}
            color="primary"
          />
        </FormGroup>
        <FormHelperText>
          Permite a los usuarios reservar sin esperar confirmación
        </FormHelperText>
      </FormControl>
    </Box>
  );
};

export default RentSettingForm;
