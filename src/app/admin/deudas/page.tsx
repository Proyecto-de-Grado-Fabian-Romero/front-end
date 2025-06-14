import CenteredLayout from "@/components/layouts/CenteredLayout";
import dynamic from "next/dynamic";
const ClientDebts = dynamic(
  () => import("@/components/client/AdminDebtsClient"),
  {
    ssr: true,
  }
);

export default function AdminDebtsPage() {
  return (
    <CenteredLayout>
      <ClientDebts />
    </CenteredLayout>
  );
}
