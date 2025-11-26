"use client";

import dynamic from "next/dynamic";
import CenteredLayout from "@/components/layouts/CenteredLayout";

const SignUpContent = dynamic(
  () => import("@/components/client/SignUpContent"),
  {
    ssr: false,
  },
);

export default function SignUpPage() {
  return (
    <CenteredLayout>
      <SignUpContent />
    </CenteredLayout>
  );
}
