"use client";

import React from "react";
import CenteredLayout from "@/components/layouts/CenteredLayout";
import dynamic from "next/dynamic";

const ClientNotifications = dynamic(
  () => import("@/components/client/NotificationsClient"),
  { ssr: false },
);

const IncomePage = () => {
  return (
    <CenteredLayout>
      <ClientNotifications />
    </CenteredLayout>
  );
};

export default IncomePage;
