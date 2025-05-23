import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import AddIcon from "@mui/icons-material/Add";
import { ScheduleBlock } from "@/types/Booking";
import { Moment } from "moment";
import moment from "moment";

interface ReservationFormProps {
  isHospedaje: boolean;
  dateRange: [moment.Moment | null, moment.Moment | null];
  setDateRange: (
    value: React.SetStateAction<[moment.Moment | null, moment.Moment | null]>
  ) => void;
  scheduleBlocks: ScheduleBlock[];
  setScheduleBlocks: React.Dispatch<React.SetStateAction<ScheduleBlock[]>>;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  isHospedaje,
  dateRange,
  setDateRange,
  setScheduleBlocks,
  scheduleBlocks,
}) => {
  const disablePastDates = (date: Moment) =>
    moment(date).isBefore(moment(), "day");

  const handleScheduleChange = (
    index: number,
    key: keyof ScheduleBlock,
    value: Moment | null
  ) => {
    const updated = [...scheduleBlocks];
    updated[index][key] = value;
    setScheduleBlocks(updated);
  };
  return (
    <>
      {isHospedaje ? (
        <Stack spacing={2}>
          <Typography variant="h6">Selecciona tus fechas</Typography>
          <DatePicker
            label="Entrada"
            value={dateRange[0]}
            onChange={(newVal) => setDateRange([newVal, dateRange[1]])}
            disablePast
          />
          <DatePicker
            label="Salida"
            value={dateRange[1]}
            onChange={(newVal) => setDateRange([dateRange[0], newVal])}
            disablePast
          />
        </Stack>
      ) : (
        <Stack spacing={2}>
          <Typography variant="h6">Agrega horarios</Typography>
          {scheduleBlocks.map((block, index) => (
            <Stack direction="row" spacing={2} key={index}>
              <DatePicker
                label="Fecha"
                value={block.date}
                onChange={(val) => handleScheduleChange(index, "date", val)}
                shouldDisableDate={disablePastDates}
              />
              <TimePicker
                label="Inicio"
                value={block.start}
                onChange={(val) => handleScheduleChange(index, "start", val)}
                minTime={
                  block.date && moment().isSame(block.date, "day")
                    ? moment()
                    : undefined
                }
              />
              <TimePicker
                label="Fin"
                value={block.end}
                onChange={(val) => handleScheduleChange(index, "end", val)}
                minTime={block.start || undefined}
              />
            </Stack>
          ))}
          <Button
            onClick={() =>
              setScheduleBlocks([
                ...scheduleBlocks,
                { date: null, start: null, end: null },
              ])
            }
            startIcon={<AddIcon />}
          >
            Añadir otro día
          </Button>
        </Stack>
      )}
    </>
  );
};

export default ReservationForm;
