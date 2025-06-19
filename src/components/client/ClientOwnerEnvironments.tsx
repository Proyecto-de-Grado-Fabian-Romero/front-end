"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { PageRoutes } from "@/utils/constants/page-routes";
import ResponsiveFab from "@/components/buttons/ResponsiveFabButton";
import { Environment } from "@/types/AllEnvironments";
import EnvironmentGrid from "@/components/grid/EnvironmentGrid";
import { getOwnerEnvironments } from "@/services/environmentService";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserRole } from "@/types/Users";

const ClientOwnerEnvironments = () => {
  const router = useRouter();
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 16;

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user.role !== UserRole.Owner) router.replace(`/`);
  }, [router, user.role]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getOwnerEnvironments(page, limit);
        setEnvironments(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch {
        alert("Hubo un error cargando los ambientes, inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handleFabAdd = () => {
    router.push(PageRoutes.New_Environment);
  };

  const handlePageChange = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", value.toString());
    router.push(`/${PageRoutes.Owner_Single_Environment}?${params.toString()}`);
  };

  return (
    <>
      <Box sx={{ p: 3 }}></Box>

      <Typography variant="h4" mt={24}>MIS AMBIENTES</Typography>

      <EnvironmentGrid
        environments={environments}
        loading={loading}
        totalPages={totalPages}
        page={page}
        onPageChange={handlePageChange}
        emptyMessage="Aún no has creado ningún ambiente"
      />

      <ResponsiveFab onClick={handleFabAdd} />
    </>
  );
};

export default ClientOwnerEnvironments;
