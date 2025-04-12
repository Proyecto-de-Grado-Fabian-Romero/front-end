"use client";
import React from "react";
import { Button, TextField, MenuItem, Grid, IconButton } from "@mui/material";
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
}) => {
  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      sx={{
        backgroundColor: ColorPalette.NEUTRAL_WHITE,
        padding: "20px 24px",
        borderRadius: 4,
      }}
    >
      <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
        <TextField
          select
          label="Tipo de ambiente"
          value={selectedEnv}
          onChange={(e) => setSelectedEnv(e.target.value)}
          fullWidth
        >
          {environments.map((env) => (
            <MenuItem key={env} value={env}>
              {env}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, sm: 4, md: 2 }}>
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

      <Grid size={{ xs: 12, sm: 4, md: 4 }}>
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
      </Grid>

      <Grid size={{ xs: 10, sm: 10, md: 3 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<SearchIcon />}
          fullWidth
          sx={{ height: "52px" }}
        >
          Buscar
        </Button>
      </Grid>
      <Grid size={{ xs: 2, sm: 2, md: 0.5 }}>
        <IconButton
          sx={{
            backgroundColor: ColorPalette.SECONDARY_DEFAULT,
            color: ColorPalette.NEUTRAL_WHITE,
          }}
        >
          <FilterList fontSize="large" />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default SearchDesktop;
