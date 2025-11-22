import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { type Moment } from "moment";
import { type TextFieldProps } from "@mui/material";

interface CustomDatePickerProps {
  label: string;
  value: Moment | null;
  onChange: (val: Moment | null) => void;
  onMonthChange: (val: Moment) => void;
  minDate?: Moment;
  maxDate?: Moment;
  disableCondition?: (date: Moment) => boolean;
  loading?: boolean;
  disabled?: boolean;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onChange,
  onMonthChange,
  minDate,
  maxDate,
  disableCondition,
  loading = false,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onMonthChange={onMonthChange}
      disablePast
      minDate={minDate}
      maxDate={maxDate}
      loading={loading}
      disabled={disabled}
      shouldDisableDate={disableCondition}
      slotProps={{
        textField: {
          helperText: open
            ? loading
              ? "Cargando fechas no disponibles..."
              : "Fechas bloqueadas no están disponibles para reservar"
            : undefined,
        } as TextFieldProps,
      }}
    />
  );
};
