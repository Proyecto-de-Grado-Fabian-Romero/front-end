"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { getReceivedPayments } from "@/services/ownerPaymentService";
import { OwnerPaymentDetail } from "@/types/Payments";
import OwnerPaymentDashboard from "../dashboard/OwnerPaymentDashboard";

const OwnerReceivedPayments = () => {
  const [payments, setPayments] = useState<OwnerPaymentDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0); // 0-based index

  const fetchPayments = useCallback(async () => {
    try {
      const data = await getReceivedPayments(page + 1, 20);
      setPayments(data.items);
      setTotalItems(data.totalItems);
    } catch {
      alert("Hubo un error al obtener los pagos.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPayments();
  }, [page, fetchPayments]);

  const columns: MRT_ColumnDef<OwnerPaymentDetail>[] = [
    {
      header: "Monto Pagado",
      accessorKey: "amountPaid",
      Cell: ({ cell }) => `Bs. ${cell.getValue<number>()}`,
    },
    {
      header: "Referencia",
      accessorKey: "reference",
    },
    {
      header: "Método de Pago",
      accessorKey: "paymentMethod",
    },
    {
      header: "Fecha de Creación",
      accessorKey: "createdAt",
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleDateString(),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <OwnerPaymentDashboard />

      <Typography textAlign="center" variant="h5" mt={4} mb={4}>
        Pagos Recibidos
      </Typography>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box textAlign="center" mt={4}>
            <CircularProgress />
            <Typography mt={2}>Cargando pagos...</Typography>
          </Box>
        ) : (
          <MaterialReactTable
            columns={columns}
            data={payments}
            enablePagination
            manualPagination
            rowCount={totalItems}
            pageCount={Math.ceil(totalItems / 20)}
            onPaginationChange={(updater) => {
              const newPage =
                typeof updater === "function"
                  ? updater({ pageIndex: page, pageSize: 20 }).pageIndex
                  : updater.pageIndex;

              setPage(newPage);
            }}
            state={{
              pagination: {
                pageIndex: page,
                pageSize: 20,
              },
            }}
            muiPaginationProps={{
              rowsPerPageOptions: [20],
            }}
            localization={{
              noRecordsToDisplay: "No hay pagos para mostrar",
            }}
          />
        )}
      </Paper>
    </Box>
  );
};

export default OwnerReceivedPayments;
