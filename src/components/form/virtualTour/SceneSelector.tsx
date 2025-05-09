"use client";

import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { UploadImageResult } from "@/types/UploadImageResult";

type Props = {
  uploadedImages: UploadImageResult[];
  selectedImageId: string;
  setSelectedImageId: (id: string) => void;
  onAddScene: () => void;
};

const SceneSelector: React.FC<Props> = ({
  uploadedImages,
  selectedImageId,
  setSelectedImageId,
  onAddScene,
}) => {
  return (
    <Box textAlign="center">
      <Typography variant="h6" gutterBottom>
        Aún no has añadido ninguna escena.
      </Typography>

      <FormControl sx={{ mt: 2, minWidth: 300 }}>
        <InputLabel id="image-select-label">
          Selecciona una imagen 360°
        </InputLabel>
        <Select
          labelId="image-select-label"
          value={selectedImageId}
          label="Selecciona una imagen 360°"
          onChange={(e) => setSelectedImageId(e.target.value)}
        >
          {uploadedImages.map((img) => (
            <MenuItem key={img.fileId} value={img.fileId}>
              {img.fileName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onAddScene}
          disabled={!selectedImageId}
        >
          Añadir primera escena
        </Button>
      </Box>
    </Box>
  );
};

export default SceneSelector;
