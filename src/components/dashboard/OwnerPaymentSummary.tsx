import React from "react";
import { Card, Typography, Box } from "@mui/material";
import { PaymentSummary } from "@/types/Payments";

const OwnerPaymentSummary = ({
  summary,
}: {
  summary: PaymentSummary | null;
}) => {
  if (!summary) return <></>;
  return (
    <Card>
      <Box p={2}>
        <Typography variant="h5">Resumen de Pagos</Typography>
        <Typography variant="body1">
          Ganancias totales: {summary.totalEarnings}
        </Typography>
        <Typography variant="body1">Total Paid: {summary.totalPaid}</Typography>
        <Typography variant="body1">
          Deuda restante: {summary.outstandingDebt}
        </Typography>
      </Box>
    </Card>
  );
};

export default OwnerPaymentSummary;
