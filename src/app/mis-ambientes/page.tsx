"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Container } from "@mui/material";
import { PageRoutes } from "@/utils/constants/page-routes";
import ResponsiveFab from "@/components/buttons/ResponsiveFabButton";
import { Environment } from "@/types/AllEnvironments";
import EnvironmentGrid from "@/components/grid/EnvironmentGrid";

const EnvironmentsPage = () => {
  const router = useRouter();
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 16;

  useEffect(() => {
    const fetchOwnerEnvironments = async () => {
      try {
        const res = await fetch(
          "http://localhost:5150/api/environments/owner?page=1&limit=10",
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await res.json();
        setEnvironments(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch {
        alert("Error cargando tus ambientes");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerEnvironments();
  }, [page, searchParams]);

  const handleFabAdd = () => {
    router.push(PageRoutes.New_Environment);
  };

  const handlePageChange = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", value.toString());
    router.push(`/${PageRoutes.Owner_Single_Environment}?${params.toString()}`);
  };

  return (
    <Box>
      <Box sx={{ p: 3 }}></Box>

      <EnvironmentGrid
        environments={environments}
        loading={loading}
        totalPages={totalPages}
        page={page}
        onPageChange={handlePageChange}
        emptyMessage="Aún no has creado ningún ambiente"
      />

      <ResponsiveFab onClick={handleFabAdd} />
    </Box>
  );
};

export default EnvironmentsPage;
