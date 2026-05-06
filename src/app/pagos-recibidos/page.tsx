"use client";

import React from "react";
import CenteredLayout from "@/components/layouts/CenteredLayout";
import OwnerPaymentsClient from "../../components/client/OwnerPaymentsClient";

const ReceivedPaymentsPage = () => {
  return (
    <CenteredLayout>
      <OwnerPaymentsClient />
    </CenteredLayout>
  );
};

export default ReceivedPaymentsPage;
