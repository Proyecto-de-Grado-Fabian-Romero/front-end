"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { getPayments } from "@/services/adminService";
import PaymentDetailsModal from "@/components/modal/PaymentDetailsModal";
import { AdminPayment } from "@/types/Payments";

const AdminPayments = () => {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null,
  );
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPayments(page + 1, 20);
        setPayments(data.items);
        setTotalItems(data.totalItems);
      } catch {
        alert("Hubo un error obteniendo los pagos.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [page]);

  const handleOpenModal = (id: string) => {
    setSelectedPaymentId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPaymentId(null);
    setOpenModal(false);
  };

  const columns: MRT_ColumnDef<AdminPayment>[] = [
    {
      header: "Propietario",
      accessorKey: "ownerName",
    },
    {
      header: "Monto Pagado",
      accessorKey: "amountPaid",
    },
    {
      header: "Moneda",
      accessorKey: "currency",
    },
    {
      header: "Referencia",
      accessorKey: "reference",
    },
    {
      header: "Fecha de Creación",
      accessorKey: "createdAt",
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleDateString(),
    },
    {
      header: "Acciones",
      accessorKey: "id",
      Cell: ({ cell }) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleOpenModal(cell.getValue<string>())}
        >
          Ver Detalles
        </Button>
      ),
    },
  ];

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mt: 4, width: "100%" }}>
      <Typography variant="h5" mb={2}>
        Pagos Realizados
      </Typography>

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
            ...MRT_Localization_ES,
            noRecordsToDisplay: "No hay pagos registrados.",
          }}
        />
      )}

      <PaymentDetailsModal
        open={openModal}
        onClose={handleCloseModal}
        paymentId={selectedPaymentId}
      />
    </Paper>
  );
};

export default AdminPayments;
