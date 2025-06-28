import dynamic from "next/dynamic";
import CenteredLayout from "@/components/layouts/CenteredLayout";

const ConfirmEmailClient = dynamic(
  () => import("@/components/client/ConfirmEmailClient"),
  {
    ssr: true,
  },
);

export default function ConfirmEmailPage() {
  return (
    <CenteredLayout>
      <ConfirmEmailClient />
    </CenteredLayout>
  );
}
