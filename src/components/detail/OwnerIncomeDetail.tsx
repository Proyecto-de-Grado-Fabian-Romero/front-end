"use client";

import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Box,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { useParams } from "next/navigation";
import { getIncomeDetails } from "../../services/ownerPaymentService";
import Link from "next/link";
import { IncomeDetail } from "@/types/Payments";

const OwnerIncomeDetail = () => {
  const [income, setIncome] = useState<IncomeDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchDetails = async () => {
        try {
          const data = await getIncomeDetails(id as string);
          setIncome(data);
        } catch {
          alert(
            "No se pudo obtener la información del ingreso, intenta de nuevo",
          );
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [id]);

  if (loading) return <CircularProgress />;

  if (!income)
    return <Typography>No se encontraron detalles del ingreso.</Typography>;

  const reservation = income.reservation;

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString();

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mt: 4 }}>
      <Typography variant="h5">Detalles del Ingreso</Typography>
      <Typography variant="body1">Monto: Bs. {income.amount}</Typography>
      <Typography variant="body1">
        Generado el: {new Date(income.generatedAt).toLocaleDateString()}
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Detalles de Reserva</Typography>
        <Typography variant="body1">
          Ambiente: {reservation.environmentTitle}
        </Typography>

        {reservation.rentalUnit === "Días" && (
          <>
            <Typography variant="body1">
              Check-in: {formatDate(reservation.timeRanges[0].startDate)}
            </Typography>
            <Typography variant="body1">
              Check-out: {formatDate(reservation.timeRanges[0].endDate)}
            </Typography>
          </>
        )}

        {reservation.rentalUnit === "Horas" && (
          <>
            <Typography variant="body1">
              Check-in:{" "}
              {new Date(
                reservation.timeRanges[0].startDate,
              ).toLocaleTimeString()}
            </Typography>
            <Typography variant="body1">
              Check-out:{" "}
              {new Date(reservation.timeRanges[0].endDate).toLocaleTimeString()}
            </Typography>
          </>
        )}
      </Box>

      <Box sx={{ mt: 3 }}>
        <Link href={`/reservations/${income.reservationId}`} passHref>
          <Button variant="contained" color="primary">
            Ver detalles de la reserva
          </Button>
        </Link>
      </Box>
    </Paper>
  );
};

export default OwnerIncomeDetail;
