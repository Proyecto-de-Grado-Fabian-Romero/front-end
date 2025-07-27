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
import { getDebts, markDebtAsPaid } from "@/services/adminService";
import { AdminDebt } from "@/types/Payments";
import DebtDetailsModal from "@/components/modal/DebtDetailsModal";
import MarkDebtModal from "@/components/modal/MakDebtModal";

const AdminDebtsClient = () => {
  const [debts, setDebts] = useState<AdminDebt[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openMarkAsPaidModal, setOpenMarkAsPaidModal] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        const data = await getDebts(page + 1, 20);
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

  const handleOpenDetailsModal = (id: string) => {
    setSelectedDebtId(id);
    setOpenDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setSelectedDebtId(null);
  };

  const handleOpenMarkAsPaidModal = (id: string) => {
    setSelectedDebtId(id);
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
    } catch {
      alert("Error al marcar la deuda como pagada.");
    }
  };

  const columns: MRT_ColumnDef<AdminDebt>[] = [
    {
      header: "Propietario",
      accessorKey: "ownerName",
    },
    {
      header: "Monto a Pagar",
      accessorKey: "totalAmount",
      Cell: ({ cell }) => `Bs. ${cell.getValue<number>()}`,
    },
    {
      header: "Fecha de Actualización",
      accessorKey: "updatedAt",
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleDateString(),
    },
    {
      header: "Acciones",
      accessorKey: "id",
      Cell: ({ cell }) => {
        const id = cell.getValue<string>();
        return (
          <Box display="flex" gap={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleOpenDetailsModal(id)}
            >
              Ver Detalles
            </Button>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={() => handleOpenMarkAsPaidModal(id)}
            >
              Marcar como Pagado
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mt: 4, width: "100%" }}>
      <Typography variant="h5" mb={2}>
        Deudas Pendientes
      </Typography>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
          <Typography mt={2}>Cargando deudas...</Typography>
        </Box>
      ) : (
        <MaterialReactTable
          columns={columns}
          data={debts}
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
            noRecordsToDisplay: "No hay deudas pendientes.",
          }}
        />
      )}

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
