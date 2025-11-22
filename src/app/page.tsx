import dynamic from "next/dynamic";

const HomeClient = dynamic(() => import("@/components/client/HomeClient"), {
  ssr: true,
});

export default function EnvironmentsPage() {
  return <HomeClient />;
}
