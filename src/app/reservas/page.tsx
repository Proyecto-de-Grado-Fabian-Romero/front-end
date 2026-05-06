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
import { getMyReservations } from "@/services/reservationService";
import { ReservationResponse } from "@/types/Reservations";
import { UserRole } from "@/types/Users";
import ReservationList from "@/components/card/ReservationList";
import { PageRoutes } from "@/utils/constants/page-routes";
import LoggedOutProfile from "@/components/profile/LoggedOutProfile";
import { Suspense } from "react";

const MyReservationsPageContent = () => {
  const user = useSelector((state: RootState) => state.user);
  const userRole = useSelector((state: RootState) => state.user.role);
  const isLoggedIn = !!user?.publicId;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const status = searchParams.get("status") || "confirmed";
  const page = Number.parseInt(searchParams.get("page") || "1", 10);
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10);

  const [currentType, setCurrentType] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !userRole) return;

    const type = searchParams.get("type");

    let newType: string;

    if (type) {
      newType = type;
    } else {
      newType = userRole === UserRole.Owner ? "mine" : "others";
    }

    setCurrentType(newType);
  }, [isLoggedIn, userRole, searchParams]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("type", newValue);
    newParams.set("page", "1");
    router.push(`${PageRoutes.Booking}?${newParams.toString()}`);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", page.toString());
    router.push(`${PageRoutes.Booking}?${newParams.toString()}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) return;
      if (!currentType) return;

      try {
        setLoading(true);
        const { items, totalPages } = await getMyReservations(
          status,
          page,
          limit,
          currentType,
        );
        setReservations(items);
        setTotalPages(totalPages);
      } catch {
        alert("No se pudo obtener tus reservas, intenta de nuevo");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, status, page, limit, currentType]);

  if (!isLoggedIn) {
    return (
      <LoggedOutProfile
        imageSrc="/images/illustrations/profile.svg"
        title="Inicia sesión para ver tus reservas"
      />
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 6, px: 2 }}>
      <Typography variant="h5" mb={2} mt={12}>
        Mis Reservas
      </Typography>

      {userRole === UserRole.Owner && (
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
              page={page}
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
