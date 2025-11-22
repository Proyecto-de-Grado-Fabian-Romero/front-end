import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import React from "react";

type Props = {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmUploadDialog: React.FC<Props> = ({
  open,
  loading,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Subir Recorrido Virtual</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que quieres subir el recorrido virtual? Esta acción
          no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? "Subiendo..." : "Confirmar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmUploadDialog;
