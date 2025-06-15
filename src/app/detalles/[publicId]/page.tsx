import { getEnvironmentByPublicId } from "@/services/environmentService";
import dynamic from "next/dynamic";
import { Metadata } from "next";

const EnvironmentDetailsClient = dynamic(
  () => import("@/components/client/EnvironmentDetailsClient"),
  { ssr: true },
);

type Props = {
  params: {
    publicId: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Detalles del Ambiente - ${params.publicId}`,
  };
}

export default async function EnvironmentDetailsPage({ params }: Props) {
  const data = await getEnvironmentByPublicId(params.publicId);

  if (!data) {
    return <div>Ambiente no encontrado.</div>;
  }

  return <EnvironmentDetailsClient data={data} />;
}
