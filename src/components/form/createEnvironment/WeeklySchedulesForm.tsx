import React, { useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  IconButton,
} from "@mui/material";
import { FormDataCreateEnv } from "@/types/Environments";
import { DeleteOutline } from "@mui/icons-material";

interface Props {
  formData: FormDataCreateEnv;
  setFormData: React.Dispatch<React.SetStateAction<FormDataCreateEnv>>;
}

const days = [
  { label: "Domingo", value: 0 },
  { label: "Lunes", value: 1 },
  { label: "Martes", value: 2 },
  { label: "Miércoles", value: 3 },
  { label: "Jueves", value: 4 },
  { label: "Viernes", value: 5 },
  { label: "Sábado", value: 6 },
];

const toTimeString = (minutes: number) => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

const toMinutes = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const WeeklySchedulesForm: React.FC<Props> = ({ formData, setFormData }) => {
  const [error, setError] = React.useState<string | null>(null);

  const validateOverlap = (
    day: number,
    start: number,
    end: number,
    indexToIgnore: number
  ) => {
    return formData.weeklySchedules.some((s, idx) => {
      if (idx === indexToIgnore || s.DayOfWeek !== day) return false;
      return start < s.EndTime && end > s.StartTime;
    });
  };

  const addSchedule = () => {
    setFormData((prev) => ({
      ...prev,
      weeklySchedules: [
        ...prev.weeklySchedules,
        {
          DayOfWeek: 0, // domingo por defecto
          StartTime: 0, // 12:00 AM
          EndTime: 1439, // 11:59 PM
        },
      ],
    }));
  };

  const removeSchedule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      weeklySchedules: prev.weeklySchedules.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    setError("")
  }, [formData.weeklySchedules])

  const handleChange = (
    index: number,
    field: keyof FormDataCreateEnv["weeklySchedules"][0],
    value: string
  ) => {
    const updated = [...formData.weeklySchedules];
    const newValue = field === "DayOfWeek" ? Number(value) : toMinutes(value);
    updated[index] = { ...updated[index], [field]: newValue };

    const { DayOfWeek, StartTime, EndTime } = updated[index];

    if (field === "StartTime" || field === "EndTime") {
      const start = field === "StartTime" ? newValue : StartTime;
      const end = field === "EndTime" ? newValue : EndTime;

      if (start >= end) {
        setError("La hora de inicio debe ser menor a la hora de fin.");
        return;
      }

      if (validateOverlap(DayOfWeek, start, end, index)) {
        setError("El horario se superpone con otro horario en el mismo día.");
        return;
      }

      setError(null);
    }

    if (field === "DayOfWeek") {
      if (validateOverlap(newValue, StartTime, EndTime, index)) {
        setError("El horario se superpone con otro horario en el mismo día.");
        return;
      }
      setError(null);
    }

    setFormData((prev) => ({ ...prev, weeklySchedules: updated }));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Horarios Semanales
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Configura los días y horarios en los que el ambiente está disponible. Si
        un día no está disponible, simplemente no lo agregues. <br />
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {formData.weeklySchedules.map((schedule, index) => (
        <Box key={index} display="flex" gap={3} mb={2}>
          <TextField
            select
            label="Día"
            value={schedule.DayOfWeek}
            onChange={(e) => handleChange(index, "DayOfWeek", e.target.value)}
            fullWidth
          >
            {days.map((day) => (
              <MenuItem key={day.value} value={day.value}>
                {day.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Hora Inicio"
            type="time"
            value={toTimeString(schedule.StartTime)}
            onChange={(e) => handleChange(index, "StartTime", e.target.value)}
            inputProps={{ step: 60 }}
            fullWidth
          />

          <TextField
            label="Hora Fin"
            type="time"
            value={toTimeString(schedule.EndTime)}
            onChange={(e) => handleChange(index, "EndTime", e.target.value)}
            inputProps={{ step: 60 }}
            fullWidth
          />

          <IconButton
            color="error"
            onClick={() => removeSchedule(index)}
            size="small"
          >
            <DeleteOutline />
          </IconButton>
        </Box>
      ))}

      <Button variant="outlined" onClick={addSchedule}>
        Agregar horario
      </Button>
    </Box>
  );
};

export default WeeklySchedulesForm;
