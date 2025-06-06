"use client";

import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { Scene360, POI } from "@/types/Tour360";
import SceneSelector from "./SceneSelector";
import ScenePreview from "./ScenePreview";
import AddPOIDialog from "./AddPOIDialog";
import POIActionDialog from "./POIActionDialog";
import { UploadImageResult } from "@/types/UploadImageResult";
import SceneThumbnailSelector from "./SceneThumbnailSelector";
import { useRouter } from "next/navigation";
import ConfirmUploadDialog from "./ConfirmUploadDialog";
import { PageRoutes } from "@/utils/constants/page-routes";
import { uploadVirtualTour } from "@/services/adminService";

type Props = {
  uploadedImages: UploadImageResult[];
  environmentPublicId: string;
};

const CreateVirtualTourForm = ({
  uploadedImages,
  environmentPublicId,
}: Props) => {
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

  const router = useRouter();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    try {
      setUploading(true);
      await uploadVirtualTour(environmentPublicId, scenes);

      setConfirmDialogOpen(false);
      router.push(`${PageRoutes.Environment_Details}/${environmentPublicId}`);
    } catch {
      alert("No se pudo subir el recorrido virtual. Intenta de nuevo");
    } finally {
      setUploading(false);
    }
  };

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

          <Box textAlign="right" sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setConfirmDialogOpen(true)}
              disabled={scenes.length === 0}
            >
              Subir Recorrido Virtual
            </Button>
          </Box>

          <ConfirmUploadDialog
            open={confirmDialogOpen}
            loading={uploading}
            onClose={() => setConfirmDialogOpen(false)}
            onConfirm={handleUpload}
          />
        </Box>
      )}
    </Box>
  );
};

export default CreateVirtualTourForm;
