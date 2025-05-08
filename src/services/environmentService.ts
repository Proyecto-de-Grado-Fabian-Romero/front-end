import { Area } from "@/types/Area";
import { FormDataCreateEnv } from "@/types/Environments";

export async function fetchAreas() {
  const res = await fetch("http://localhost:5150/api/areas");
  if (!res.ok) throw new Error("Error al obtener áreas");
  return res.json();
}

export async function fetchServices() {
  const res = await fetch("http://localhost:5150/api/services");
  if (!res.ok) throw new Error("Error al obtener servicios");
  return res.json();
}

export const fetchTourData = async (tour360Id: string) => {
  try {
    const res = await fetch(`http://localhost:5150/api/tours/${tour360Id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch tour data");
    }
    return res.json();
  } catch (error) {
    throw error;
  }
};

export const createEnvironment = async (formData: FormDataCreateEnv) => {
  const data = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (key === "images" && Array.isArray(value)) {
      (value as File[]).forEach((file) => data.append("images", file));
    } else if (Array.isArray(value)) {
      data.append(key, JSON.stringify(value));
    } else if (typeof value === "boolean" || typeof value === "number") {
      data.append(key, value.toString());
    } else if (value !== undefined && value !== null) {
      data.append(key, value.toString());
    }
  });

  try {
    const response = await fetch("http://localhost:5150/api/environments", {
      method: "POST",
      body: data,
      credentials: "include",
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Error al crear el ambiente");
    }

    return await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err.message || "Hubo un problema al enviar el formulario");
  }
};

export const fetchEnvironments = async (
  searchParams: URLSearchParams,
  page: number,
  limit: number,
) => {
  try {
    const areas: Area[] = [];
    searchParams.forEach((value, key) => {
      if (key.startsWith("area_")) {
        areas.push({
          AreaPublicKey: key.replace("area_", ""),
          MinQuantity: parseInt(value),
        });
      }
    });

    const services = searchParams.get("services")?.split(",") || [];

    const requestBody = {
      location: searchParams.get("city") || undefined,
      environmentTypePublicKey: searchParams.get("type") || undefined,
      startDate: searchParams.get("startDate")
        ? Math.floor(new Date(searchParams.get("startDate")!).getTime() / 1000)
        : undefined,
      endDate: searchParams.get("endDate")
        ? Math.floor(new Date(searchParams.get("endDate")!).getTime() / 1000)
        : undefined,
      servicePublicKeys: services,
      areas,
      instantBookingRequired:
        searchParams.get("instantBooking") === "true" ? true : false,
      minPrice: searchParams.get("minPrice")
        ? parseFloat(searchParams.get("minPrice")!)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? parseFloat(searchParams.get("maxPrice")!)
        : 2000,
      minCapacity: searchParams.get("minCapacity")
        ? parseFloat(searchParams.get("minCapacity")!)
        : 0,
    };

    const res = await fetch(
      `http://localhost:5150/api/environments/available?page=${page}&limit=${limit}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch environments");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const getOwnerEnvironments = async (page = 1, limit = 10) => {
  try {
    const res = await fetch(
      `http://localhost:5150/api/environments/owner?page=${page}&limit=${limit}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!res.ok) {
      throw new Error("Error al obtener los ambientes");
    }

    const data = await res.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err.message || "Error inesperado al obtener los ambientes");
  }
};

export const getEnvironmentByPublicId = async (publicId: string) => {
  try {
    const res = await fetch(
      `http://localhost:5150/api/environments/single?publicId=${publicId}`,
    );

    if (!res.ok) {
      throw new Error("No se pudo cargar el ambiente");
    }

    return await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err.message || "Error al obtener el ambiente");
  }
};
