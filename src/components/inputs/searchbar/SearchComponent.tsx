"use client";
import React, { useEffect, useState } from "react";
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
import { FilterList } from "@mui/icons-material";

const SearchComponent = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [selectedEnv, setSelectedEnv] = useState("hospedajes");

  const [city, setCity] = useState("Cochabamba, Bolivia");

  // iniciaremos con valores vacíos y los seteará useEffect
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const [startTime, setStartTime] = useState<Moment | null>(null);
  const [endTime, setEndTime] = useState<Moment | null>(null);

  const [minCapacity, setMinCapacity] = useState(0);

  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [instantBooking, setInstantBooking] = useState<boolean>(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [areaCounts, setAreaCounts] = useState<Record<string, number>>({});
  const [equipmentCounts, setEquipmentCounts] = useState<
    Record<string, number>
  >({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 🔹 Nuevo useEffect: lee params de la URL y setea valores iniciales
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    const cityParam = params.get("city");
    const typeParam = params.get("type");
    const startDateParam = params.get("startDate");
    const endDateParam = params.get("endDate");
    const startTimeParam = params.get("startTime");
    const endTimeParam = params.get("endTime");

    const minPriceParam = params.get("minPrice");
    const maxPriceParam = params.get("maxPrice");
    const minCapacityParam = params.get("minCapacity");
    const instantBookingParam = params.get("instantBooking");
    const servicesParam = params.get("services");

    if (cityParam) setCity(cityParam);
    if (typeParam) setSelectedEnv(typeParam);

    console.log(startTimeParam);

    if (startDateParam) setStartDate(moment(startDateParam));
    if (endDateParam) setEndDate(moment(endDateParam));
    if (startTimeParam && startDateParam) {
      setStartTime(
        moment(`${startDateParam} ${startTimeParam}`, "YYYY-MM-DD HH:mm"),
      );
    }
    if (endTimeParam && endDateParam) {
      setEndTime(moment(`${endDateParam} ${endTimeParam}`, "YYYY-MM-DD HH:mm"));
    }

    if (minPriceParam || maxPriceParam) {
      setPriceRange([
        Number(minPriceParam) || 0,
        Number(maxPriceParam) || 2000,
      ]);
    }

    if (minCapacityParam) setMinCapacity(Number(minCapacityParam));

    if (instantBookingParam) setInstantBooking(instantBookingParam === "true");

    if (servicesParam) setSelectedServices(servicesParam.split(","));

    const areaEntries: Record<string, number> = {};
    const equipmentEntries: Record<string, number> = {};

    params.forEach((value, key) => {
      if (key.startsWith("area_")) {
        const areaKey = key.replace("area_", "");
        areaEntries[areaKey] = Number(value);
      } else if (key.startsWith("equipment_")) {
        const eqKey = key.replace("equipment_", "");
        equipmentEntries[eqKey] = Number(value);
      }
    });

    if (Object.keys(areaEntries).length) setAreaCounts(areaEntries);
    if (Object.keys(equipmentEntries).length)
      setEquipmentCounts(equipmentEntries);
  }, []);

  const computeInitialDates = (env: string, searchParams: URLSearchParams) => {
    const hasAnyDateParam =
      searchParams.has("startDate") ||
      searchParams.has("endDate") ||
      searchParams.has("startTime") ||
      searchParams.has("endTime");

    if (hasAnyDateParam) return null;

    const now = moment();

    if (env === "hospedajes") {
      const start =
        now.hour() < 12
          ? now.clone().startOf("day")
          : now.clone().add(1, "day").startOf("day");
      const end = start.clone().add(1, "day");
      return {
        startDate: start,
        endDate: end,
        startTime: null,
        endTime: null,
      };
    }

    // no hospedaje:
    let startDateCandidate: moment.Moment;
    let startTimeCandidate: moment.Moment;

    if (now.hour() < 19) {
      let rounded = now.clone().startOf("hour").add(1, "hour");
      if (now.minutes() > 30) rounded = rounded.add(1, "hour");

      // si rounded cruza la medianoche, ponemos fecha mañana y hora 00:00 del día siguiente
      if (rounded.hour() > 23) {
        startDateCandidate = now.clone().add(1, "day").startOf("day");
        startTimeCandidate = startDateCandidate.clone().startOf("day");
      } else {
        startDateCandidate = now.clone().startOf("day");
        startTimeCandidate = rounded;
      }
    } else {
      startDateCandidate = now.clone().add(1, "day").startOf("day");
      startTimeCandidate = startDateCandidate.clone().hour(9).minute(0);
    }

    const endTimeCandidate = startTimeCandidate.clone().add(2, "hours");

    let endDateCandidate = startDateCandidate.clone();
    if (
      endTimeCandidate.isBefore(startTimeCandidate) ||
      endTimeCandidate.day() !== startTimeCandidate.day()
    ) {
      endDateCandidate = startDateCandidate.clone().add(1, "day");
    }

    return {
      startDate: startDateCandidate,
      endDate: endDateCandidate,
      startTime: startTimeCandidate,
      endTime: endTimeCandidate,
    };
  };
  // al montar y cada vez que cambie selectedEnv recalculamos
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const initial = computeInitialDates(selectedEnv, params);
    if (!initial) return;

    setStartDate(initial.startDate);
    setEndDate(initial.endDate);
    setStartTime(initial.startTime);
    setEndTime(initial.endTime);
  }, [selectedEnv]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    // const timestamps = buildTimestampsForRequest(startDate, endDate, startTime, endTime, selectedEnv === "hospedajes");

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

    for (const [key, value] of Object.entries(equipmentCounts)) {
      if (value > 0) params.append(`equipment_${key}`, value.toString());
    }

    router.push(`${PageRoutes.Search}?${params.toString()}`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es">
      <>
        {isMobile ? (
          <Button
            variant="outlined"
            onClick={() => setOpen(true)}
            disableElevation
            fullWidth
            sx={{
              borderRadius: 4,
              boxShadow: "none",
              backgroundColor: `${ColorPalette.NEUTRAL_WHITE} !important`,
              color: `${ColorPalette.NEUTRAL_BLACK} !important`,
              justifyContent: "flex-start",
              px: 2,
              alignItems: "flex-start",
              flexDirection: "column",
              textTransform: "none",
              py: 1.5,
            }}
          >
            {city || selectedEnv ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div
                    style={{ justifyContent: "flex-start", textAlign: "left" }}
                  >
                    <div style={{ display: "flex" }}>
                      <span style={{ fontWeight: 500 }}>
                        {selectedEnv.charAt(0).toUpperCase() +
                          selectedEnv.slice(1)}
                      </span>
                      <span style={{ margin: "0 4px" }}>·</span>
                      <span>{city}</span>
                    </div>
                    {startDate && endDate && (
                      <span
                        style={{
                          fontSize: "0.875rem",
                          color: "#6e6e6e",
                          marginTop: 2,
                          textAlign: "left",
                        }}
                      >
                        {`${moment(startDate).format("D MMM")} - ${moment(
                          endDate,
                        ).format("D MMM")}`}
                      </span>
                    )}
                  </div>

                  <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                    <div
                      style={{
                        backgroundColor: ColorPalette.PRIMARY_DEFAULT,
                        borderRadius: "20%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 44,
                        width: 44,
                      }}
                    >
                      <SearchIcon sx={{ color: "white", fontSize: 28 }} />
                    </div>
                    <div
                      style={{
                        border: `1px solid ${ColorPalette.NEUTRAL_BLACK}`,
                        borderRadius: "20%",
                        display: "flex",
                        alignItems: "center",
                        height: 44,
                        width: 44,
                        justifyContent: "center",
                      }}
                    >
                      <FilterList sx={{ fontSize: 28 }} />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              "Empieza tu búsqueda"
            )}
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
          equipmentCounts={equipmentCounts}
          setEquipmentCounts={setEquipmentCounts}
          selectedEnv={selectedEnv}
          minCapacity={minCapacity}
          setMinCapacity={setMinCapacity}
        />
      </>
    </LocalizationProvider>
  );
};

export default SearchComponent;
