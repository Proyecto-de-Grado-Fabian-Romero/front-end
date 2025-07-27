"use client";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ImageIcon from "@mui/icons-material/Image";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { PageRoutes } from "@/utils/constants/page-routes";

const AdminHome = () => {
  const router = useRouter();

  const menuItems = [
    {
      label: "Capturas",
      icon: <ImageIcon fontSize="large" />,
      route: PageRoutes.Shots_360,
    },
    {
      label: "Calendario",
      icon: <CalendarMonthIcon fontSize="large" />,
      route: PageRoutes.Admin_Calendar,
    },
    {
      label: "Deudas",
      icon: <AttachMoneyIcon fontSize="large" />,
      route: PageRoutes.Debts,
    },
  ];

  return (
    <Container>
      <Box sx={{ width: "100%" }}>
        <Typography variant="h4" textAlign="center" mb={4}>
          Panel de Administración
        </Typography>
        <Grid justifyContent={"center"} container spacing={4}>
          {menuItems.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.label}>
              <Card>
                <CardActionArea onClick={() => router.push(item.route)}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Box sx={{ mb: 2 }}>{item.icon}</Box>
                    <Typography variant="h6">{item.label}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminHome;
