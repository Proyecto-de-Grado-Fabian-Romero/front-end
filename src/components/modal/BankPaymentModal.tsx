"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function BankPaymentModal({ open, onClose }: Props) {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [bankName, setBankName] = useState("");

  const handleSubmit = async () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Editar Datos Bancarios</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Número de cuenta"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          fullWidth
        />
        <TextField
          label="Titular de la cuenta"
          value={accountHolder}
          onChange={(e) => setAccountHolder(e.target.value)}
          fullWidth
        />
        <TextField
          label="Banco"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
