"use client";

import CenteredLayout from "@/components/layouts/CenteredLayout";
import dynamic from "next/dynamic";
const ClientPayments = dynamic(
  () => import("@/components/client/AdminPaymentsClient"),
  {
    ssr: false,
  },
);

export default function AdminPaymentsPage() {
  return (
    <CenteredLayout>
      <ClientPayments />
    </CenteredLayout>
  );
}
