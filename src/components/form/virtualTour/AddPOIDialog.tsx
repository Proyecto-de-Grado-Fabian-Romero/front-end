import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { Scene360 } from "@/types/Tour360";
import SceneThumbnailSelector from "./SceneThumbnailSelector";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (type: string, targetSceneId: string) => void;
  availableScenes: Scene360[];
  currentSceneId: string | null;
};

const AddPOIDialog: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  availableScenes,
  currentSceneId,
}) => {
  const [targetSceneId, setTargetSceneId] = useState("");

  const handleConfirm = () => {
    if (targetSceneId) {
      onConfirm("", targetSceneId);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Añadir Punto de Interés</DialogTitle>
      <DialogContent>
        <Typography sx={{ mt: 3, mb: 1 }}>Escoge la escena destino:</Typography>

        <SceneThumbnailSelector
          scenes={availableScenes}
          selectedId={targetSceneId}
          onSelect={setTargetSceneId}
          excludeId={currentSceneId ?? undefined}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!targetSceneId}
        >
          Añadir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPOIDialog;
