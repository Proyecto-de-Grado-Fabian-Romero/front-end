"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import MUIDataTable, { MUIDataTableColumnDef } from "mui-datatables";
import { getReceivedPayments } from "@/services/ownerPaymentService";
import { OwnerPaymentDetail } from "@/types/Payments";
import OwnerPaymentDashboard from "../dashboard/OwnerPaymentDashboard";

const OwnerReceivedPayments = () => {
  const [payments, setPayments] = useState<OwnerPaymentDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getReceivedPayments(page, 20);
        setPayments(data.items);
        setTotalItems(data.totalItems);
      } catch {
        alert("Hubo un error, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [page]);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <CircularProgress />
        <Typography mt={2}>Cargando pagos...</Typography>
      </Box>
    );
  }

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "amountPaid",
      label: "Monto Pagado",
      options: {
        customBodyRender: (value: number) => `Bs. ${value}`,
      },
    },
    {
      name: "reference",
      label: "Referencia",
    },
    {
      name: "paymentMethod",
      label: "Método de Pago",
    },
    {
      name: "createdAt",
      label: "Fecha de Creación",
      options: {
        customBodyRender: (value: string) =>
          new Date(value).toLocaleDateString(),
      },
    },
  ];

  return (
    <Box>
      <OwnerPaymentDashboard />

      <Typography textAlign="center" variant="h5" gutterBottom mt={4} mb={4}>
        Pagos Recibidos
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <MUIDataTable
          title=""
          data={payments}
          columns={columns}
          options={{
            selectableRows: "none",
            responsive: "standard",
            rowsPerPage: 20,
            count: totalItems,
            page: page - 1,
            onChangePage: (currentPage) => setPage(currentPage + 1),
            pagination: true,
            rowsPerPageOptions: [],
            search: false,
            download: false,
            print: false,
            viewColumns: false,
            filter: false,
            textLabels: {
              body: {
                noMatch: "Aún no se recibieron pagos.",
              },
              pagination: {
                next: "Siguiente",
                previous: "Anterior",
                rowsPerPage: "Filas por página:",
                displayRows: "de",
              },
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default OwnerReceivedPayments;
