"use client";

import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import { OptionItem } from "@/types/OptionItem";
import { fetchAreas, fetchServices } from "@/services/fetchOptions";
import { useDispatch } from "react-redux";
import { setAreas, setServices } from "@/store/slices/optionsSlice";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
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
      } catch (error) {
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
