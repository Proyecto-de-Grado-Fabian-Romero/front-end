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
import { getIncomeList } from "../../services/ownerPaymentService";
import { IncomeDetail } from "@/types/Payments";

const OwnerIncomeList = () => {
  const [incomes, setIncomes] = useState<IncomeDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const data = await getIncomeList(page, 20);
        setIncomes(data.items);
        setTotalItems(data.totalItems);
      } catch {
        alert("Hubo un error, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    fetchIncomes();
  }, [page]);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <CircularProgress />
        <Typography mt={2}>Cargando ingresos...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom mb={8}>
        Lista de Ingresos
      </Typography>
      <Card>
        <Box p={2}>
          {incomes.length === 0 ? (
            <Typography variant="subtitle1">Aún no tienes ingresos.</Typography>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Monto</TableCell>
                    <TableCell>Moneda</TableCell>
                    <TableCell>Fecha Generada</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incomes.map((income) => (
                    <TableRow key={income.reservationId}>
                      <TableCell>{income.amount}</TableCell>
                      <TableCell>{income.currency}</TableCell>
                      <TableCell>
                        {new Date(income.generatedAt).toLocaleDateString()}
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

export default OwnerIncomeList;
