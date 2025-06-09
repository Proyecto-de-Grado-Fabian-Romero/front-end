"use client";

import {
  Box,
  Typography,
  Slider,
  Switch,
  IconButton,
  Modal,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  FormControlLabel as RadioControlLabel,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { ColorPalette } from "@/utils/constants/ui-constants";
import { fetchAvailableEquipment } from "@/services/environmentService";
import { CLASS_ID_TO_NAME } from "@/utils/constants/class-names";

interface FiltersModalProps {
  open: boolean;
  onClose: () => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  instantBooking: boolean;
  setInstantBooking: (value: boolean) => void;
  selectedServices: string[];
  setSelectedServices: (services: string[]) => void;
  areaCounts: Record<string, number>;
  setAreaCounts: (counts: Record<string, number>) => void;
  selectedEnv: string;
  minCapacity: number;
  setMinCapacity: React.Dispatch<React.SetStateAction<number>>;
}

export default function FiltersModal({
  open,
  onClose,
  priceRange,
  setPriceRange,
  instantBooking,
  setInstantBooking,
  selectedServices,
  setSelectedServices,
  areaCounts,
  setAreaCounts,
  selectedEnv,
  minCapacity,
  setMinCapacity,
}: FiltersModalProps) {
  const areas = useSelector((state: RootState) => state.options.areas);
  const services = useSelector((state: RootState) => state.options.services);

  const [expandedServices, setExpandedServices] = useState(false);
  const [expandedAreas, setExpandedAreas] = useState(false);
  const [availableEquipment, setAvailableEquipment] = useState<
    { name: string; count: number }[]
  >([]);

  useEffect(() => {
    if (open) {
      const params = new URLSearchParams(window.location.search);
      fetchAvailableEquipment(params)
        .then(setAvailableEquipment)
        .catch((e) => console.error("Error loading equipment", e));
    }
  }, [open]);

  const handleCountChange = (
    key: string,
    delta: number,
    state: Record<string, number>,
    setState: (s: Record<string, number>) => void,
    maxLimit = Infinity,
  ) => {
    const newValue = Math.max(0, Math.min((state[key] || 0) + delta, maxLimit));
    setState({
      ...state,
      [key]: newValue,
    });
  };

  const toggleService = (key: string) => {
    setSelectedServices(
      selectedServices.includes(key)
        ? selectedServices.filter((s) => s !== key)
        : [...selectedServices, key],
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translate(-50%, 0)",
          width: "90%",
          maxWidth: 600,
          maxHeight: "80vh",
          bgcolor: "background.paper",
          p: 3,
          borderRadius: 2,
          boxShadow: 24,
          overflowY: "auto",
        }}
      >
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="h6" fontWeight={700} gutterBottom>
          Elige un rango de precios{" "}
          {selectedEnv === "hospedajes" ? "(por noche)" : ""}
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Typography>Desde: Bs. {priceRange[0]}</Typography>
          <Typography>
            Hasta: Bs. {priceRange[1] >= 2000 ? "2000+" : priceRange[1]}
          </Typography>
        </Box>
        <Slider
          value={priceRange[1] >= 2000 ? [priceRange[0], 2000] : priceRange}
          onChange={(_, val) => setPriceRange(val as number[])}
          min={0}
          max={2000}
        />

        <Box my={2}>
          <FormControlLabel
            control={
              <Switch
                checked={instantBooking}
                onChange={() => setInstantBooking(!instantBooking)}
              />
            }
            label="Reserva Inmediata"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Servicios
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {(expandedServices ? services : services.slice(0, 6)).map((s) => (
            <Chip
              key={s.publicKey}
              label={s.name}
              variant={
                selectedServices.includes(s.publicKey) ? "filled" : "outlined"
              }
              onClick={() => toggleService(s.publicKey)}
              color="primary"
              sx={{
                backgroundColor: selectedServices.includes(s.publicKey)
                  ? `${ColorPalette.PRIMARY_DEFAULT} !important`
                  : `${ColorPalette.NEUTRAL_WHITE} !important`,
                fontWeight: selectedServices.includes(s.publicKey) ? 600 : 500,
                color: selectedServices.includes(s.publicKey) ? "#fff" : "#000",
                transition: "none",
              }}
            />
          ))}
        </Box>
        <Button
          onClick={() => setExpandedServices((prev) => !prev)}
          endIcon={expandedServices ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ mt: 1 }}
        >
          {expandedServices ? "Mostrar menos" : "Mostrar más"}
        </Button>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Áreas
        </Typography>
        {(expandedAreas ? areas : areas.slice(0, 3)).map((area) => (
          <Box
            key={area.publicKey}
            display="flex"
            justifyContent="space-between"
            my={1}
          >
            <Typography>{area.name}</Typography>
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={() =>
                  handleCountChange(
                    area.publicKey,
                    -1,
                    areaCounts,
                    setAreaCounts,
                  )
                }
              >
                <RemoveIcon />
              </IconButton>
              <Typography>
                {areaCounts[area.publicKey] >= 4
                  ? "4+"
                  : areaCounts[area.publicKey] || 0}
              </Typography>
              <IconButton
                onClick={() =>
                  handleCountChange(
                    area.publicKey,
                    1,
                    areaCounts,
                    setAreaCounts,
                    4,
                  )
                }
                disabled={areaCounts[area.publicKey] >= 4}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
        <Button
          onClick={() => setExpandedAreas((prev) => !prev)}
          endIcon={expandedAreas ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ mt: 1 }}
        >
          {expandedAreas ? "Mostrar menos" : "Mostrar más"}
        </Button>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Equipamiento
        </Typography>
        {availableEquipment.map((item) => (
          <Box
            key={item.name}
            display="flex"
            justifyContent="space-between"
            my={1}
          >
            <Typography>{CLASS_ID_TO_NAME[item.name]}</Typography>
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={() =>
                  handleCountChange(item.name, -1, areaCounts, setAreaCounts)
                }
              >
                <RemoveIcon />
              </IconButton>
              <Typography>
                {areaCounts[item.name] >= 4 ? "4+" : areaCounts[item.name] || 0}
              </Typography>
              <IconButton
                onClick={() =>
                  handleCountChange(item.name, 1, areaCounts, setAreaCounts, 4)
                }
                disabled={areaCounts[item.name] >= 4}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <FormLabel component="legend" sx={{ fontWeight: 600 }}>
            Cantidad de asistentes
          </FormLabel>
          {selectedEnv === "hospedajes" ? (
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton
                onClick={() => setMinCapacity((prev) => Math.max(prev - 1, 1))}
              >
                <RemoveIcon />
              </IconButton>
              <Typography variant="h6">{minCapacity}</Typography>
              <IconButton onClick={() => setMinCapacity((prev) => prev + 1)}>
                <AddIcon />
              </IconButton>
            </Box>
          ) : (
            <RadioGroup
              value={minCapacity}
              onChange={(e) => setMinCapacity(parseInt(e.target.value))}
            >
              <Grid container>
                <Grid size={{ xs: 6 }}>
                  <RadioControlLabel
                    value={1}
                    control={<Radio />}
                    label="1 - 5 personas"
                  />
                  <RadioControlLabel
                    value={5}
                    control={<Radio />}
                    label="5 - 10 personas"
                  />
                  <RadioControlLabel
                    value={10}
                    control={<Radio />}
                    label="10 - 20 personas"
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <RadioControlLabel
                    value={20}
                    control={<Radio />}
                    label="20 - 50 personas"
                  />
                  <RadioControlLabel
                    value={50}
                    control={<Radio />}
                    label="50+ personas"
                  />
                </Grid>
              </Grid>
            </RadioGroup>
          )}
        </FormControl>

        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={onClose}>
            Aplicar filtros
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
