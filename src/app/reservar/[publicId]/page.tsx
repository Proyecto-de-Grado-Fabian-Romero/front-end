"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getEnvironmentByPublicId } from "@/services/environmentService";
import { useParams } from "next/navigation";
import { Environment } from "@/types/GetEnvironment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import EnvironmentPreviewDisplay from "@/components/display/EnvironmentPreviewDisplay";
import { ScheduleBlock } from "@/types/Booking";
import ReservationForm from "@/components/form/booking/ReservationForm";

const Page: React.FC = () => {
  const { publicId } = useParams();
  const [data, setData] = useState<Environment | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user);

  const isHospedaje = data?.type.publicKey === "hospedajes";

  const [dateRange, setDateRange] = useState<[Moment | null, Moment | null]>([
    null,
    null,
  ]);
  const [guests, setGuests] = useState<number>(1);
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([
    { date: null, start: null, end: null },
  ]);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  useEffect(() => {
    const fetchEnvironment = async () => {
      try {
        const result = await getEnvironmentByPublicId(
          publicId?.toString() ?? ""
        );
        setData(result);
      } catch {
        alert(
          "No se pudo obtener información del ambiente, inténtalo de nuevo."
        );
      } finally {
        setLoading(false);
      }
    };
    if (publicId) fetchEnvironment();
  }, [publicId]);

  useEffect(() => {
    if (!data) return;
    let base = 0;
    if (isHospedaje) {
      const nights =
        dateRange[0] && dateRange[1]
          ? moment(dateRange[1]).diff(dateRange[0], "days")
          : 0;
      base = nights * data.pricingPolicies[0].basePrice;
      if (guests > data.capacity) {
        base +=
          (guests - data.capacity) *
          data.pricingPolicies[0].extraGuestPrice *
          nights;
      }
    } else {
      scheduleBlocks.forEach((block) => {
        if (block.start && block.end && block.date) {
          const hours = moment(block.end).diff(
            moment(block.start),
            "hours",
            true
          );
          base += hours * data.pricingPolicies[0].basePrice;
        }
      });
    }
    setCalculatedPrice(base);
  }, [dateRange, guests, scheduleBlocks, data]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={4}
        sx={{ height: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>Ambiente no encontrado.</Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box sx={{ padding: 2, maxWidth: 800, margin: "auto", marginTop: 8 }}>
        <EnvironmentPreviewDisplay data={data} />

        <Box my={4}>
          <TextField
            label="Cantidad de personas"
            type="number"
            inputProps={{ min: 1, max: data.capacity }}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            fullWidth
          />
        </Box>

        <ReservationForm
          scheduleBlocks={scheduleBlocks}
          setScheduleBlocks={setScheduleBlocks}
          isHospedaje={isHospedaje}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6">
          Precio estimado: ${calculatedPrice.toFixed(2)}
        </Typography>
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          RESERVAR
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default Page;
