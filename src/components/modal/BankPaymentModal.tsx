"use client";

import { Dialog, DialogTitle, Box, Typography } from "@mui/material";
import { useState } from "react";
import {
  createBankPayment,
  updateBankPayment,
} from "@/services/bankPaymentService";
import { BankPaymentData } from "@/types/BankPaymentData";
import BankPaymentForm from "../form/BankPaymentForm";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (payload: BankPaymentData) => {
    setLoading(true);
    setError(null);

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
      {mode === "create" && (
        <Box
          sx={{
            backgroundColor: "#f1f1f1",
            borderRadius: 2,
            padding: 2,
            fontSize: "0.9rem",
            color: "#444",
          }}
        >
          <Typography fontWeight={500}>
            Para convertirte en propietario y comenzar a publicar tus ambientes
            en Spacio, por favor completa tus datos bancarios. Esta información
            será utilizada para transferirte tus ingresos generados por las
            reservas que recibas.
          </Typography>
        </Box>
      )}

      <DialogTitle>
        {mode === "update"
          ? "Actualizar Datos Bancarios"
          : "Agregar Datos Bancarios"}
      </DialogTitle>
      <BankPaymentForm
        initialValues={defaultValues}
        loading={loading}
        error={error}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </Dialog>
  );
}
