"use client";
import React, { useState } from "react";
import { Button, useMediaQuery, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment, { Moment } from "moment";
import { useRouter } from "next/navigation";
import { ColorPalette } from "@/utils/constants/ui-constants";
import SearchDesktop from "./SearchDesktop";
import SearchDialog from "./SearchDialog";
import FiltersModal from "@/components/modal/FiltersModal";
import { PageRoutes } from "@/utils/constants/page-routes";

const SearchComponent = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [selectedEnv, setSelectedEnv] = useState("hospedajes");

  const [city, setCity] = useState("Cochabamba, Bolivia");

  const [startDate, setStartDate] = useState<Moment | null>(moment());
  const [endDate, setEndDate] = useState<Moment | null>(moment().add(1, "day"));
  const [startTime, setStartTime] = useState<Moment | null>(
    moment().hour(9).minute(0)
  );
  const [endTime, setEndTime] = useState<Moment | null>(
    moment().hour(19).minute(0)
  );
  const [minCapacity, setMinCapacity] = useState(0);

  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [instantBooking, setInstantBooking] = useState<boolean>(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [areaCounts, setAreaCounts] = useState<Record<string, number>>({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSearch = () => {
    const params = new URLSearchParams();

    params.set("city", city);
    params.set("type", selectedEnv);
    params.set("startDate", startDate?.toISOString() || "");
    params.set("endDate", endDate?.toISOString() || "");
    params.set("startTime", startTime?.format("HH:mm") || "");
    params.set("endTime", endTime?.format("HH:mm") || "");

    params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 2000) {
      params.set("maxPrice", priceRange[1].toString());
    }

    params.set("minCapacity", minCapacity.toString());

    params.set("instantBooking", instantBooking.toString());

    if (selectedServices.length) {
      params.set("services", selectedServices.join(","));
    }

    for (const [key, value] of Object.entries(areaCounts)) {
      if (value > 0) params.append(`area_${key}`, value.toString());
    }

    router.push(`/${PageRoutes.Search}?${params.toString()}`);
  };

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
            handleSearch={handleSearch}
            setFiltersOpen={setFiltersOpen}
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
          handleSearch={handleSearch}
          setFiltersOpen={setFiltersOpen}
        />

        <FiltersModal
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          instantBooking={instantBooking}
          setInstantBooking={setInstantBooking}
          selectedServices={selectedServices}
          setSelectedServices={setSelectedServices}
          areaCounts={areaCounts}
          setAreaCounts={setAreaCounts}
          selectedEnv={selectedEnv}
          minCapacity={minCapacity}
          setMinCapacity={setMinCapacity}
        />
      </>
    </LocalizationProvider>
  );
};

export default SearchComponent;
