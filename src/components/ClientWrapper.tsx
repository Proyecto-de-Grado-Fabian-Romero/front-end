"use client";

import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import { fetchAreas, fetchServices } from "@/services/fetchOptions";
import { Provider, useDispatch } from "react-redux";
import { setAreas, setServices } from "@/store/slices/optionsSlice";
import { store } from "@/store";

function InitLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [areasData, servicesData] = await Promise.all([
          fetchAreas(),
          fetchServices(),
        ]);

        dispatch(setAreas(areasData));
        dispatch(setServices(servicesData));
      } catch {
        alert("Hubo un error, por favor recarga la página.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [dispatch]);

  if (loading) return <SplashScreen />;

  return <>{children}</>;
}

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <InitLoader>{children}</InitLoader>
    </Provider>
  );
}
