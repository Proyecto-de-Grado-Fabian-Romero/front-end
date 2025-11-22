import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { type FormDataCreateEnv } from "@/types/Environments";

interface GeneralInfoFormProps {
  formData: FormDataCreateEnv;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const GeneralInfoForm: React.FC<GeneralInfoFormProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <Box>
      <Typography variant="h6">Información General</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Define el nombre, descripción y capacidad del ambiente.
      </Typography>

      <TextField
        name="title"
        label="Nombre del Ambiente"
        placeholder="Ej: Sala de Conferencias"
        fullWidth
        value={formData.title}
        onChange={handleInputChange}
        required
        sx={{ mt: 2 }}
      />

      <TextField
        name="description"
        label="Descripción del Ambiente"
        placeholder="Ej: Amplia sala equipada con proyectores, sonido envolvente y aire acondicionado."
        fullWidth
        multiline
        rows={4}
        value={formData.description}
        onChange={handleInputChange}
        required
        sx={{ mt: 2 }}
      />

      <TextField
        name="capacity"
        label="Capacidad Máxima (personas)"
        placeholder="Ej: 50"
        type="number"
        fullWidth
        value={formData.capacity}
        onChange={handleInputChange}
        sx={{ mt: 2 }}
        required
      />
    </Box>
  );
};

export default GeneralInfoForm;
