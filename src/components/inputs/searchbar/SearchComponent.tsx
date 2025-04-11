"use client";
import React, { useState } from "react";
import { Button, useMediaQuery, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment, { Moment } from "moment";
import { ColorPalette } from "@/utils/constants/ui-constants";
import SearchDesktop from "./SearchDesktop";
import SearchDialog from "./SearchDialog";

const SearchComponent = () => {
  const [open, setOpen] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState("Hospedajes");
  const [city, setCity] = useState("Cochabamba, Bolivia");
  const [startDate, setStartDate] = useState<Moment | null>(moment());
  const [endDate, setEndDate] = useState<Moment | null>(moment());
  const [startTime, setStartTime] = useState<Moment | null>(
    moment().hour(9).minute(0)
  );
  const [endTime, setEndTime] = useState<Moment | null>(
    moment().hour(19).minute(0)
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <>
        {isMobile ? (
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            fullWidth
            sx={{
              borderRadius: 4,
              backgroundColor: `${ColorPalette.NEUTRAL_WHITE} !important`,
              color: `${ColorPalette.NEUTRAL_BLACK} !important`,
              justifyContent: "flex-start",
              px: 2,
            }}
            startIcon={<SearchIcon sx={{ color: "orangered" }} />}
          >
            Empieza tu búsqueda
          </Button>
        ) : (
          <SearchDesktop
            startDate={startDate}
            endDate={endDate}
            startTime={startTime}
            endTime={endTime}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setStartTime={setStartTime}
            setEndTime={setEndTime}
            selectedEnv={selectedEnv}
            setSelectedEnv={setSelectedEnv}
            city={city}
            setCity={setCity}
          />
        )}

        <SearchDialog
          startDate={startDate}
          endDate={endDate}
          startTime={startTime}
          endTime={endTime}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
          selectedEnv={selectedEnv}
          setSelectedEnv={setSelectedEnv}
          city={city}
          setCity={setCity}
          open={open}
          setOpen={setOpen}
        />
      </>
    </LocalizationProvider>
  );
};

export default SearchComponent;
