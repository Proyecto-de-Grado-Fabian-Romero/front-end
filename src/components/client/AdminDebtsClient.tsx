"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import MUIDataTable, { MUIDataTableColumnDef } from "mui-datatables";
import { getDebts, markDebtAsPaid } from "@/services/adminService";
import DebtDetailsModal from "@/components/modal/DebtDetailsModal";
import MarkDebtModal from "@/components/modal/MakDebtModal";
import { AdminDebt } from "@/types/Payments";
import { useRouter } from "next/navigation";
import { PageRoutes } from "@/utils/constants/page-routes";

const AdminDebtsClient = () => {
  const [debts, setDebts] = useState<AdminDebt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
  const [openDetailsModal, setOpenDetailsModal] = useState<boolean>(false);
  const [openMarkAsPaidModal, setOpenMarkAsPaidModal] =
    useState<boolean>(false);
  const [paymentReference, setPaymentReference] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        const data = await getDebts(page, 20);
        setDebts(data.items);
        setTotalItems(data.totalItems);
      } catch {
        alert("Hubo un error obteniendo las deudas");
      } finally {
        setLoading(false);
      }
    };
    fetchDebts();
  }, [page]);

  const handleOpenDetailsModal = (debtId: string) => {
    setSelectedDebtId(debtId);
    setOpenDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setSelectedDebtId(null);
  };

  const handleOpenMarkAsPaidModal = (debtId: string) => {
    setSelectedDebtId(debtId);
    setOpenMarkAsPaidModal(true);
  };

  const handleCloseMarkAsPaidModal = () => {
    setOpenMarkAsPaidModal(false);
    setSelectedDebtId(null);
    setPaymentReference("");
  };

  const handleMarkAsPaid = async () => {
    try {
      await markDebtAsPaid(selectedDebtId as string, paymentReference);
      alert("Deuda marcada como pagada y el pago registrado.");
      handleCloseMarkAsPaidModal();
    } catch (error) {
      console.error("Error marking debt as paid:", error);
      alert("Error al marcar la deuda como pagada.");
    }
  };

  const handleNavigateToPayments = () => {
    router.push(PageRoutes.Admin_Payments);
  };

  if (loading) return <CircularProgress />;

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "ownerName",
      label: "Propietario",
    },
    {
      name: "totalAmount",
      label: "Monto a Pagar",
      options: {
        customBodyRender: (value: number) => `Bs. ${value}`,
      },
    },
    {
      name: "updatedAt",
      label: "Fecha de Actualización",
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
          const debt = debts[dataIndex];
          return (
            <>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleOpenDetailsModal(debt.id)}
              >
                Ver Detalles
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ ml: 2 }}
                onClick={() => handleOpenMarkAsPaidModal(debt.id)}
              >
                Marcar como Pagado
              </Button>
            </>
          );
        },
      },
    },
  ];

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mt: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNavigateToPayments}
        >
          Ver Pagos Realizados
        </Button>
      </Box>

      <Typography variant="h5" mb={2}>
        Deudas Pendientes
      </Typography>

      <MUIDataTable
        title=""
        data={debts}
        columns={columns}
        options={{
          selectableRows: "none",
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
          responsive: "standard",
          textLabels: {
            body: {
              noMatch: "No hay deudas pendientes.",
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

      <DebtDetailsModal
        open={openDetailsModal}
        onClose={handleCloseDetailsModal}
        debtId={selectedDebtId}
      />

      <MarkDebtModal
        open={openMarkAsPaidModal}
        onClose={handleCloseMarkAsPaidModal}
        onSubmit={handleMarkAsPaid}
      />
    </Paper>
  );
};

export default AdminDebtsClient;
