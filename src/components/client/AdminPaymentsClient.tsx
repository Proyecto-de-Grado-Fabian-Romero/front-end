"use client";

import React, { useEffect, useState } from "react";
import { CircularProgress, Paper, Typography, Button } from "@mui/material";
import MUIDataTable, { MUIDataTableColumnDef } from "mui-datatables";
import { getPayments } from "@/services/adminService";
import PaymentDetailsModal from "@/components/modal/PaymentDetailsModal";
import { AdminPayment } from "@/types/Payments";

const AdminPayments = () => {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null,
  );
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPayments(page, 20);
        setPayments(data.items);
        setTotalItems(data.totalItems);
      } catch {
        alert("Hubo un error obteniendo los pagos, recarga la página.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [page]);

  const handleOpenModal = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPaymentId(null);
  };

  if (loading) return <CircularProgress />;

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "ownerName",
      label: "Propietario",
    },
    {
      name: "amountPaid",
      label: "Monto Pagado",
    },
    {
      name: "currency",
      label: "Moneda",
    },
    {
      name: "reference",
      label: "Referencia",
    },
    {
      name: "createdAt",
      label: "Fecha de Creación",
      options: {
        customBodyRender: (value: string) =>
          new Date(value).toLocaleDateString(),
      },
    },
    {
      name: "actions",
      label: "Acciones",
      options: {
        customBodyRenderLite: (dataIndex: number) => {
          const payment = payments[dataIndex];
          return (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenModal(payment.id)}
            >
              Ver Detalles
            </Button>
          );
        },
      },
    },
  ];

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mt: 4 }}>
      <Typography variant="h5" mb={2}>
        Pagos Realizados
      </Typography>

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
              noMatch: "No hay pagos registrados.",
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

      <PaymentDetailsModal
        open={openModal}
        onClose={handleCloseModal}
        paymentId={selectedPaymentId}
      />
    </Paper>
  );
};

export default AdminPayments;
