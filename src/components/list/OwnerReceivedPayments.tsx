"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  Box,
  Typography,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { getReceivedPayments } from "../../services/ownerPaymentService";
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

  return (
    <Box>
      <Typography textAlign={"center"} variant="h5" gutterBottom mb={8}>
        Pagos Recibidos
      </Typography>

      <OwnerPaymentDashboard />
      <Card>
        <Box p={2}>
          {payments.length === 0 ? (
            <Typography variant="subtitle1">
              Aún no se recibieron pagos.
            </Typography>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Monto Pagado</TableCell>
                    <TableCell>Moneda</TableCell>
                    <TableCell>Referencia</TableCell>
                    <TableCell>Método de Pago</TableCell>
                    <TableCell>Fecha de Creación</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.amountPaid}</TableCell>
                      <TableCell>{payment.currency}</TableCell>
                      <TableCell>{payment.reference}</TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                      <TableCell>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                  count={Math.ceil(totalItems / 20)}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                />
              </Box>
            </>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default OwnerReceivedPayments;
