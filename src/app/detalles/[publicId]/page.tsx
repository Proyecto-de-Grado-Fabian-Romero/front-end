import dynamic from "next/dynamic";

const EnvironmentDetailsClient = dynamic(
  () => import("@/components/client/EnvironmentDetailsClient"),
  { ssr: true }
);

export default async function EnvironmentDetailsPage() {
  return <EnvironmentDetailsClient />;
}
