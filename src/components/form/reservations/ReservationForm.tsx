import React, { useEffect, useMemo, useState } from "react";
import { Button, Stack, Typography, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import moment, { Moment } from "moment";
import { ScheduleBlock } from "@/types/Booking";
import { Environment } from "@/types/GetEnvironment";
import { loadUnavailableRanges } from "@/services/availabilityService";
import { CustomDatePicker } from "./DatePicker";
import { CustomTimePicker } from "./TimePicker";

interface ReservationFormProps {
  isHospedaje: boolean;
  dateRange: [Moment | null, Moment | null];
  setDateRange: React.Dispatch<
    React.SetStateAction<[Moment | null, Moment | null]>
  >;
  scheduleBlocks: ScheduleBlock[];
  setScheduleBlocks: React.Dispatch<React.SetStateAction<ScheduleBlock[]>>;
  environment: Environment;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  isHospedaje,
  dateRange,
  setDateRange,
  scheduleBlocks,
  setScheduleBlocks,
  environment,
}) => {
  const [unavailableRanges, setUnavailableRanges] = useState<
    { start: number; end: number }[]
  >([]);
  const [loadingUnavailable, setLoadingUnavailable] = useState(true);

  const [loadedRange, setLoadedRange] = useState<{
    start: number;
    end: number;
  }>({
    start: moment().startOf("day").valueOf(),
    end: moment().add(6, "months").endOf("day").valueOf(),
  });

  const allowedDays = environment.weeklySchedules.map((ws) => ws.dayOfWeek);

  const maxSalida = useMemo(() => {
    const entrada = dateRange[0];
    return entrada
      ? moment(entrada).add(environment.maxRentalTime, "days")
      : moment().add(1, "year");
  }, [dateRange, environment.maxRentalTime]);

  const isDateUnavailable = (date: Moment) => {
    const timestamp = date.startOf("day").valueOf();
    return unavailableRanges.some(
      (range) => timestamp >= range.start && timestamp <= range.end
    );
  };

  const isTimeUnavailable = (date: Moment, time: Moment) => {
    const timestamp = moment(date)
      .startOf("day")
      .add(time.hours(), "hours")
      .add(time.minutes(), "minutes")
      .valueOf();
    return unavailableRanges.some(
      (range) => timestamp >= range.start && timestamp <= range.end
    );
  };

  const getAllowedTimeRangeForDate = (date: Moment) => {
    const schedule = environment.weeklySchedules.find(
      (s) => s.dayOfWeek === date.day()
    );
    if (!schedule) return null;
    return {
      start: moment().startOf("day").add(schedule.startTime, "minutes"),
      end: moment().startOf("day").add(schedule.endTime, "minutes"),
    };
  };

  const handleScheduleChange = (
    index: number,
    key: keyof ScheduleBlock,
    value: Moment | null
  ) => {
    const updated = [...scheduleBlocks];
    updated[index][key] = value;
    setScheduleBlocks(updated);
  };

  const handleMonthChange = async (newMonth: Moment) => {
    const startOfMonth = moment(newMonth).startOf("month").valueOf();
    const endOfMonth = moment(newMonth).endOf("month").valueOf();

    if (startOfMonth < loadedRange.start || endOfMonth > loadedRange.end) {
      const newStart = moment(newMonth).startOf("month").valueOf();
      const newEnd = moment(newMonth).add(6, "months").endOf("month").valueOf();
      setLoadedRange({ start: newStart, end: newEnd });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoadingUnavailable(true);
      try {
        const data = await loadUnavailableRanges(
          environment.publicId,
          loadedRange.start,
          loadedRange.end
        );
        setUnavailableRanges(data);
      } catch (err) {
        alert("No se pudo cargar las fechas inhabilitadas.");
      } finally {
        setLoadingUnavailable(false);
      }
    };
    loadData();
  }, [environment.publicId, loadedRange]);

  return (
    <>
      {isHospedaje ? (
        <Stack spacing={2}>
          <Typography variant="h6">Selecciona tus fechas</Typography>
          <CustomDatePicker
            label="Entrada"
            value={dateRange[0]}
            onChange={(val) => setDateRange([val, dateRange[1]])}
            onMonthChange={handleMonthChange}
            minDate={moment()}
            disableCondition={isDateUnavailable}
            maxDate={moment().add(1, "year")}
            loading={loadingUnavailable}
            disabled={loadingUnavailable}
          />
          <CustomDatePicker
            label="Salida"
            value={dateRange[1]}
            onChange={(val) => setDateRange([dateRange[0], val])}
            onMonthChange={handleMonthChange}
            minDate={dateRange[0] || moment()}
            disableCondition={isDateUnavailable}
            maxDate={maxSalida}
            loading={loadingUnavailable}
            disabled={loadingUnavailable}
          />
        </Stack>
      ) : (
        <Stack spacing={1}>
          <Typography variant="h6">Agrega horarios</Typography>
          {scheduleBlocks.map((block, index) => {
            const allowedRange = block.date
              ? getAllowedTimeRangeForDate(block.date)
              : null;
            return (
              <Grid container spacing={2} key={index}>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                  <CustomDatePicker
                    label="Fecha"
                    value={block.date}
                    onChange={(val) => handleScheduleChange(index, "date", val)}
                    onMonthChange={handleMonthChange}
                    minDate={moment()}
                    disableCondition={(date) =>
                      date.isBefore(moment(), "day") ||
                      !allowedDays.includes(date.day()) ||
                      isDateUnavailable(date)
                    }
                    loading={loadingUnavailable}
                    disabled={loadingUnavailable}
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                  <CustomTimePicker
                    label="Inicio"
                    value={block.start}
                    onChange={(val) =>
                      handleScheduleChange(index, "start", val)
                    }
                    minTime={allowedRange?.start}
                    maxTime={allowedRange?.end}
                    blockDate={block.date}
                    isTimeUnavailable={isTimeUnavailable}
                    loading={loadingUnavailable}
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                  <CustomTimePicker
                    label="Fin"
                    value={block.end}
                    onChange={(val) => handleScheduleChange(index, "end", val)}
                    minTime={
                      block.start && allowedRange
                        ? moment.max(allowedRange.start, block.start)
                        : block.start || undefined
                    }
                    maxTime={allowedRange?.end}
                    blockDate={block.date}
                    isTimeUnavailable={isTimeUnavailable}
                    loading={loadingUnavailable}
                  />
                </Grid>
              </Grid>
            );
          })}
          <Button
            onClick={() =>
              setScheduleBlocks([
                ...scheduleBlocks,
                { date: null, start: null, end: null },
              ])
            }
            startIcon={<AddIcon />}
            disabled={scheduleBlocks.length >= environment.maxRentalTime}
          >
            {scheduleBlocks.length >= environment.maxRentalTime
              ? "Límite máximo de días para reservar alcanzado"
              : "Añadir otro día"}
          </Button>
        </Stack>
      )}
    </>
  );
};

export default ReservationForm;
