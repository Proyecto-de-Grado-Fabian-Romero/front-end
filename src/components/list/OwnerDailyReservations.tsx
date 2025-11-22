"use client";

import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { ReservationResponse } from "@/types/Reservations";
import { getMyReservationsByDay } from "@/services/reservationService";
import { Moment } from "moment";
import ReservationList from "../card/ReservationList";

type Props = {
  date: Moment;
};

const OwnerDailyReservations: React.FC<Props> = ({ date }) => {
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const timestamp = date.startOf("day").valueOf();
        const res = await getMyReservationsByDay(timestamp);
        setReservations(res.items);
      } catch {
        setError("Error al cargar las reservas.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [date]);

  if (loading) {
    return (
      <Box mt={4} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4} textAlign="center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return <ReservationList reservations={reservations} />;
};

export default OwnerDailyReservations;
