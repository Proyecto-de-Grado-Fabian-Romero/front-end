"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CircularProgress, Container, Typography } from "@mui/material";
import { getEnvironmentByPublicId } from "@/services/environmentService";
import CreateEnvironmentForm from "@/components/form/createEnvironment/CreateEnvironmentForm";
import { Environment } from "@/types/GetEnvironment";

const EditEnvironmentPage = () => {
  const { publicId } = useParams(); 
  const [data, setData] = useState<Environment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnvironment = async () => {
      try {
        if (typeof publicId === "string") {
          const res = await getEnvironmentByPublicId(publicId);
          setData(res);
        }
      } catch (err) {
        console.error("Error al cargar ambiente:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnvironment();
  }, [publicId]);

  if (loading) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={2}>Cargando ambiente...</Typography>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <Typography color="error">No se encontró el ambiente</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: 6 }}>
      <CreateEnvironmentForm initialData={data} />
    </Container>
  );
};

export default EditEnvironmentPage;
