"use client";
import React, { useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import moment from "moment";
import { ColorPalette } from "@/utils/constants/ui-constants";
import DatesSearch from "./DatesSearch";
import { cities, environments } from "@/utils/constants/constants";
import { FilterList } from "@mui/icons-material";

interface SearchDesktopProps {
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
  handleSearch: () => void;
  setFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchDesktop: React.FC<SearchDesktopProps> = ({
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
  handleSearch,
  setFiltersOpen,
}) => {
  const [openDatesModal, setOpenDatesModal] = useState(false);

  const formatDateRange = () => {
    if (!startDate || !endDate) return "";
    const startStr = startDate.format("DD MMM");
    if (selectedEnv === "hospedajes")
      return `${startStr} - ${endDate.format("DD MMM")}`;
    if (startTime && endTime)
      return `${startTime.format("DD MMM")} ● ${startTime.format("HH:mm")} - ${endTime.format("HH:mm")}`;
    return startStr;
  };

  return (
    <>
      <Grid
        container
        spacing={1}
        alignItems="center"
        sx={{
          backgroundColor: ColorPalette.NEUTRAL_WHITE,
          padding: "20px 24px",
          borderRadius: 4,
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <TextField
            select
            label="Tipo de ambiente"
            value={selectedEnv}
            onChange={(e) => setSelectedEnv(e.target.value)}
            fullWidth
          >
            {environments.map((env) => (
              <MenuItem key={env.key} value={env.key}>
                {env.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <TextField
            select
            label="Ciudad"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
          >
            {cities.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <TextField
            label="Fechas"
            value={formatDateRange()}
            onClick={() => setOpenDatesModal(true)}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid
          size={{ xs: 12, sm: 12, md: 3 }}
          display={"flex"}
          alignItems="center"
        >
          <Button
            variant="contained"
            color="success"
            startIcon={<SearchIcon />}
            sx={{
              height: "52px",
              flex: 1,
              minWidth: 0,
            }}
            onClick={handleSearch}
          >
            Buscar
          </Button>
          <IconButton
            sx={{
              backgroundColor: ColorPalette.SECONDARY_DEFAULT,
              color: ColorPalette.NEUTRAL_WHITE,
              ml: 1,
              flexShrink: 0,
            }}
            onClick={() => setFiltersOpen(true)}
          >
            <FilterList fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>

      <Dialog
        open={openDatesModal}
        onClose={() => setOpenDatesModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Seleccionar fechas</DialogTitle>
        <DialogContent>
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDatesModal(false)}
            sx={{ mt: 2 }}
            fullWidth
          >
            Confirmar
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchDesktop;
