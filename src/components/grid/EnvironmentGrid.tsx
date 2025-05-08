"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  Skeleton,
  Typography,
  Pagination,
} from "@mui/material";
import EnvironmentCard from "@/components/card/EnvironmentCard";
import { useRouter } from "next/navigation";
import { Environment } from "@/types/AllEnvironments";

type Props = {
  environments: Environment[];
  loading: boolean;
  totalPages: number;
  page: number;
  onPageChange: (value: number) => void;
  emptyMessage?: string;
};

const EnvironmentGrid = ({
  environments,
  loading,
  totalPages,
  page,
  onPageChange,
  emptyMessage = "No hay ambientes disponibles",
}: Props) => {
  const router = useRouter();

  return (
    <Container maxWidth={false} sx={{ py: 4, width: "100%" }}>
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
            {emptyMessage}
          </Typography>
          <Button variant="contained" onClick={() => router.back()}>
            Volver atrás
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            {environments.map((env) => (
              <Grid key={env.publicId} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <EnvironmentCard environment={env} />
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 && (
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, val) => onPageChange(val)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default EnvironmentGrid;
