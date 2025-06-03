"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Avatar,
} from "@mui/material";
import moment, { Moment } from "moment";
import { getBlockedEnvironmentsByDay } from "@/services/availabilityService";

type Props = {
  date: Moment;
};

const BlockedEnvironments: React.FC<Props> = ({ date }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<
    {
      environmentTitle: string;
      environmentPhotoUrl?: string;
      startDate: number;
      endDate: number;
    }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlocked = async () => {
      try {
        setLoading(true);
        const timestamp = date.startOf("day").valueOf();
        const res = await getBlockedEnvironmentsByDay(timestamp);
        setItems(res);
      } catch (err) {
        setError("Error al cargar ambientes bloqueados.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlocked();
  }, [date]);

  if (loading) {
    return (
      <Box textAlign="center" mt={2}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!items.length) {
    return (
      <Box textAlign="center" mt={2}>
        <Typography>No hay ambientes bloqueados este día.</Typography>
      </Box>
    );
  }

  return (
    <Box mt={2}>
      <Typography variant="h6" mb={2}>
        Ambientes Bloqueados
      </Typography>

      {items.map((item, index) => {
        const start = moment(item.startDate).format("HH:mm");
        const end = moment(item.endDate).format("HH:mm");

        return (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 3 }}>
                  <Avatar
                    variant="rounded"
                    src={item.environmentPhotoUrl}
                    sx={{ width: "100%", height: 80 }}
                  />
                </Grid>
                <Grid size={{ xs: 9 }}>
                  <Typography fontWeight="bold">
                    {item.environmentTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {start} → {end}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default BlockedEnvironments;
