"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import { Scene360, POI } from "@/types/Tour360";
import SceneSelector from "./SceneSelector";
import ScenePreview from "./ScenePreview";
import AddPOIDialog from "./AddPOIDialog";
import { UploadImageResult } from "@/types/UploadImageResult";

type Props = {
  uploadedImages: UploadImageResult[];
};

const CreateVirtualTourForm = ({ uploadedImages }: Props) => {
  const [scenes, setScenes] = useState<Scene360[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string>("");

  const [clickedPosition, setClickedPosition] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleSceneClick = (position: string) => {
    setClickedPosition(position);
    setDialogOpen(true);
  };

  const handleConfirmPOI = (type: string, targetFileId: string) => {
    const currentScene = scenes[0];
    const targetScene = scenes.find((scene) => scene.fileId === targetFileId);
    if (!currentScene || !clickedPosition || !targetScene) return;

    const newPOI: POI = {
      position: clickedPosition,
      text: type,
      sceneId: targetScene.id,
    };

    const updatedScene = {
      ...currentScene,
      pois: [...currentScene.pois, newPOI],
    };

    setScenes([updatedScene]);
    setDialogOpen(false);
    setClickedPosition(null);
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
        <>
          <ScenePreview scene={scenes[0]} onSceneClick={handleSceneClick} />
          <AddPOIDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onConfirm={handleConfirmPOI}
            availableScenes={uploadedImages}
          />
        </>
      )}
    </Box>
  );
};

export default CreateVirtualTourForm;
