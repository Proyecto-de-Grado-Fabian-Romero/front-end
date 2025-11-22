"use client";

import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import Link from "next/link";
import moment from "moment";
import { getIncomeDetails } from "../../services/ownerPaymentService";
import { type IncomeDetail } from "@/types/Payments";

type Props = {
  open: boolean;
  onClose: () => void;
  incomeId: string | null;
};

const OwnerIncomeDetailModal: React.FC<Props> = ({
  open,
  onClose,
  incomeId,
}) => {
  const [income, setIncome] = useState<IncomeDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Cargar detalles cuando el modal se abra y tengamos id
  useEffect(() => {
    let mounted = true;
    const fetchDetails = async () => {
      if (!open || !incomeId) return;
      setLoading(true);
      try {
        const data = await getIncomeDetails(incomeId);
        if (mounted) setIncome(data);
      } catch (error) {
        console.error(error);
        alert(
          "No se pudo obtener la información del ingreso, intenta de nuevo.",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDetails();
    // Limpieza al cerrar
    return () => {
      mounted = false;
      if (!open) {
        setIncome(null);
        setLoading(false);
      }
    };
  }, [open, incomeId]);

  const reservation = income?.reservation;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return moment(date).locale("es").format("DD [de] MMMM [de] YYYY");
  };

  const fmtTime = (ts: number) => moment(ts).locale("es").format("HH:mm");

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" keepMounted>
      <DialogTitle>Detalles del Ingreso</DialogTitle>

      <DialogContent dividers>
        {loading && (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
            <CircularProgress />
          </Stack>
        )}

        {!loading && !income && (
          <Typography>No se encontraron detalles del ingreso.</Typography>
        )}

        {!loading && income && reservation && (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
              <strong>Detalle de montos:</strong>
            </Typography>

            <Typography variant="body1" sx={{ ml: 1 }}>
              Costo total de la reserva: Bs. {(income.amount * 1.1).toFixed(2)}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              Comisión (10%): Bs. {(income.amount * 0.1).toFixed(2)}
            </Typography>

            <Typography
              variant="h6"
              color="success.main"
              fontWeight={700}
              sx={{ mt: 1.5, ml: 1 }}
            >
              Ingreso total: Bs. {income.amount.toFixed(2)}
            </Typography>

            <Typography variant="body2" sx={{ mt: 2 }}>
              Generado el: {formatDate(income.generatedAt)}
            </Typography>

            <Typography variant="h6" sx={{ mb: 1.5 }}>
              Detalles de Reserva
            </Typography>
            <Typography variant="body1" sx={{ mb: 0.5 }}>
              <strong>Ambiente:</strong> {reservation.environmentTitle}
            </Typography>

            {reservation.rentalUnit === "Días" && (
              <>
                <Typography variant="body1">
                  <strong>Check-in:</strong>{" "}
                  {formatDate(reservation.timeRanges[0].startDate)}
                </Typography>
                <Typography variant="body1">
                  <strong>Check-out:</strong>{" "}
                  {formatDate(reservation.timeRanges[0].endDate)}
                </Typography>
              </>
            )}

            {reservation.rentalUnit === "Horas" && (
              <>
                <Typography variant="body1">
                  <strong>Día:</strong>{" "}
                  {formatDate(reservation.timeRanges[0].startDate)}
                </Typography>
                <Typography variant="body1">
                  <strong>Check-in:</strong>{" "}
                  {fmtTime(reservation.timeRanges[0].startDate)}
                </Typography>
                <Typography variant="body1">
                  <strong>Check-out:</strong>{" "}
                  {fmtTime(reservation.timeRanges[0].endDate)}
                </Typography>
              </>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {income && (
          <Link
            href={`/reservas/${income.reservationId}`}
            onClick={onClose}
            passHref
          >
            <Button variant="contained" color="primary">
              Ver detalles de la reserva
            </Button>
          </Link>
        )}
        <Button onClick={onClose} color="inherit">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OwnerIncomeDetailModal;
