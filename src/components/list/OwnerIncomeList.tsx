"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { getIncomeList } from "@/services/ownerPaymentService";
import { type IncomeDetail } from "@/types/Payments";
import OwnerPaymentDashboard from "../dashboard/OwnerPaymentDashboard";
import OwnerIncomeDetailModal from "../modal/OwnerIncomeDetailModal";
// import { useRouter } from "next/navigation"; // ya no navegamos

const OwnerIncomeList = () => {
  const [incomes, setIncomes] = useState<IncomeDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0); // 0-based index

  // Modal state
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedIncomeId, setSelectedIncomeId] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const data = await getIncomeList(page + 1, 20);
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

  const columns: MRT_ColumnDef<IncomeDetail>[] = [
    {
      header: "Monto",
      accessorKey: "amount",
      Cell: ({ cell }) => `Bs. ${cell.getValue<number>()}`,
    },
    {
      header: "Fecha Generada",
      accessorKey: "generatedAt",
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleDateString(),
    },
    {
      header: "Acciones",
      accessorKey: "id",
      Cell: ({ cell }) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setSelectedIncomeId(cell.getValue<string>());
            setDetailOpen(true); // 🔓 abre modal
          }}
        >
          Ver Detalles
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <OwnerPaymentDashboard />

      <Typography variant="h5" gutterBottom mb={4} mt={6}>
        Lista de Ingresos
      </Typography>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box textAlign="center" mt={4}>
            <CircularProgress />
            <Typography mt={2}>Cargando ingresos...</Typography>
          </Box>
        ) : (
          <MaterialReactTable
            columns={columns}
            data={incomes}
            enablePagination
            manualPagination
            enableStickyHeader={false}
            enableStickyFooter={false}
            muiTableContainerProps={{ sx: { maxHeight: "none" } }}
            muiTablePaperProps={{ sx: { overflow: "visible" } }}
            rowCount={totalItems}
            pageCount={Math.ceil(totalItems / 20)}
            onPaginationChange={(updater) => {
              const newPage =
                typeof updater === "function"
                  ? updater({ pageIndex: page, pageSize: 20 }).pageIndex
                  : updater.pageIndex;
              setPage(newPage);
            }}
            state={{
              pagination: {
                pageIndex: page,
                pageSize: 20,
              },
            }}
            muiPaginationProps={{
              rowsPerPageOptions: [20],
            }}
            localization={{
              ...MRT_Localization_ES,
              noRecordsToDisplay: "Aún no tienes ingresos.",
            }}
          />
        )}
      </Paper>

      <OwnerIncomeDetailModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedIncomeId(null);
        }}
        incomeId={selectedIncomeId}
      />
    </Box>
  );
};

export default OwnerIncomeList;
