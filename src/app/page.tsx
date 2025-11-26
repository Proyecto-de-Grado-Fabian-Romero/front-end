"use client";

import dynamic from "next/dynamic";

const HomeClient = dynamic(() => import("@/components/client/HomeClient"), {
  ssr: false,
});

export default function EnvironmentsPage() {
  return <HomeClient />;
}
