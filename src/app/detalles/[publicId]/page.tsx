import dynamic from "next/dynamic";

const EnvironmentDetailsClient = dynamic(
  () => import("@/components/client/EnvironmentDetailsClient"),
  { ssr: false },
);

export default function EnvironmentDetailsPage() {
  return <EnvironmentDetailsClient />;
}
