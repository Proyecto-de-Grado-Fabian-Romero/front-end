import React from "react";
import ImageUploader from "@/components/inputs/form/InputUploader";
import { FormDataCreateEnv } from "@/types/Environments";
import { Box, Typography } from "@mui/material";

interface ImagesFormProps {
  formData: FormDataCreateEnv;
  setFormData: (value: React.SetStateAction<FormDataCreateEnv>) => void;
}

const ImagesForm: React.FC<ImagesFormProps> = ({ formData, setFormData }) => {
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
    </Box>
  );
};

export default ImagesForm;
