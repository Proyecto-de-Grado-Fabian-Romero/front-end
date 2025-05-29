import React from "react";
import ImageUploader from "@/components/inputs/form/InputUploader";
import { FormDataCreateEnv } from "@/types/Environments";
import {
  Box,
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  Switch,
  Typography,
} from "@mui/material";

interface ImagesFormProps {
  formData: FormDataCreateEnv;
  setFormData: (value: React.SetStateAction<FormDataCreateEnv>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImagesForm: React.FC<ImagesFormProps> = ({
  formData,
  setFormData,
  handleCheckboxChange,
}) => {
  return (
    <Box>
      <Typography variant="h6">Galería de Imágenes</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Sube imágenes representativas del ambiente.
      </Typography>
      <ImageUploader
        images={formData.images}
        setImages={(newImages) =>
          setFormData((prev) => ({ ...prev, images: newImages }))
        }
      />

      <br />
      <br />
      <hr />
      <FormControl component="fieldset" variant="standard" sx={{ mt: 3 }}>
        <FormLabel
          component="legend"
          sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
        >
          Tour Virtual 360°
        </FormLabel>
        <FormGroup>
          <Switch
            name="request360Tour"
            checked={formData.request360Tour}
            onChange={handleCheckboxChange}
            color="secondary"
          />
        </FormGroup>
        <FormHelperText>
          Activa esta opción si deseas solicitar la creación de un Tour Virtual
          360° del ambiente.
        </FormHelperText>
      </FormControl>
    </Box>
  );
};

export default ImagesForm;
