"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import EnvironmentCard from "@/components/card/EnvironmentCard";
import { useRouter, useSearchParams } from "next/navigation";
import { Environment } from "@/types/AllEnvironments";

const EnvironmentsPage = () => {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchEnvironments = async () => {
      try {
        const areas: { AreaPublicKey: string; MinQuantity: number }[] = [];
        searchParams.forEach((value, key) => {
          if (key.startsWith("area_")) {
            areas.push({
              AreaPublicKey: key.replace("area_", ""),
              MinQuantity: parseInt(value),
            });
          }
        });

        const services = searchParams.get("services")?.split(",") || [];

        const requestBody = {
          location: searchParams.get("city") || undefined,
          environmentTypePublicKey: searchParams.get("type") || undefined,
          startDate: searchParams.get("startDate")
            ? Math.floor(
                new Date(searchParams.get("startDate")!).getTime() / 1000,
              )
            : undefined,
          endDate: searchParams.get("endDate")
            ? Math.floor(
                new Date(searchParams.get("endDate")!).getTime() / 1000,
              )
            : undefined,
          servicePublicKeys: services,
          areas,
          instantBookingRequired:
            searchParams.get("instantBooking") === "true" ? true : undefined,
          minPrice: searchParams.get("minPrice")
            ? parseFloat(searchParams.get("minPrice")!)
            : undefined,
          maxPrice: searchParams.get("maxPrice")
            ? parseFloat(searchParams.get("maxPrice")!)
            : undefined,
          minCapacity: searchParams.get("minCapacity")
            ? parseFloat(searchParams.get("minCapacity")!)
            : 0,
        };

        const res = await fetch(
          "http://localhost:5150/api/environments/available",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          },
        );

        const data = await res.json();
        setEnvironments(data.items || []);
      } catch {
        alert("Hubo un error, recarga la página por favor.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnvironments();
  }, [searchParams]);

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      {loading ? (
        <Grid container spacing={2} sx={{ width: "100%" }}>
          {Array.from(new Array(16)).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Skeleton variant="rectangular" height={300} />
            </Grid>
          ))}
        </Grid>
      ) : environments.length === 0 ? (
        <Box textAlign="center" mt={10}>
          <Typography variant="h6" gutterBottom>
            No hay Ambientes que coincidan con tu criterio de búsqueda
          </Typography>
          <Button variant="contained" onClick={() => router.back()}>
            Volver atrás
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ width: "100%" }}>
          {environments.map((env) => (
            <Grid key={env.publicId} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <EnvironmentCard environment={env} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default EnvironmentsPage;
