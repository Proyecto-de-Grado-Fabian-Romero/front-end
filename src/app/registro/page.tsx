import dynamic from "next/dynamic";
import CenteredLayout from "@/components/layouts/CenteredLayout";

const SignUpContent = dynamic(
  () => import("@/components/client/SignUpContent"),
  {
    ssr: true,
  },
);

export default function LoginPage() {
  return (
    <CenteredLayout>
      <SignUpContent />
    </CenteredLayout>
  );
}
