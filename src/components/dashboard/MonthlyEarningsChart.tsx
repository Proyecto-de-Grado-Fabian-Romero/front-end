"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment, { type Moment } from "moment";
import { BarChart } from "@mui/x-charts/BarChart";
import { MonthlyEarningsResponseDto } from "@/types/Earnings";
import { monthLabel } from "@/utils/methods/formatMonth";
import { PaymentSummary } from "@/types/Payments";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL ?? "";

export default function MonthlyEarningsChart({
  summary,
}: {
  summary: PaymentSummary | null;
}) {
  const [from, setFrom] = useState<Moment>(
    moment().subtract(11, "month").startOf("month"),
  );
  const [to, setTo] = useState<Moment>(moment().startOf("month"));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MonthlyEarningsResponseDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const fromMs = from.clone().utc().startOf("month").valueOf();
      const toMs = to.clone().utc().startOf("month").add(1, "month").valueOf();

      const res = await fetch(
        `${API_BASE}/api/owners/earnings/monthly?fromMs=${fromMs}&toMs=${toMs}`,
        { credentials: "include" },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: MonthlyEarningsResponseDto = await res.json();
      setData(json);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e?.message ?? "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  // 🔹 Labels de meses y totales
  const xLabels = useMemo(() => {
    if (!data?.points?.length) return [];
    return data.points.map((p) => monthLabel(p.year, p.month));
  }, [data]);

  const totals = useMemo(() => {
    if (!data?.points?.length) return [];
    return data.points.map((p) => Number(p.total));
  }, [data]);

  // 🔹 Total general
  const totalEarnings = totals.reduce((sum, val) => sum + val, 0);

  // 🔹 Etiqueta del período
  const periodLabel = `${from.locale("es").format("MMMM YYYY")} - ${to
    .locale("es")
    .format("MMMM YYYY")}`;

  return (
    <Card className="rounded-2xl">
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mb: 2, flexWrap: "wrap" }}
        >
          <Typography variant="h6" fontWeight={700}>
            Ingresos mensuales
          </Typography>

          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es">
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ flex: 1 }}>
                <DatePicker
                  label="Desde (mes)"
                  views={["year", "month"]}
                  value={from}
                  onChange={(newValue) => {
                    if (newValue) setFrom(newValue.startOf("month"));
                  }}
                  disableFuture
                  slotProps={{
                    textField: { size: "small", fullWidth: true },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <DatePicker
                  label="Hasta (mes)"
                  views={["year", "month"]}
                  value={to}
                  onChange={(newValue) => {
                    if (newValue) setTo(newValue.startOf("month"));
                  }}
                  disableFuture
                  minDate={from}
                  slotProps={{
                    textField: { size: "small", fullWidth: true },
                  }}
                />
              </Box>
              <Button
                variant="contained"
                onClick={() => void fetchData()}
                disabled={loading}
              >
                {loading ? "Cargando..." : "Actualizar"}
              </Button>
            </Stack>
          </LocalizationProvider>
        </Stack>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ width: "100%", height: 360 }}>
          <BarChart
            xAxis={[{ scaleType: "band", data: xLabels }]}
            series={[
              {
                data: totals,
                color: "#F24F13", // color personalizado
              },
            ]}
            height={360}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              sx={{ padding: 2, backgroundColor: "#E0F7FA", borderRadius: 1 }}
            >
              <Typography variant="body1" color="textSecondary">
                Ingresos totales entre{" "}
                {periodLabel.charAt(0).toUpperCase() + periodLabel.slice(1)}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {data ? `${totalEarnings.toFixed(2)}` : "0.00"} Bs
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              sx={{ padding: 2, backgroundColor: "#FFEBEE", borderRadius: 1 }}
            >
              <Typography variant="body1" color="textSecondary">
                Deuda Actual Restante a Ser Depositada
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {summary?.outstandingDebt
                  ? summary.outstandingDebt.toFixed(2)
                  : "0.00"}{" "}
                Bs
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
