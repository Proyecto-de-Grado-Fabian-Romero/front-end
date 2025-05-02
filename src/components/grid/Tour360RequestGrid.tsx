import { Box, Grid, Pagination, Skeleton, Typography } from "@mui/material";
import Tour360RequestCard from "../card/Tour360RequestCard";

type Tour360Request = {
  environmentId: string;
  environmentName: string;
  ownerId: string;
  requestDate: number;
  scheduledDate?: number;
  status: string;
  technicianName?: string;
  notes?: string;
};

type Props = {
  requests: Tour360Request[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (value: number) => void;
};

const Tour360RequestsGrid = ({
  requests,
  loading,
  page,
  totalPages,
  onPageChange,
}: Props) => {
  const limit = 8;

  if (loading) {
    return (
      <Grid container spacing={2}>
        {Array.from(new Array(limit)).map((_, index) => (
          <Grid key={index + "load"} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (requests.length === 0) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6" gutterBottom>
          No hay solicitudes encontradas.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {requests.map((request) => (
          <Grid key={request.environmentId} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Tour360RequestCard
              environmentName={request.environmentName}
              status={request.status}
              requestDate={request.requestDate}
              scheduledDate={request.scheduledDate}
            />
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
  );
};

export default Tour360RequestsGrid;
