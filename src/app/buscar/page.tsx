"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";

interface EnvironmentType {
  name: string;
  publicKey: string;
  description: string | null;
  iconUrl: string | null;
}

interface PricingPolicy {
  basePrice: number;
  currency: string;
  priceUnit: string;
  extraGuestPrice: number;
}

interface Environment {
  publicId: string;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  capacity: number;
  type: EnvironmentType;
  tour360Id: string;
  instantBooking: boolean;
  minRentalTime: number;
  maxRentalTime: number;
  rentalUnit: string;
  photoUrls: string[];
  pricingPolicies: PricingPolicy[];
}

const EnvironmentsPage = () => {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnvironments = async () => {
      try {
        const res = await fetch(
          "http://localhost:5150/api/environments/available",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              location: "Cochabamba, Bolivia",
              capacity: 5,
              environmentTypePublicKey: "oficinas",
              startDate: 1712923200,
              endDate: 1712930400,
              areas: [],
              services: [],
              instantBooking: true,
            }),
          }
        );

        const data: Environment[] = await res.json();
        setEnvironments(data);
      } catch (err) {
        console.error("Failed to fetch environments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnvironments();
  }, []);

  return (
    <Container maxWidth={false}>
      <Box sx={{ background: "red" }}></Box>
      <Grid container spacing={2} width={"100%"}>
        {(loading ? Array.from(new Array(16)) : environments).map(
          (env, index) => (
            <Grid
              key={loading ? index : env.publicId}
              size={{ xs: 12, sm: 12, md: 6, lg: 3 }}
            >
              {loading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : (
                <div onClick={() => {}}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={env.photoUrls[0]}
                      alt={env.title}
                    />
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">
                        {env.instantBooking ? "⚡ Reserva Instantánea" : ""}
                      </Typography>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {env.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Bs. {env.pricingPolicies[0].basePrice} por{" "}
                        {env.pricingPolicies[0].priceUnit.toLowerCase()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        👥 {env.capacity} asistentes
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              )}
            </Grid>
          )
        )}
      </Grid>
    </Container>
  );
};

export default EnvironmentsPage;
