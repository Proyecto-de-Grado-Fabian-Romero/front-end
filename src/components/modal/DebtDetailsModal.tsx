import React, { useEffect, useState } from "react";
import { Modal, Typography, CircularProgress, Paper } from "@mui/material";
import { getDebtDetails } from "@/services/adminService";
import { AdminDebt } from "@/types/Payments";

const DebtDetailsModal = ({
  open,
  onClose,
  debtId,
}: {
  open: boolean;
  onClose: () => void;
  debtId: string | null;
}) => {
  const [debt, setDebt] = useState<AdminDebt | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (debtId && open) {
      const fetchDebtDetails = async () => {
        try {
          const data = await getDebtDetails(debtId);
          setDebt(data);
        } catch {
          alert(
            "Hubo un error obteniendo los detalles del pago, recarga la página"
          );
        } finally {
          setLoading(false);
        }
      };
      fetchDebtDetails();
    }
  }, [debtId, open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Paper sx={{ p: 4, borderRadius: 4, maxWidth: 600, margin: "auto" }}>
        {loading ? (
          <CircularProgress />
        ) : !debt ? (
          <Typography>No se encontró el pago</Typography>
        ) : (
          <>
            <Typography variant="h6">Detalles de Deuda</Typography>
            <Typography variant="body1">
              Propietario: {debt.ownerName}
            </Typography>
            <Typography variant="body1">
              Monto a Pagar: {debt.totalAmount}
            </Typography>
            <Typography variant="body1">Moneda: {debt.currency}</Typography>
            <Typography variant="body1">
              Fecha de Actualización:{" "}
              {new Date(debt.updatedAt).toLocaleDateString()}
            </Typography>
          </>
        )}
      </Paper>
    </Modal>
  );
};

export default DebtDetailsModal;
