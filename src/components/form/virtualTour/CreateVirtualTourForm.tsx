"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Scene360, POI } from "@/types/Tour360";
import SceneSelector from "./SceneSelector";
import ScenePreview from "./ScenePreview";
import AddPOIDialog from "./AddPOIDialog";
import POIActionDialog from "./POIActionDialog";
import { UploadImageResult } from "@/types/UploadImageResult";
import SceneThumbnailSelector from "./SceneThumbnailSelector";

type Props = {
  uploadedImages: UploadImageResult[];
};

const CreateVirtualTourForm = ({ uploadedImages }: Props) => {
  const [scenes, setScenes] = useState<Scene360[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string>("");

  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);

  const [clickedPosition, setClickedPosition] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activePOI, setActivePOI] = useState<POI | null>(null);
  const [poiDialogOpen, setPOIDialogOpen] = useState(false);

  useEffect(() => {
    const generatedScenes: Scene360[] = uploadedImages.map((img) => ({
      id: crypto.randomUUID(),
      name: img.fileName,
      fileId: img.fileId,
      fileName: img.fileName,
      fileUrl: img.fileUrl,
      pois: [],
    }));

    setScenes(generatedScenes);
    if (generatedScenes.length > 0) {
      setActiveSceneId(generatedScenes[0].id);
    }
  }, [uploadedImages]);

  const handleAddScene = () => {
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

    const updatedScenes = [...scenes, newScene];
    setScenes(updatedScenes);
    setActiveSceneId(newScene.id);
    setSelectedImageId("");
  };

  const handleSceneClick = (position: string) => {
    setClickedPosition(position);
    setDialogOpen(true);
  };

  const handleConfirmPOI = (type: string, targetId: string) => {
    if (!clickedPosition || !activeSceneId) return;

    const targetScene = scenes.find((s) => s.id === targetId);
    if (!targetScene) return;

    const newPOI: POI = {
      position: clickedPosition,
      text: type,
      sceneId: targetScene.id,
    };

    const updatedScenes = scenes.map((scene) =>
      scene.id === activeSceneId
        ? { ...scene, pois: [...scene.pois, newPOI] }
        : scene,
    );

    setScenes(updatedScenes);
    setDialogOpen(false);
    setClickedPosition(null);
  };

  const handlePOIClick = (poi: POI) => {
    setActivePOI(poi);
    setPOIDialogOpen(true);
  };

  const handleDeletePOI = (poiToDelete: POI) => {
    const updatedScenes = scenes.map((scene) =>
      scene.id === activeSceneId
        ? {
            ...scene,
            pois: scene.pois.filter((poi) => poi !== poiToDelete),
          }
        : scene,
    );

    setScenes(updatedScenes);
    setPOIDialogOpen(false);
  };

  const handleNavigateToScene = (poi: POI) => {
    const target = scenes.find((s) => s.id === poi.sceneId);
    if (target) setActiveSceneId(target.id);
    setPOIDialogOpen(false);
  };

  const activeScene = scenes.find((s) => s.id === activeSceneId);

  return (
    <Box sx={{ mt: 4, width: "100%", maxWidth: 1200 }}>
      {scenes.length === 0 ? (
        <SceneSelector
          uploadedImages={uploadedImages}
          selectedImageId={selectedImageId}
          setSelectedImageId={setSelectedImageId}
          onAddScene={handleAddScene}
        />
      ) : (
        <Box sx={{ width: "100%" }}>
          <SceneThumbnailSelector
            scenes={scenes}
            selectedId={activeSceneId}
            onSelect={setActiveSceneId}
            layout="horizontal"
          />

          {activeScene && (
            <ScenePreview
              scene={activeScene}
              onSceneClick={handleSceneClick}
              onPOIClick={handlePOIClick}
            />
          )}

          <AddPOIDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onConfirm={handleConfirmPOI}
            availableScenes={scenes}
            currentSceneId={activeSceneId}
          />

          <POIActionDialog
            open={poiDialogOpen}
            onClose={() => setPOIDialogOpen(false)}
            onDelete={handleDeletePOI}
            onNavigate={handleNavigateToScene}
            poi={activePOI}
          />
        </Box>
      )}
    </Box>
  );
};

export default CreateVirtualTourForm;
