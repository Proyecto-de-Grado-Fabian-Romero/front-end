// No "use client" here
import { getEnvironmentByPublicId } from "@/services/environmentService";
import EnvironmentDetailsClient from "@/components/client/EnvironmentDetailsClient";

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
