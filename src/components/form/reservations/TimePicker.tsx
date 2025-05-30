import React, { useState } from "react";
import { TimePicker } from "@mui/x-date-pickers";
import { type Moment } from "moment";
import { type TextFieldProps } from "@mui/material";

interface CustomTimePickerProps {
  label: string;
  value: Moment | null;
  onChange: (val: Moment | null) => void;
  minTime?: Moment;
  maxTime?: Moment;
  blockDate?: Moment | null;
  isTimeUnavailable?: (date: Moment, time: Moment) => boolean;
  loading?: boolean;
  disabled?: boolean;
}

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  label,
  value,
  onChange,
  minTime,
  maxTime,
  blockDate,
  isTimeUnavailable = () => false,
  loading = false,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <TimePicker
      label={label}
      value={value}
      onChange={onChange}
      ampm={false}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      disabled={!blockDate || disabled}
      minTime={minTime}
      maxTime={maxTime}
      shouldDisableTime={(val, type) => {
        if (!blockDate) return false;
        const time = blockDate
          .clone()
          .startOf("day")
          .set(type === "hours" ? "hour" : "minute", val as unknown as number);
        return isTimeUnavailable(blockDate, time);
      }}
      slotProps={{
        textField: {
          helperText: open
            ? loading
              ? "Cargando horarios no disponibles..."
              : "Horarios bloqueados no están disponibles para reservar"
            : undefined,
        } as TextFieldProps,
      }}
    />
  );
};
