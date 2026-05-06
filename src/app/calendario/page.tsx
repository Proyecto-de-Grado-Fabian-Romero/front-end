"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Pagination,
  Skeleton,
} from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserRole } from "@/types/Users";
import {
  getMyReservations,
  getMyReservationsByDay,
} from "@/services/reservationService";
import { ReservationResponse } from "@/types/Reservations";
import ReservationList from "@/components/card/ReservationList";
import ExpandableCalendar from "@/components/calendar/ExpandableCalendar";
import { PageRoutes } from "@/utils/constants/page-routes";
import moment, { Moment } from "moment";
import { Suspense } from "react";

const MyReservationsPageContent = () => {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Moment>(moment());

  const status = searchParams.get("status") || "confirmed";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const type = searchParams.get("type");
  const [currentType, setCurrentType] = useState<string>("others");

  useEffect(() => {
    if (!user.role) return;

    let newType: string;

    if (type) {
      newType = type;
    } else {
      newType = user.role === UserRole.Owner ? "mine" : "others";
    }

    setCurrentType(newType);
  }, [user.role, type]);

  useEffect(() => {
    if (!user.role) router.replace(`/`);
  }, [router, user.role]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let data;

        if (selectedDate) {
          const scheduledDayTimestamp = selectedDate
            .utcOffset(-4 * 60)
            .startOf("day")
            .unix();

          data = await getMyReservationsByDay(
            scheduledDayTimestamp,
            status,
            page,
            limit,
            currentType,
          );
        } else {
          data = await getMyReservations(status, page, limit, currentType);
        }

        setReservations(data.items);
        setTotalPages(data.totalPages);
      } catch {
        alert("No se pudo obtener tus reservas, intenta de nuevo");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, page, limit, currentType, selectedDate, user.role]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("type", newValue);
    newParams.set("page", "1");
    router.push(`${PageRoutes.Calendar}?${newParams.toString()}`);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", page.toString());
    router.push(`${PageRoutes.Calendar}?${newParams.toString()}`);
  };

  const handleDateChange = (newValue: Moment) => {
    setSelectedDate(newValue);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.push(`${PageRoutes.Calendar}?${params.toString()}`);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 6, px: 2 }}>
      <Typography variant="h5" mb={2} mt={12}>
        Mis Reservas
      </Typography>

      <ExpandableCalendar
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        title="Seleccionar Día de las Reservas"
        defaultExpanded={true}
        timezoneOffset={-4}
      />

      {user.role === UserRole.Owner && (
        <Tabs value={currentType} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Reservas de mis ambientes" value="mine" />
          <Tab label="Reservas que hice" value="others" />
        </Tabs>
      )}

      {loading ? (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              height={110}
              variant="rectangular"
              sx={{ mb: 2 }}
            />
          ))}
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        </>
      ) : reservations.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" mt={4}>
          No hay reservas registradas.
        </Typography>
      ) : (
        <>
          <ReservationList reservations={reservations} />

          <Box display="flex" justifyContent="center" my={4}>
            <Pagination
              count={totalPages}
              page={page} // ← Esto SÍ debe reaccionar a cambios
              onChange={handlePageChange}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const MyReservationsPage = () => {
  return (
    <Suspense
      fallback={
        <Box display="flex" justifyContent="center" my={10}>
          <CircularProgress />
        </Box>
      }
    >
      <MyReservationsPageContent />
    </Suspense>
  );
};

export default MyReservationsPage;
