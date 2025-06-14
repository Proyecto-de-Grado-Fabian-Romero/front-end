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
import { AdminDebt } from "@/types/Payments";
import { useRouter } from "next/navigation";
import { PageRoutes } from "@/utils/constants/page-routes";

const AdminDebtsClient = () => {
  const [debts, setDebts] = useState<AdminDebt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

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

  const handleOpenModal = (debtId: string) => {
    setSelectedDebtId(debtId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDebtId(null);
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
              <TableCell>Moneda</TableCell>
              <TableCell>Fecha de Actualización</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {debts.map((debt) => (
              <TableRow key={debt.id}>
                <TableCell>{debt.ownerName}</TableCell>
                <TableCell>{debt.totalAmount}</TableCell>
                <TableCell>{debt.currency}</TableCell>
                <TableCell>
                  {new Date(debt.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(debt.id)}
                  >
                    Ver Detalles
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
        open={openModal}
        onClose={handleCloseModal}
        debtId={selectedDebtId}
      />
    </Paper>
  );
};

export default AdminDebtsClient;
