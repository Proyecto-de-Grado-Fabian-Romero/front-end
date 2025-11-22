"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserRole } from "@/types/Users";
import { getTour360Requests } from "@/services/adminService";
import Tour360RequestsTable from "@/components/table/Tour360RequestsTable";
import Tour360Filter from "@/components/inputs/select/Tour360Filter";
import { PageRoutes } from "@/utils/constants/page-routes";
import { Tour360Request } from "@/types/Tour360Request";
import { Container, Typography, Box } from "@mui/material";

const ClientTour360RequestsPage = () => {
  const [requests, setRequests] = useState<Tour360Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = 16;
  const statusFilter = parseInt(searchParams.get("status") || "0");

  useEffect(() => {
    if (user.role !== UserRole.Admin) router.replace("/");
  }, [user.role, router]);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await getTour360Requests(
          page,
          limit,
          statusFilter.valueOf(),
        );
        setRequests(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch {
        alert("Hubo un error cargando las solicitudes, inténtalo de nuevo");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [page, statusFilter]);

  const handlePageChange = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", value.toString());
    router.push(`${PageRoutes.Shots_360}?${params.toString()}`);
  };

  const handleStatusChange = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("status", value.toString());
    } else {
      params.set("status", "0");
    }
    params.set("page", "1");
    router.push(`${PageRoutes.Shots_360}?${params.toString()}`);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        py: 6,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <Typography variant="h4" mt={10} mb={4}>
        Solicitudes de Capturas 360
      </Typography>

      <Box display="flex" justifyContent="flex-end">
        <Tour360Filter
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
        />
      </Box>

      <Tour360RequestsTable
        requests={requests}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <br />
    </Container>
  );
};

export default ClientTour360RequestsPage;
