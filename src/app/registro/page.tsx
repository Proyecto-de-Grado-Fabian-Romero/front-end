import dynamic from "next/dynamic";
import CenteredLayout from "@/components/layouts/CenteredLayout";

const SignUpContent = dynamic(
  () => import("@/components/client/SignUpContent"),
  {
    ssr: true,
  },
);

export default function SignUpPage() {
  return (
    <CenteredLayout>
      <SignUpContent />
    </CenteredLayout>
  );
}
