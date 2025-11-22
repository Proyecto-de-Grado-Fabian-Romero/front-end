import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  Typography,
} from "@mui/material";
import { POI } from "@/types/Tour360";

type Props = {
  open: boolean;
  onClose: () => void;
  onNavigate: (poi: POI) => void;
  onDelete: (poi: POI) => void;
  poi: POI | null;
};

const POIActionDialog: React.FC<Props> = ({
  open,
  onClose,
  onNavigate,
  onDelete,
  poi,
}) => {
  if (!poi) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Punto de Interés</DialogTitle>
      <DialogContent>
        <Typography>¿Qué deseas hacer con este punto?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onNavigate(poi)}>Navegar</Button>
        <Button onClick={() => onDelete(poi)} color="error">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default POIActionDialog;
