"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import { Scene360 } from "@/types/Tour360";
import SceneSelector from "./SceneSelector";
import ScenePreview from "./ScenePreview";
import { UploadImageResult } from "@/types/UploadImageResult";

type Props = {
  uploadedImages: UploadImageResult[];
};

const CreateVirtualTourForm = ({ uploadedImages }: Props) => {
  const [scenes, setScenes] = useState<Scene360[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string>("");

  const handleAddFirstScene = () => {
    const image = uploadedImages.find((img) => img.fileId === selectedImageId);
    if (!image) return;

    const newScene: Scene360 = {
      id: crypto.randomUUID(),
      name: "",
      fileId: image.fileId,
      fileName: image.fileName,
      fileUrl: image.fileUrl,
      pois: [],
    };

    setScenes([newScene]);
    setSelectedImageId("");
  };

  return (
    <Box sx={{ mt: 4 }}>
      {scenes.length === 0 ? (
        <SceneSelector
          uploadedImages={uploadedImages}
          selectedImageId={selectedImageId}
          setSelectedImageId={setSelectedImageId}
          onAddScene={handleAddFirstScene}
        />
      ) : (
        <ScenePreview scene={scenes[0]} />
      )}
    </Box>
  );
};

export default CreateVirtualTourForm;
