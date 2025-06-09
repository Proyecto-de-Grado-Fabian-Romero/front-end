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
import {
  createBankPayment,
  updateBankPayment,
} from "@/services/bankPaymentService";
import { BankPaymentData } from "@/types/BankPaymentData";

type Props = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "update";
  defaultValues?: Partial<BankPaymentData>;
};

export default function BankPaymentModal({
  open,
  onClose,
  mode,
  defaultValues,
}: Props) {
  const [accountNumber, setAccountNumber] = useState(
    defaultValues?.bankAccountNumber || "",
  );
  const [accountHolder, setAccountHolder] = useState(
    defaultValues?.bankAccountHolder || "",
  );
  const [bankName, setBankName] = useState(defaultValues?.bankName || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    const payload: BankPaymentData = {
      bankAccountNumber: accountNumber,
      bankAccountHolder: accountHolder,
      bankName,
    };

    try {
      if (mode === "update") {
        await updateBankPayment(payload);
      } else {
        await createBankPayment(payload);
      }
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {mode === "update"
          ? "Actualizar Datos Bancarios"
          : "Agregar Datos Bancarios"}
      </DialogTitle>
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
        {error && (
          <p style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
            {error}
          </p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !accountNumber || !accountHolder || !bankName}
        >
          {mode === "update" ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
