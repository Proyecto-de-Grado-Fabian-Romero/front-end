"use client";
import React from "react";
import { Grid } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import moment from "moment";

interface DatesSearchProps {
  startDate: moment.Moment | null;
  endDate: moment.Moment | null;
  setStartDate: React.Dispatch<React.SetStateAction<moment.Moment | null>>;
  setEndDate: React.Dispatch<React.SetStateAction<moment.Moment | null>>;
  startTime: moment.Moment | null;
  endTime: moment.Moment | null;
  setStartTime: React.Dispatch<React.SetStateAction<moment.Moment | null>>;
  setEndTime: React.Dispatch<React.SetStateAction<moment.Moment | null>>;
  selectedEnv: string;
}

const DatesSearch: React.FC<DatesSearchProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
  selectedEnv,
}) => {
  const isHospedaje = selectedEnv === "hospedajes";

  const handleStartDateChange = (date: moment.Moment | null) => {
    setStartDate(date);

    if (!date) {
      setEndDate(null);
      return;
    }

    if (isHospedaje) {
      setEndDate(date.clone().add(1, "day"));
    } else {
      setEndDate(date.clone());
      // if (startTime) {
      //   const newEnd = startTime.clone().add(2, "hours");
      //   setEndTime(newEnd);
      // }
    }
  };

  const handleStartTimeChange = (time: moment.Moment | null) => {
    setStartTime(time);
    if (time) {
      const newEndTime = time.clone().add(2, "hours"); // 2 horas como pediste
      // si newEndTime pasa de 23:59, lo dejamos en next day time correcto (moment lo maneja)
      setEndTime(newEndTime);
    }
  };

  const now = moment();

  return (
    <Grid container spacing={2} alignItems="center" pt={1}>
      {isHospedaje ? (
        <>
          <Grid size={{ xs: 12, md: 6 }}>
            <DatePicker
              label="Llegada"
              value={startDate}
              onChange={handleStartDateChange}
              disablePast
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DatePicker
              label="Salida"
              value={endDate}
              onChange={setEndDate}
              disablePast
              minDate={startDate ? startDate.clone().add(1, "day") : undefined}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
        </>
      ) : (
        <>
          <Grid size={{ xs: 12 }}>
            <DatePicker
              label="¿Qué día?"
              value={startDate}
              onChange={handleStartDateChange}
              disablePast
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TimePicker
              label="Hora de inicio"
              value={startTime}
              onChange={handleStartTimeChange}
              // si el startDate es hoy, no permitir horas pasadas:
              disablePast={!!startDate && startDate.isSame(now, "day")}
              minTime={moment().startOf("day")}
              maxTime={moment().hour(23).minute(59)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TimePicker
              label="Hora de fin"
              value={endTime}
              onChange={setEndTime}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default DatesSearch;
