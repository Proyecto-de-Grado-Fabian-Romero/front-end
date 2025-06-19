"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  Paper,
  Typography,
  Button,
  TableContainer,
} from "@mui/material";
import { getDebts } from "@/services/adminService";
import DebtDetailsModal from "@/components/modal/DebtDetailsModal";
import MarkDebtModal from "@/components/modal/MakDebtModal";
import { AdminDebt } from "@/types/Payments";
import { useRouter } from "next/navigation";
import { PageRoutes } from "@/utils/constants/page-routes";
import { markDebtAsPaid } from "@/services/adminService";

const AdminDebtsClient = () => {
  const [debts, setDebts] = useState<AdminDebt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
  const [openDetailsModal, setOpenDetailsModal] = useState<boolean>(false);
  const [openMarkAsPaidModal, setOpenMarkAsPaidModal] =
    useState<boolean>(false); // Modal state for marking as paid
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
      <Typography variant="h5">Deudas Pendientes</Typography>
      <TableContainer sx={{ maxHeight: 400, overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Propietario</TableCell>
              <TableCell>Monto a Pagar</TableCell>
              <TableCell>Fecha de Actualización</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {debts.map((debt) => (
              <TableRow key={debt.id}>
                <TableCell>{debt.ownerName}</TableCell>
                <TableCell>Bs. {debt.totalAmount}</TableCell>
                <TableCell>
                  {new Date(debt.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(totalItems / 20)}
        page={page}
        onChange={(_, value) => setPage(value)}
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
