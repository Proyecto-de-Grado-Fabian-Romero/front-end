"use client";

import React from "react";
import CenteredLayout from "@/components/layouts/CenteredLayout";
import ClientNotifications from "@/components/client/NotificationsClient";

const IncomePage = () => {
  return (
    <CenteredLayout>
      <ClientNotifications />
    </CenteredLayout>
  );
};

export default IncomePage;
