"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import MUIDataTable, { MUIDataTableColumnDef } from "mui-datatables";
import { getIncomeList } from "@/services/ownerPaymentService";
import { IncomeDetail } from "@/types/Payments";
import OwnerPaymentDashboard from "../dashboard/OwnerPaymentDashboard";
import { useRouter } from "next/navigation";
import { PageRoutes } from "@/utils/constants/page-routes";

const OwnerIncomeList = () => {
  const [incomes, setIncomes] = useState<IncomeDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const router = useRouter();

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const data = await getIncomeList(page, 20);
        setIncomes(data.items);
        setTotalItems(data.totalItems);
      } catch {
        alert("Hubo un error, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    fetchIncomes();
  }, [page]);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <CircularProgress />
        <Typography mt={2}>Cargando ingresos...</Typography>
      </Box>
    );
  }

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "amount",
      label: "Monto",
      options: {
        customBodyRender: (value: number) => `Bs. ${value}`,
      },
    },
    {
      name: "currency",
      label: "Moneda",
    },
    {
      name: "generatedAt",
      label: "Fecha Generada",
      options: {
        customBodyRender: (value: string) =>
          new Date(value).toLocaleDateString(),
      },
    },
    {
      name: "actions",
      label: "Acciones",
      options: {
        customBodyRenderLite: (dataIndex: number) => {
          const income = incomes[dataIndex];
          return (
            <Button
              variant="outlined"
              size="small"
              onClick={() =>
                router.push(`${PageRoutes.Incomes}/${income.id}`)
              }
            >
              Ver Detalles
            </Button>
          );
        },
      },
    },
  ];

  return (
    <Box>
      <OwnerPaymentDashboard />

      <Typography variant="h5" gutterBottom mb={4} mt={6}>
        Lista de Ingresos
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <MUIDataTable
          title=""
          data={incomes}
          columns={columns}
          options={{
            selectableRows: "none",
            responsive: "standard",
            rowsPerPage: 20,
            count: totalItems,
            page: page - 1,
            onChangePage: (currentPage) => setPage(currentPage + 1),
            pagination: true,
            rowsPerPageOptions: [],
            search: false,
            download: false,
            print: false,
            viewColumns: false,
            filter: false,
            textLabels: {
              body: {
                noMatch: "Aún no tienes ingresos.",
              },
              pagination: {
                next: "Siguiente",
                previous: "Anterior",
                rowsPerPage: "Filas por página:",
                displayRows: "de",
              },
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default OwnerIncomeList;
