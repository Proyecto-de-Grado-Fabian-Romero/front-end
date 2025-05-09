import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { UploadImageResult } from "@/types/UploadImageResult";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (type: string, targetSceneId: string) => void;
  availableScenes: UploadImageResult[];
};

const AddPOIDialog: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  availableScenes,
}) => {
  const [type, setType] = React.useState("ground");
  const [targetSceneId, setTargetSceneId] = React.useState("");

  const handleConfirm = () => {
    if (targetSceneId) {
      onConfirm(type, targetSceneId);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Añadir Punto de Interés</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Tipo</InputLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <MenuItem value="ground">Caminar / Suelo</MenuItem>
            <MenuItem value="door">Puerta / Entrada</MenuItem>
            <MenuItem value="other">Otro</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Escena destino</InputLabel>
          <Select
            value={targetSceneId}
            onChange={(e) => setTargetSceneId(e.target.value)}
          >
            {availableScenes.map((img) => (
              <MenuItem key={img.fileId} value={img.fileId}>
                {img.fileName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
