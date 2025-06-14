import React, { useEffect, useState } from "react";
import { Modal, Typography, CircularProgress, Paper } from "@mui/material";
import { getPaymentDetails } from "@/services/adminService";
import { AdminPayment } from "@/types/Payments";

const PaymentDetailsModal = ({
  open,
  onClose,
  paymentId,
}: {
  open: boolean;
  onClose: () => void;
  paymentId: string | null;
}) => {
  const [payment, setPayment] = useState<AdminPayment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (paymentId && open) {
      const fetchPaymentDetails = async () => {
        try {
          const data = await getPaymentDetails(paymentId);
          setPayment(data);
        } catch {
          alert(
            "Hubo un error obteniendo los detalles del pago, recarga la página"
          );
        } finally {
          setLoading(false);
        }
      };
      fetchPaymentDetails();
    }
  }, [paymentId, open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Paper sx={{ p: 4, borderRadius: 4, maxWidth: 600, margin: "auto" }}>
        {loading ? (
          <CircularProgress />
        ) : !payment ? (
          <Typography>No se encontró el pago</Typography>
        ) : (
          <>
            {" "}
            <Typography variant="h6">Detalles de Pago</Typography>
            <Typography variant="body1">
              Propietario: {payment.ownerName}
            </Typography>
            <Typography variant="body1">
              Monto Pagado: {payment.amountPaid}
            </Typography>
            <Typography variant="body1">Moneda: {payment.currency}</Typography>
            <Typography variant="body1">
              Referencia: {payment.reference}
            </Typography>
            <Typography variant="body1">
              Fecha de Pago: {new Date(payment.createdAt).toLocaleDateString()}
            </Typography>
          </>
        )}
      </Paper>
    </Modal>
  );
};

export default PaymentDetailsModal;
