import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import moment from "moment";
import { getOwnerEnvironments } from "@/services/environmentService";
import { blockEnvironment } from "@/services/availabilityService";
import { Environment } from "@/types/GetEnvironment";
import Image from "next/image";

type BlockTimeDialogProps = {
  open: boolean;
  onClose: () => void;
  selectedDate: moment.Moment;
  existingBlocks: {
    environmentId: string;
    startDate: number;
    endDate: number;
  }[];
};

const BlockTimeDialog: React.FC<BlockTimeDialogProps> = ({
  open,
  onClose,
  selectedDate,
  existingBlocks,
}) => {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [environmentId, setEnvironmentId] = useState<string>("");
  const [startHour, setStartHour] = useState("00:00");
  const [endHour, setEndHour] = useState("23:59");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedEnvironment = environments.find(
    (e) => e.publicId === environmentId,
  );
  const isHospedaje = selectedEnvironment?.type.publicKey === "hospedajes";

  useEffect(() => {
    const load = async () => {
      const data = await getOwnerEnvironments();
      setEnvironments(data.items);
    };
    load();
  }, []);

  const handleBlock = async () => {
    setError(null);

    if (!environmentId) {
      setError("Debes seleccionar un ambiente.");
      return;
    }

    let startTime: number;
    let endTime: number;

    if (isHospedaje) {
      startTime = selectedDate.clone().startOf("day").valueOf();
      endTime = selectedDate.clone().endOf("day").valueOf();
    } else {
      const [startHourStr, startMinuteStr] = startHour.split(":");
      const [endHourStr, endMinuteStr] = endHour.split(":");

      startTime = selectedDate
        .clone()
        .set({
          hour: parseInt(startHourStr, 10),
          minute: parseInt(startMinuteStr, 10),
        })
        .valueOf();

      endTime = selectedDate
        .clone()
        .set({
          hour: parseInt(endHourStr, 10),
          minute: parseInt(endMinuteStr, 10),
        })
        .valueOf();
    }

    const hasConflict = existingBlocks.some((item) => {
      if (item.environmentId !== environmentId) return false;
      return (
        (startTime >= item.startDate && startTime < item.endDate) ||
        (endTime > item.startDate && endTime <= item.endDate) ||
        (startTime <= item.startDate && endTime >= item.endDate)
      );
    });

    if (hasConflict) {
      setError("Ya existe un bloqueo para este ambiente en ese horario.");
      return;
    }

    try {
      setLoading(true);
      await blockEnvironment({
        environmentId,
        startDate: startTime,
        endDate: endTime,
      });
      onClose();
    } catch {
      setError("Error al bloquear el horario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Bloquear horario</DialogTitle>
      <DialogContent>
        <Typography>
          Fecha seleccionada: <b>{selectedDate.format("DD MMM YYYY")}</b>
        </Typography>

        <Box mt={2}>
          <Select
            fullWidth
            value={environmentId}
            onChange={(e) => setEnvironmentId(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Selecciona un ambiente
            </MenuItem>
            {environments.map((env) => (
              <MenuItem key={env.publicId} value={env.publicId}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Image
                    src={env.photos?.[0].url}
                    alt={env.title}
                    width={40}
                    height={40}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                  />
                  <Typography>{env.title}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </Box>

        {!isHospedaje && (
          <Box mt={2} display="flex" gap={2}>
            <TextField
              label="Hora de inicio"
              type="time"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              fullWidth
            />
            <TextField
              label="Hora de fin"
              type="time"
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              fullWidth
            />
          </Box>
        )}

        {error && (
          <Box mt={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleBlock} variant="contained" disabled={loading}>
          Bloquear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlockTimeDialog;
