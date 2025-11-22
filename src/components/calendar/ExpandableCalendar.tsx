// components/calendar/ExpandableCalendar.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Box,
} from "@mui/material";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Moment } from "moment";
import styled from "@emotion/styled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const StyledCalendar = styled(DateCalendar)(() => ({
  "& .MuiPickersCalendarHeader-root": {
    fontSize: "1.2rem",
  },
  "& .MuiPickersDay-root": {
    fontSize: "1rem",
    width: 48,
    height: 40,
  },
  "& .MuiPickersDay-dayWithMargin": {
    fontSize: "1rem",
    margin: 0,
  },
  "& .MuiPickersCalendarHeader-label": {
    fontWeight: "bold",
  },
  "& .MuiPickersCalendarHeader-switchViewButton": {
    fontSize: "1.2rem",
  },
  "& .MuiDayCalendar-weekDayLabel": {
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  width: "100%",
})) as typeof DateCalendar;

interface ExpandableCalendarProps {
  selectedDate: Moment;
  onDateChange: (date: Moment) => void;
  title?: string;
  defaultExpanded?: boolean;
  timezoneOffset?: number;
  className?: string;
}

const ExpandableCalendar: React.FC<ExpandableCalendarProps> = ({
  selectedDate,
  onDateChange,
  title = "Seleccionar Día",
  defaultExpanded = false,
  timezoneOffset = -4,
  className,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleDateChange = (newValue: Moment) => {
    onDateChange(newValue);
  };

  return (
    <Card className={className} sx={{ mb: 3 }}>
      <CardContent sx={{ p: "16px !important" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ cursor: "pointer" }}
          onClick={handleToggle}
        >
          <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
            {title}
          </Typography>
          <IconButton size="small" onClick={handleToggle}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        {selectedDate && (
          <Typography variant="body2" color="text.secondary" mt={1}>
            Fecha seleccionada:{" "}
            {selectedDate.utcOffset(timezoneOffset * 60).format("DD/MM/YYYY")}
          </Typography>
        )}

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es">
            <StyledCalendar
              value={selectedDate}
              onChange={handleDateChange}
              views={["day", "month"]}
              showDaysOutsideCurrentMonth
              disablePast={false}
              reduceAnimations={false}
              sx={{ mt: 2 }}
            />
          </LocalizationProvider>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default ExpandableCalendar;
