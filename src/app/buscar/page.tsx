import CenteredLayout from "@/components/layouts/CenteredLayout";
import dynamic from "next/dynamic";

const ClientEnvironmentsPage = dynamic(
  () => import("@/components/client/ClientEnvironmentsPage"),
  { ssr: false },
);

export default function EnvironmentsPage() {
  return (
    <CenteredLayout>
      <br />
      <br />
      <br />
      <ClientEnvironmentsPage />
    </CenteredLayout>
  );
}
