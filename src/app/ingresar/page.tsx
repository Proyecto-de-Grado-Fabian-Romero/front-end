import dynamic from "next/dynamic";
import CenteredLayout from "@/components/layouts/CenteredLayout";

const LoginContent = dynamic(() => import("@/components/client/LoginContent"), {
  ssr: false,
});

export default function LoginPage() {
  return (
    <CenteredLayout>
      <LoginContent />
    </CenteredLayout>
  );
}
