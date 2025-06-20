"use client";

import { Paper, Typography, Box, Snackbar, Alert } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserRole } from "@/types/Users";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createBankPayment,
  updateBankPayment,
} from "@/services/bankPaymentService";
import { BankPaymentData } from "@/types/BankPaymentData";
import BankPaymentForm from "../form/BankPaymentForm";

export default function BankInfoClient() {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user.role !== UserRole.Owner) {
      router.replace("/");
    }
  }, [user.role, router]);

  const handleSubmit = async (data: BankPaymentData) => {
    setLoading(true);
    setError(null);

    try {
      if (user.bankPaymentData) {
        await updateBankPayment(data);
      } else {
        await createBankPayment(data);
      }
      setSuccess(true);
      setTimeout(() => router.push("/profile"), 1500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 500, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {user?.bankPaymentData
            ? "Actualizar Datos Bancarios"
            : "Agregar Datos Bancarios"}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Esta información se utilizará para transferirte tus ingresos por
          reservas. Asegúrate de que sea correcta.
        </Typography>

        <BankPaymentForm
          initialValues={user?.bankPaymentData}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
        />

        <Snackbar open={success} autoHideDuration={2000}>
          <Alert severity="success" variant="filled">
            Datos guardados correctamente
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
