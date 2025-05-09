"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { UploadImageResult } from "@/types/UploadImageResult";
import { uploadImages } from "@/services/imagesService";
import ImageUploader from "../inputs/form/InputUploader";

interface Props {
  onUploadComplete: (results: UploadImageResult[]) => void;
  publicId: string;
}

const Upload360ImagesForm: React.FC<Props> = ({
  onUploadComplete,
  publicId,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (images.length === 0) {
      setError("Debes subir al menos una imagen.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const results = await uploadImages(
        images,
        `tours360/${crypto.randomUUID()}`,
      );
      onUploadComplete(results);
    } catch (err) {
      setError("Ocurrió un error al subir las imágenes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        mb: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Sube las imágenes panorámicas 360° para el recorrido virtual
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Puedes arrastrar y soltar archivos o hacer clic en el área para
        seleccionarlos desde tu dispositivo.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <ImageUploader images={images} setImages={setImages} />

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleUpload}
        disabled={loading}
        startIcon={loading && <CircularProgress size={18} />}
      >
        {loading ? "Subiendo..." : "Subir imágenes"}
      </Button>
    </Box>
  );
};

export default Upload360ImagesForm;
