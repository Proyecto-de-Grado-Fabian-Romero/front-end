import React from "react";
import ImageUploader from "@/components/inputs/form/InputUploader";
import { FormDataCreateEnv } from "@/types/Environments";
import { Box, IconButton, Typography } from "@mui/material";
import { Photo } from "@/types/GetEnvironment";
import { Delete } from "@mui/icons-material";

interface ImagesFormProps {
  formData: FormDataCreateEnv;
  setFormData: React.Dispatch<React.SetStateAction<FormDataCreateEnv>>;
  existingPhotos: Photo[];
  onDeleteExisting: (fileId: string) => void;
}

const ImagesForm: React.FC<ImagesFormProps> = ({
  formData,
  setFormData,
  existingPhotos,
  onDeleteExisting,
}) => {
  return (
    <Box>
      <Typography variant="h6">Galería de Imágenes</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Sube imágenes representativas del ambiente.
      </Typography>

      {/* Galería de existentes */}
      {existingPhotos.length > 0 && (
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
          {existingPhotos.map((p) => (
            <Box key={p.fileId} sx={{ width: 140 }}>
              <img
                src={p.url}
                alt={p.fileName}
                style={{ width: "100%", borderRadius: 8 }}
              />
              <IconButton onClick={() => onDeleteExisting(p.fileId)}>
                <Delete />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* Uploader de nuevas */}
      <ImageUploader
        images={formData.images} // File[]
        setImages={(newImages) =>
          setFormData((prev) => ({ ...prev, images: newImages }))
        }
      />
    </Box>
  );
};

export default ImagesForm;
