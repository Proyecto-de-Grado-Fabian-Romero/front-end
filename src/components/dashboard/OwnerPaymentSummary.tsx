import React from "react";
import { Card, Typography, Box, Grid, Paper } from "@mui/material";
import { PaymentSummary } from "@/types/Payments";

const OwnerPaymentSummary = ({
  summary,
}: {
  summary: PaymentSummary | null;
}) => {
  if (!summary) return <Typography>Todavía no hay ganancias.</Typography>;
  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "auto",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Resumen de Pagos
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              sx={{ padding: 2, backgroundColor: "#E0F7FA", borderRadius: 1 }}
            >
              <Typography variant="body1" color="textSecondary">
                Ganancias Totales
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {summary.totalEarnings} Bs
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              sx={{ padding: 2, backgroundColor: "#FFECB3", borderRadius: 1 }}
            >
              <Typography variant="body1" color="textSecondary">
                Pagos Recibidos
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {summary.totalPaid} Bs
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              sx={{ padding: 2, backgroundColor: "#FFEBEE", borderRadius: 1 }}
            >
              <Typography variant="body1" color="textSecondary">
                Deuda Restante
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {summary.outstandingDebt} Bs
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default OwnerPaymentSummary;
