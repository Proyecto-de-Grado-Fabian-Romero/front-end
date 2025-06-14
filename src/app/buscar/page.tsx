import CenteredLayout from "@/components/layouts/CenteredLayout";
import dynamic from "next/dynamic";

const ClientEnvironmentsPage = dynamic(
  () => import("@/components/client/ClientEnvironmentsPage"),
  { ssr: true },
);

export default function EnvironmentsPage() {
  return (
    <CenteredLayout>
      <ClientEnvironmentsPage />
    </CenteredLayout>
  );
}
