"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Environment } from "@/types/AllEnvironments";
import { PageRoutes } from "@/utils/constants/page-routes";
import EnvironmentGrid from "@/components/grid/EnvironmentGrid";
import { fetchEnvironments } from "@/services/environmentService";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const EnvironmentsPage = () => {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();

  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 16;

  useEffect(() => {
    const loadEnvironments = async () => {
      try {
        setLoading(true);
        const data = await fetchEnvironments(searchParams, page, limit);
        setEnvironments(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch {
        alert("Hubo un error, recarga la página por favor.");
      } finally {
        setLoading(false);
      }
    };

    loadEnvironments();
  }, [searchParams, page, limit]);

  const handlePageChange = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", value.toString());
    router.push(`/${PageRoutes.Search}?${params.toString()}`);
  };

  return (
    <EnvironmentGrid
      environments={environments.filter((env) => env.ownerId !== user.publicId)}
      loading={loading}
      totalPages={totalPages}
      page={page}
      onPageChange={handlePageChange}
      emptyMessage="No hay Ambientes que coincidan con tu criterio de búsqueda"
    />
  );
};

export default EnvironmentsPage;
