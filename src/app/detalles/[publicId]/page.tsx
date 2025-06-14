import { getEnvironmentByPublicId } from "@/services/environmentService";
import dynamic from "next/dynamic";

const EnvironmentDetailsClient = dynamic(
  () => import("@/components/client/EnvironmentDetailsClient"),
  { ssr: true }
);

export default async function EnvironmentDetailsPage({
  params,
}: {
  params: { publicId: string };
}) {
  const data = await getEnvironmentByPublicId(params.publicId);

  if (!data) {
    return <div>Ambiente no encontrado.</div>;
  }

  return <EnvironmentDetailsClient data={data} />;
}
