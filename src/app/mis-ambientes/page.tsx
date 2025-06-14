import dynamic from "next/dynamic";
import CenteredLayout from "@/components/layouts/CenteredLayout";

const ClientOwnerEnvironments = dynamic(
  () => import("@/components/client/ClientOwnerEnvironments"),
  { ssr: true }
);

export default function OwnerEnvironmentsPage() {
  return (
    <CenteredLayout>
      <ClientOwnerEnvironments />
    </CenteredLayout>
  );
}
