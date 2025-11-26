"use client";

import dynamic from "next/dynamic";
import CenteredLayout from "@/components/layouts/CenteredLayout";

const ProfileClient = dynamic(
  () => import("@/components/client/ProfileClient"),
  { ssr: false },
);

export default function OwnerEnvironmentsPage() {
  return (
    <CenteredLayout>
      <ProfileClient />
    </CenteredLayout>
  );
}
