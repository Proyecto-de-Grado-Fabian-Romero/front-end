"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  RadioGroup,
  FormControlLabel as RadioControlLabel,
  Radio,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getEnvironmentByPublicId } from "@/services/environmentService";
import { useParams, useRouter } from "next/navigation";
import { Environment } from "@/types/GetEnvironment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import EnvironmentPreviewDisplay from "@/components/display/EnvironmentPreviewDisplay";
import { ScheduleBlock } from "@/types/Booking";
import ReservationForm from "@/components/form/booking/ReservationForm";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { PageRoutes } from "@/utils/constants/page-routes";
import ReservationSubmitButton from "@/components/buttons/ReservationSubmitButton";

const Page: React.FC = () => {
  const { publicId } = useParams();
  const [data, setData] = useState<Environment | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user.publicId || user.publicId === data?.ownerId) {
      router.replace(`${PageRoutes.Environment_Details}/${publicId}`);
    }
  }, [data?.ownerId, publicId, router, user.publicId]);

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
          publicId?.toString() ?? "",
        );
        setData(result);
      } catch {
        alert(
          "No se pudo obtener información del ambiente, inténtalo de nuevo.",
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
    let totalUnits = 0;

    if (isHospedaje) {
      const nights =
        dateRange[0] && dateRange[1]
          ? moment(dateRange[1]).diff(dateRange[0], "days")
          : 0;
      totalUnits = nights;
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
            true,
          );
          totalUnits += hours;
          base += hours * data.pricingPolicies[0].basePrice;
        }
      });
    }

    // Aplicar descuento si corresponde
    const applicableDiscount = data.discountPolicies
      .filter((d) => totalUnits >= d.minHours)
      .sort((a, b) => b.minHours - a.minHours)[0]; // mayor duración primero

    if (applicableDiscount) {
      const discountAmount =
        (base * applicableDiscount.discountPercentage) / 100;
      base -= discountAmount;
    }

    setCalculatedPrice(base);
  }, [dateRange, guests, scheduleBlocks, data, isHospedaje]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems={"center"}
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
        <Typography variant="h5" mb={2}>
          Reservar Ambiente
        </Typography>
        <EnvironmentPreviewDisplay data={data} />

        <Box my={4}>
          <Typography variant="h6">Cantidad de personas:</Typography>
          {data.type.publicKey === "hospedajes" ? (
            <Grid
              container
              alignItems="center"
              spacing={2}
              justifyContent="center"
            >
              <Grid>
                <IconButton
                  onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                  disabled={guests <= 1}
                >
                  <RemoveIcon />
                </IconButton>
              </Grid>
              <Grid>
                <Typography variant="h6">{guests}</Typography>
              </Grid>
              <Grid>
                <IconButton
                  onClick={() =>
                    setGuests((prev) => Math.min(data.capacity, prev + 1))
                  }
                  disabled={guests >= data.capacity}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>
          ) : (
            <RadioGroup
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
            >
              <Grid container>
                <Grid size={{ xs: 6 }}>
                  <RadioControlLabel
                    value={1}
                    control={<Radio />}
                    label="1 - 5 personas"
                  />
                  <RadioControlLabel
                    value={5}
                    control={<Radio />}
                    label="5 - 10 personas"
                  />
                  <RadioControlLabel
                    value={10}
                    control={<Radio />}
                    label="10 - 20 personas"
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <RadioControlLabel
                    value={20}
                    control={<Radio />}
                    label="20 - 50 personas"
                  />
                  <RadioControlLabel
                    value={50}
                    control={<Radio />}
                    label="50+ personas"
                  />
                </Grid>
              </Grid>
            </RadioGroup>
          )}
        </Box>

        <ReservationForm
          scheduleBlocks={scheduleBlocks}
          setScheduleBlocks={setScheduleBlocks}
          isHospedaje={isHospedaje}
          dateRange={dateRange}
          setDateRange={setDateRange}
          environment={data}
        />

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6">
          Precio total: Bs. {calculatedPrice.toFixed(2)}
        </Typography>
        <ReservationSubmitButton
          environment={data}
          isHospedaje={isHospedaje}
          dateRange={dateRange}
          scheduleBlocks={scheduleBlocks}
          calculatedPrice={calculatedPrice}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default Page;
