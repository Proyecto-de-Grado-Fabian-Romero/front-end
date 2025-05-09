"use client";

import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { UploadImageResult } from "@/types/UploadImageResult";
import SceneThumbnailSelector from "./SceneThumbnailSelector";

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
    <Box textAlign="center" sx={{ maxWidth: 900, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Aún no has añadido ninguna escena. Selecciona una imagen:
      </Typography>

      <SceneThumbnailSelector
        scenes={uploadedImages.map((img) => ({
          id: img.fileId,
          name: img.fileName,
          fileId: img.fileId,
          fileName: img.fileName,
          fileUrl: img.fileUrl,
          pois: [],
        }))}
        selectedId={selectedImageId}
        onSelect={setSelectedImageId}
      />

      <Box sx={{ mt: 4 }}>
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
