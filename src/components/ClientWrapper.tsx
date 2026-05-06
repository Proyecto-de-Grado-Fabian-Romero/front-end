"use client";

import { useEffect } from "react";
import { fetchAreas, fetchServices } from "@/services/environmentService";
import { Provider, useDispatch } from "react-redux";
import { setAreas, setServices } from "@/store/slices/optionsSlice";
import { store } from "@/store";
import { fetchCurrentSession } from "@/services/authService";

function InitLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    async function preloadOptions() {
      try {
        const [areasData, servicesData] = await Promise.all([
          fetchAreas(),
          fetchServices(),
        ]);

        dispatch(setAreas(areasData));
        dispatch(setServices(servicesData));
      } catch {
        // Avoid blocking UI with modal alerts during bootstrap.
        console.error("No se pudieron precargar áreas y servicios");
      }
    }

    preloadOptions();
  }, [dispatch]);

  useEffect(() => {
    fetchCurrentSession(dispatch);
  }, [dispatch]);

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
