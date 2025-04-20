"use client";
import { Grid } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import React from "react";

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
    if (date) {
      setEndDate(date.clone().add(1, "day"));
    }
  };

  const handleStartTimeChange = (time: moment.Moment | null) => {
    setStartTime(time);
    if (time) {
      const newEndTime = time.clone().add(1, "hour");
      if (newEndTime.hour() <= 23) {
        setEndTime(newEndTime);
      } else {
        setEndTime(moment(time).hour(23).minute(0));
      }
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      {isHospedaje ? (
        <>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DatePicker
              label="Llegada"
              value={startDate}
              onChange={handleStartDateChange}
              disablePast
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
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
          <Grid size={{ xs: 12, sm: 6 }}>
            <TimePicker
              label="Hora de inicio"
              value={startTime}
              onChange={handleStartTimeChange}
              disablePast={startDate?.isSame(moment(), "day")}
              minTime={moment().startOf("day")}
              maxTime={moment().hour(23).minute(0)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
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
