"use client";

import CenteredLayout from "@/components/layouts/CenteredLayout";
import ClientBankInfo from "@/components/client/BankInfoClient";
import React from "react";

const page = () => {
  return (
    <CenteredLayout>
      <ClientBankInfo />
    </CenteredLayout>
  );
};

export default page;
