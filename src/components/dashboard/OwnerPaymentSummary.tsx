import React from "react";
import { Typography, Box } from "@mui/material";
import { PaymentSummary } from "@/types/Payments";
import MonthlyEarningsChart from "./MonthlyEarningsChart";

const OwnerPaymentSummary = ({
  summary,
}: {
  summary: PaymentSummary | null;
  periodLabel?: string;
  incomesTotal?: string;
}) => {
  if (!summary) return <Typography>Todavía no hay ganancias.</Typography>;
  return (
    <Box mt={4}>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Resumen de Pagos
      </Typography>

      <MonthlyEarningsChart summary={summary} />
    </Box>
  );
};

export default OwnerPaymentSummary;
