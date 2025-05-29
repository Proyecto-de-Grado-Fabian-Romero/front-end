"use client";

import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import Tour360Filter from "@/components/inputs/select/Tour360Filter";
import Tour360RequestsGrid from "@/components/grid/Tour360RequestGrid";
import { getTour360Requests } from "@/services/adminService";
import { PageRoutes } from "@/utils/constants/page-routes";
import { Tour360Request } from "@/types/Tour360Request";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserRole } from "@/types/Users";

const Tour360RequestsPage = () => {
  const [requests, setRequests] = useState<Tour360Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user.role !== UserRole.Admin) router.replace(`/`);
  }, [router, user.role]);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 8;
  const statusFilter = parseInt(searchParams.get("status") || "0");

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await getTour360Requests(page, limit, statusFilter);
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
      params.delete("status");
    }
    params.set("page", "1");
    router.push(`${PageRoutes.Shots_360}?${params.toString()}`);
  };

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <Typography variant="h4" mb={4} mt={5}>
        Solicitudes de Tour 360
      </Typography>

      <Box mb={4} display="flex" justifyContent="flex-end">
        <Tour360Filter
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
        />
      </Box>

      <Tour360RequestsGrid
        requests={requests}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default Tour360RequestsPage;
