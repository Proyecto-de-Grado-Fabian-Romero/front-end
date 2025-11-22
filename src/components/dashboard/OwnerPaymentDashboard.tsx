"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import OwnerPaymentSummary from "./OwnerPaymentSummary";
import { getPaymentSummary } from "../../services/ownerPaymentService";
import { PaymentSummary } from "@/types/Payments";

const OwnerPaymentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getPaymentSummary();
        setSummary(data);
      } catch {
        alert("Hubo un error, intenta de nuevo");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <OwnerPaymentSummary summary={summary} />
    </Box>
  );
};

export default OwnerPaymentDashboard;
