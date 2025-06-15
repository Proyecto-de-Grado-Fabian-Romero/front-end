// components/client/AdminPayments.tsx (client component)
"use client";

import React, { useEffect, useState } from "react";
import {
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

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mt: 4 }}>
          <Typography variant="h5">Pagos Realizados</Typography>
          <TableContainer></TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Propietario</TableCell>
                <TableCell>Monto Pagado</TableCell>
                <TableCell>Moneda</TableCell>
                <TableCell>Referencia</TableCell>
                <TableCell>Fecha de Creación</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.ownerName}</TableCell>
                  <TableCell>{payment.amountPaid}</TableCell>
                  <TableCell>{payment.currency}</TableCell>
                  <TableCell>{payment.reference}</TableCell>
                  <TableCell>
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenModal(payment.id)}
                    >
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            count={Math.ceil(totalItems / 20)}
            page={page}
            onChange={(event, value) => setPage(value)}
          />

          <PaymentDetailsModal
            open={openModal}
            onClose={handleCloseModal}
            paymentId={selectedPaymentId}
          />
        </Paper>
      )}
    </>
  );
};

export default AdminPayments;
