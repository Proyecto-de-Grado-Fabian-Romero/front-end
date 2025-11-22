"use client";

import CenteredLayout from "@/components/layouts/CenteredLayout";
import dynamic from "next/dynamic";
import React from "react";

const ClientBankInfo = dynamic(
  () => import("@/components/client/BankInfoClient"),
  { ssr: false },
);

const page = () => {
  return (
    <CenteredLayout>
      <ClientBankInfo />
    </CenteredLayout>
  );
};

export default page;
