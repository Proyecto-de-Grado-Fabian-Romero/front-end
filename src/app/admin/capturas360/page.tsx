import dynamic from "next/dynamic";

const ClientTour360RequestsPage = dynamic(
  () => import("@/components/client/ClientTour360RequestPage"),
  { ssr: true },
);

export default function Tour360RequestsPage() {
  return (
      <ClientTour360RequestsPage />
  );
}
