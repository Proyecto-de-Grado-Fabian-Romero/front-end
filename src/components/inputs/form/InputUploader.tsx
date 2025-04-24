import React, { useRef } from "react";
import { Box, Typography, Grid, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

interface ImageUploaderProps {
  images: File[];
  setImages: (files: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, setImages }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setImages([...images, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };

  return (
    <>
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleFileClick}
        sx={{
          border: "2px dashed gray",
          borderRadius: 2,
          p: 2,
          mt: 2,
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <Typography>
          Arrastra tus imágenes aquí o haz clic para subir
        </Typography>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          multiple
          onChange={handleFileChange}
        />
      </Box>

      {images.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {images.map((file, index) => (
            <Grid key={index}>
              <Box
                sx={{
                  position: "relative",
                  width: 100,
                  height: 100,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #ccc",
                }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <IconButton
                  size="small"
                  sx={{ position: "absolute", top: 0, right: 0 }}
                  onClick={() => removeImage(index)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default ImageUploader;
