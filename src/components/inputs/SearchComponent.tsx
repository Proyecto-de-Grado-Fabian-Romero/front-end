import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const environments = [
  "Hospedajes",
  "Oficinas",
  "Coworkings",
  "Eventos",
  "Salas de Conferencias",
];
const cities = [
  "Cochabamba, Bolivia",
  "La Paz, Bolivia",
  "Santa Cruz, Bolivia",
];

const SearchComponent = () => {
  const [open, setOpen] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState("");
  const [city, setCity] = useState("Cochabamba, Bolivia");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <>
        {isMobile ? (
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            fullWidth
            sx={{
              borderRadius: 4,
              backgroundColor: "white",
              color: "black",
              justifyContent: "flex-start",
              px: 2,
            }}
            startIcon={<SearchIcon sx={{ color: "orangered" }} />}
          >
            Empieza tu búsqueda
          </Button>
        ) : (
          <Grid container spacing={2} alignItems="center">
            <Grid>
              <TextField
                label="What are you planning?"
                defaultValue="Christmas Party"
              />
            </Grid>
            <Grid>
              <TextField label="Where?" defaultValue="Los Angeles, CA" />
            </Grid>
            <Grid>
              <TextField label="When?" defaultValue="Anytime" />
            </Grid>
            <Grid>
              <Button
                variant="contained"
                color="success"
                startIcon={<SearchIcon />}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        )}

        <Dialog
          fullScreen={isMobile}
          open={open}
          onClose={() => setOpen(false)}
        >
          <DialogTitle>
            <Typography variant="h6">
              ¿Qué tipo de ambiente estás buscando?
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setOpen(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {environments.map((env) => (
                <Grid size={{ xs: 6 }} key={env}>
                  <Button
                    fullWidth
                    variant={selectedEnv === env ? "contained" : "outlined"}
                    onClick={() => setSelectedEnv(env)}
                  >
                    {env}
                  </Button>
                </Grid>
              ))}
            </Grid>

            <Typography mt={3} variant="subtitle1">
              ¿Cuándo necesitas el ambiente?
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <DatePicker
                  label="Llegada"
                  value={startDate}
                  onChange={setStartDate}
                //   renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DatePicker
                  label="Salida"
                  value={endDate}
                  onChange={setEndDate}
                //   renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </Grid>
            </Grid>

            <Typography mt={3} variant="subtitle1">
              ¿En qué ciudad buscas alquilar?
            </Typography>
            <TextField
              select
              fullWidth
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              {cities.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, borderRadius: 2 }}
              startIcon={<SearchIcon />}
              onClick={() => setOpen(false)}
            >
              Buscar Ahora
            </Button>
          </DialogContent>
        </Dialog>
      </>
    </LocalizationProvider>
  );
};

export default SearchComponent;
