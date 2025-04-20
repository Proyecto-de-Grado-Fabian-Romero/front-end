"use client";

import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import { fetchAreas, fetchServices } from "@/services/fetchOptions";
import { Provider, useDispatch } from "react-redux";
import { setAreas, setServices } from "@/store/slices/optionsSlice";
import { store } from "@/store";
import { fetchCurrentSession } from "@/services/authService";

function InitLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [loadingAreasServices, setLoadingAreasServices] = useState(true);
  const [loadingSession, setLoadingSession] = useState(true);

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
        alert(
          "Hubo un error cargando áreas o servicios, recarga la página por favor"
        );
      } finally {
        setLoadingAreasServices(false);
      }
    }

    loadData();
  }, [dispatch]);

  useEffect(() => {
    fetchCurrentSession(dispatch).finally(() => setLoadingSession(false));
  }, [dispatch]);

  useEffect(() => {
    if (!loadingAreasServices && !loadingSession) {
      setLoading(false);
    }
  }, [loadingAreasServices, loadingSession]);

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
