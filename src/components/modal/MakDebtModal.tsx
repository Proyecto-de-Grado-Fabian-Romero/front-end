import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

interface MarkDebtModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reference: string) => void;
}

const MarkDebtModal: React.FC<MarkDebtModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [reference, setReference] = useState<string>("");

  const handleSubmit = () => {
    onSubmit(reference);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ingrese los detalles del pago</DialogTitle>
      <DialogContent>
        <TextField
          label="Referencia de pago"
          multiline
          fullWidth
          rows={4}
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          helperText="Ingrese detalles como el número de transacción, nombre del banco, cuenta, etc."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit}>Confirmar Pago</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarkDebtModal;
