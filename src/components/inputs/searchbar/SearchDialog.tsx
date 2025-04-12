"use client";
import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  Grid,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { ColorPalette } from "@/utils/constants/ui-constants";
import DatesSearch from "./DatesSearch";
import { cities, environments } from "@/utils/constants/constants";
import { FilterList } from "@mui/icons-material";

interface SearchDialogProps {
  startDate: moment.Moment | null;
  endDate: moment.Moment | null;
  setStartDate: React.Dispatch<React.SetStateAction<moment.Moment | null>>;
  setEndDate: React.Dispatch<React.SetStateAction<moment.Moment | null>>;
  startTime: moment.Moment | null;
  endTime: moment.Moment | null;
  setStartTime: React.Dispatch<React.SetStateAction<moment.Moment | null>>;
  setEndTime: React.Dispatch<React.SetStateAction<moment.Moment | null>>;
  selectedEnv: string;
  setSelectedEnv: React.Dispatch<React.SetStateAction<string>>;
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchDialog: React.FC<SearchDialogProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
  selectedEnv,
  city,
  setCity,
  setSelectedEnv,
  open,
  setOpen,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog fullScreen={isMobile} open={open} onClose={() => setOpen(false)}>
      <DialogTitle>
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
          <Typography variant="subtitle1" sx={{ display: "block" }}>
            ¿Qué tipo de ambiente estás buscando?
          </Typography>
          {environments.map((env) => (
            <Chip
              key={env}
              label={env}
              sx={{
                backgroundColor:
                  selectedEnv === env
                    ? `${ColorPalette.PRIMARY_DEFAULT} !important`
                    : `${ColorPalette.NEUTRAL_WHITE} !important`,
                fontWeight: selectedEnv === env ? 600 : 500,
                color: selectedEnv === env ? "#fff" : "#000",
                transition: "none",
              }}
              onClick={() => setSelectedEnv(env)}
            />
          ))}
        </Grid>

        <Typography mt={3} variant="subtitle1">
          ¿Cuándo necesitas el ambiente?
        </Typography>
        <DatesSearch
          startDate={startDate}
          endDate={endDate}
          startTime={startTime}
          endTime={endTime}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
          selectedEnv={selectedEnv}
        />

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

        <Grid
          container
          spacing={1}
          alignItems="center"
          justifyContent={"center"}
          mt={3}
        >
          <Grid size={{ xs: 10 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ borderRadius: 2 }}
              startIcon={<SearchIcon />}
              onClick={() => setOpen(false)}
            >
              Buscar Ahora
            </Button>
          </Grid>
          <Grid size={{ xs: 2 }}>
            <IconButton
              sx={{
                backgroundColor: ColorPalette.SECONDARY_DEFAULT,
                color: ColorPalette.NEUTRAL_WHITE,
              }}
            >
              <FilterList fontSize="medium" />
            </IconButton>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
