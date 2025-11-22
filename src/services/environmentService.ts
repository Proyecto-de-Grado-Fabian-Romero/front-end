import { Area } from "@/types/Area";
import { type FormDataCreateEnv } from "@/types/Environments";
import { authFetch } from "./authFetch";
import moment from "moment";
import { Scene360 } from "@/types/Tour360";
import { trackEvent } from "./logEvent";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_ENVIRONMENTS_URL ?? "";

export async function fetchAreas() {
  const res = await fetch(`${API_BASE}/api/areas`);
  if (!res.ok) throw new Error("Error al obtener áreas");
  return res.json();
}

export async function fetchServices() {
  const res = await fetch(`${API_BASE}/api/services`);
  if (!res.ok) throw new Error("Error al obtener servicios");
  return res.json();
}

export const fetchTourData = async (tour360Id: string) => {
  try {
    const res = await fetch(`${API_BASE}/api/tours/${tour360Id}`);
    if (!res.ok) {
      trackEvent("tour_data_fetch_failed", { tour360Id });
      throw new Error("Failed to fetch tour data");
    }
    trackEvent("tour_data_fetch_success", { tour360Id });
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

  data.append("pricingPoliciesJson", JSON.stringify(formData.pricingPolicies));
  data.append("areasJson", JSON.stringify(formData.areas));
  data.append("weeklySchedulesJson", JSON.stringify(formData.weeklySchedules));
  data.append(
    "discountPoliciesJson",
    JSON.stringify(formData.discountPolicies),
  );
  data.append(
    "servicePublicKeysJson",
    JSON.stringify(formData.servicePublicKeys),
  );

  try {
    const response = await authFetch(`${API_BASE}/api/environments`, {
      method: "POST",
      body: data,
      credentials: "include",
    });

    if (!response.ok) {
      trackEvent("environment_create_failed");
      const text = await response.text();
      throw new Error(text || "Error al crear el ambiente");
    }

    trackEvent("environment_create_success");

    return await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err.message || "Hubo un problema al enviar el formulario");
  }
};

type UpdateOptions = {
  /** Si usas modo “declarativo”: mantén SOLO estos fileId y elimina el resto */
  keepPhotoIds?: string[];
  /** Si usas modo “incremental”: elimina estas fotos */
  deletePhotoIds?: string[];
  /**
   * Si quieres enviar SOLO campos que cambiaron, pásalos aquí.
   * Si no lo pones, se envían todos los campos relevantes.
   */
  changed?: Partial<FormDataCreateEnv>;
};

/** Helper: decide si un campo se debe enviar (cuando usas changed-only) */
const want = <K extends keyof FormDataCreateEnv>(
  key: K,
  changed?: Partial<FormDataCreateEnv>,
) => !changed || Object.prototype.hasOwnProperty.call(changed, key);

/** Helper: append seguro (no filtra 0 ni false) */
const appendIf = (
  fd: FormData,
  shouldAppend: boolean,
  key: string,
  value: unknown,
) => {
  if (!shouldAppend) return;
  if (value === undefined || value === null) return;
  fd.append(key, String(value));
};

/** Helper JSON */
const appendJsonIf = (
  fd: FormData,
  shouldAppend: boolean,
  key: string,
  obj: unknown,
) => {
  if (!shouldAppend) return;
  if (obj === undefined || obj === null) return;
  fd.append(key, JSON.stringify(obj));
};

/**
 * Actualiza un Environment (PUT /api/environments/{publicId})
 * Envío multipart/form-data compatible con tu DTO UpdateEnvironmentDto.
 */
export const updateEnvironment = async (
  publicId: string,
  formData: FormDataCreateEnv,
  opts: UpdateOptions = {},
) => {
  const fd = new FormData();

  // -------- Scalars (solo si los quieres enviar) --------
  appendIf(fd, want("title", opts.changed), "Title", formData.title);
  appendIf(
    fd,
    want("description", opts.changed),
    "Description",
    formData.description,
  );
  appendIf(fd, want("location", opts.changed), "Location", formData.location);
  appendIf(fd, want("latitude", opts.changed), "Latitude", formData.latitude);
  appendIf(
    fd,
    want("longitude", opts.changed),
    "Longitude",
    formData.longitude,
  );
  appendIf(
    fd,
    want("typePublicKey", opts.changed),
    "TypePublicKey",
    formData.typePublicKey,
  );
  appendIf(
    fd,
    want("rentalUnit", opts.changed),
    "RentalUnit",
    formData.rentalUnit,
  );
  appendIf(fd, want("capacity", opts.changed), "Capacity", formData.capacity);
  appendIf(
    fd,
    want("instantBooking", opts.changed),
    "InstantBooking",
    formData.instantBooking,
  );
  appendIf(
    fd,
    want("minRentalTime", opts.changed),
    "MinRentalTime",
    formData.minRentalTime,
  );
  appendIf(
    fd,
    want("maxRentalTime", opts.changed),
    "MaxRentalTime",
    formData.maxRentalTime,
  );
  appendIf(
    fd,
    want("request360Tour", opts.changed),
    "Request360Tour",
    formData.request360Tour,
  );

  // -------- JSON opcionales (manda solo si cambiaron) --------
  appendJsonIf(
    fd,
    want("servicePublicKeys", opts.changed),
    "ServicePublicKeysJson",
    formData.servicePublicKeys,
  );
  appendJsonIf(fd, want("areas", opts.changed), "AreasJson", formData.areas);
  appendJsonIf(
    fd,
    want("pricingPolicies", opts.changed),
    "PricingPoliciesJson",
    formData.pricingPolicies,
  );
  appendJsonIf(
    fd,
    want("discountPolicies", opts.changed),
    "DiscountPoliciesJson",
    formData.discountPolicies,
  );
  appendJsonIf(
    fd,
    want("weeklySchedules", opts.changed),
    "WeeklySchedulesJson",
    formData.weeklySchedules,
  );
  appendIf(
    fd,
    want("equipment", opts.changed),
    "EquipmentJson",
    formData.equipment,
  );

  // -------- Fotos existentes --------
  if (opts.keepPhotoIds && opts.keepPhotoIds.length > 0) {
    fd.append("KeepPhotoIdsJson", JSON.stringify(opts.keepPhotoIds));
  }
  if (opts.deletePhotoIds && opts.deletePhotoIds.length > 0) {
    fd.append("DeletePhotoIdsJson", JSON.stringify(opts.deletePhotoIds));
  }

  // -------- Nuevos archivos --------
  if (formData.images && formData.images.length > 0) {
    for (const file of formData.images) {
      fd.append("Images", file);
    }
  }

  // -------- Request --------
  const res = await fetch(`${API_BASE}/api/environments/${publicId}`, {
    method: "PUT",
    body: fd,
    // No pongas Content-Type manual: el navegador setea el boundary de multipart
    credentials: "include", // si necesitas cookies explícitas
  });

  if (!res.ok) {
    trackEvent("environment_update_failed", { publicId });
    const text = await res.text().catch(() => "");
    throw new Error(text || `Error ${res.status} al actualizar el ambiente`);
  }

  trackEvent("environment_update_success", { publicId });

  // Devuelve el EnvironmentDto actualizado (según tu servicio)
  return res.json();
};

type AreaReq = { AreaPublicKey: string; MinQuantity: number };

export const fetchEnvironments = async (
  searchParams: URLSearchParams,
  page: number,
  limit: number,
) => {
  try {
    const areas: AreaReq[] = [];
    const equipmentRequired: Record<string, number> = {};

    searchParams.forEach((value, key) => {
      if (key.startsWith("area_")) {
        areas.push({
          AreaPublicKey: key.replace("area_", ""),
          MinQuantity: parseInt(value),
        });
      }

      if (key.startsWith("equipment_")) {
        const objectId = key.replace("equipment_", "");
        equipmentRequired[objectId] = parseInt(value);
      }
    });

    const services =
      searchParams.get("services")?.split(",").filter(Boolean) || [];

    const typeParam = searchParams.get("type") || "";
    const isHospedaje = typeParam === "hospedajes";

    // Params from URL
    const startDateParam = searchParams.get("startDate"); // ISO expected
    const endDateParam = searchParams.get("endDate"); // ISO expected
    const startTimeParam = searchParams.get("startTime"); // "19:00"
    const endTimeParam = searchParams.get("endTime"); // "21:00"

    let startMoment: moment.Moment | null = null;
    let endMoment: moment.Moment | null = null;

    if (startDateParam) {
      startMoment = moment(startDateParam);
      if (isHospedaje) {
        startMoment = startMoment.clone().startOf("day");
      } else if (startTimeParam) {
        const [h, m] = startTimeParam
          .split(":")
          .map((s) => parseInt(s, 10) || 0);
        startMoment = startMoment.clone().hour(h).minute(m).second(0);
      } else {
        startMoment = startMoment.clone().startOf("day");
      }
    }

    if (endDateParam) {
      endMoment = moment(endDateParam);
      if (isHospedaje) {
        endMoment = endMoment.clone().startOf("day");
      } else if (endTimeParam) {
        const [h, m] = endTimeParam.split(":").map((s) => parseInt(s, 10) || 0);
        endMoment = endMoment.clone().hour(h).minute(m).second(0);
      } else {
        // default end = start + 2 hours (if start exists) or end of day
        if (startMoment) {
          endMoment = startMoment.clone().add(2, "hours");
        } else {
          endMoment = endMoment.clone().startOf("day");
        }
      }
    } else {
      // no endDate provided -> build from start
      if (startMoment) {
        if (isHospedaje) {
          endMoment = startMoment.clone().add(1, "day");
        } else {
          endMoment = startMoment.clone().add(2, "hours");
        }
      }
    }

    // if not hospedaje and end <= start => assume next day
    if (
      !isHospedaje &&
      startMoment &&
      endMoment &&
      !endMoment.isAfter(startMoment)
    ) {
      endMoment = endMoment.clone().add(1, "day");
    }

    // For hospedaje, keep startOf('day') / endOf('day') semantics if desired.
    if (isHospedaje && startMoment)
      startMoment = startMoment.clone().startOf("day");
    if (isHospedaje && endMoment) endMoment = endMoment.clone().startOf("day");

    const startUnix = startMoment ? startMoment.utc().unix() : undefined;
    const endUnix = endMoment ? endMoment.utc().unix() : undefined;

    const requestBody = {
      location: searchParams.get("city") || undefined,
      environmentTypePublicKey: typeParam || undefined,
      startDate: startUnix,
      endDate: endUnix,
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
      equipmentRequired:
        Object.keys(equipmentRequired).length > 0
          ? equipmentRequired
          : undefined,
    };

    const res = await fetch(
      `${API_BASE}/api/environments/available?page=${page}&limit=${limit}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        credentials: "include",
      },
    );

    if (!res.ok) {
      trackEvent("environments_fetch_failed");
      throw new Error("Failed to fetch environments");
    }

    trackEvent("environments_fetch_success");

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchAvailableEquipment = async (
  searchParams: URLSearchParams,
): Promise<{ name: string; count: number }[]> => {
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

  const res = await fetch(`${API_BASE}/api/environments/available-equipment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    trackEvent("available_equipment_fetch_failed");
    throw new Error("Failed to fetch available equipment");
  }

  trackEvent("available_equipment_fetch_success");

  return await res.json();
};

export const getOwnerEnvironments = async (page = 1, limit = 10) => {
  try {
    const res = await authFetch(
      `${API_BASE}/api/environments/owner?page=${page}&limit=${limit}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!res.ok) {
      trackEvent("owner_environments_fetch_failed");
      throw new Error("Error al obtener los ambientes");
    }

    trackEvent("owner_environments_fetch_success");

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
      `${API_BASE}/api/environments/single?publicId=${publicId}`,
    );

    if (!res.ok) {
      trackEvent("environment_single_fetch_failed", { publicId });
      throw new Error("No se pudo cargar el ambiente");
    }

    trackEvent("environment_single_fetch_success", { publicId });

    return await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err.message || "Error al obtener el ambiente");
  }
};

// services/environments.ts
export const patchHideEnvironment = async (publicId: string, hide: boolean) => {
  const res = await fetch(`${API_BASE}/api/environments/${publicId}/hide`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ hide }),
  });
  if (!res.ok) {
    trackEvent("environment_hide_update_failed", { publicId, hide });
    throw new Error("Failed to update hide status");
  }

  trackEvent("environment_hide_update_success", { publicId, hide });
  return;
};

export const patchDeleteEnvironment = async (publicId: string) => {
  const res = await fetch(`${API_BASE}/api/environments/${publicId}/delete`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) {
    trackEvent("environment_delete_failed", { publicId });
    const text = await res.text();
    throw new Error(text || "Failed to delete environment");
  }

  trackEvent("environment_delete_success", { publicId });
  return;
};

export const uploadVirtualTourDirect = async (
  environmentPublicId: string,
  scenes: Scene360[],
): Promise<void> => {
  const res = await authFetch(
    `${API_BASE}/api/tours?environmentPublicId=${environmentPublicId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scenes }),
      credentials: "include",
    },
  );

  if (!res.ok) {
    trackEvent("virtual_tour_upload_failed", { environmentPublicId });
    const errorText = await res.text();
    throw new Error(`Error al subir el recorrido: ${errorText}`);
  }

  trackEvent("virtual_tour_upload_success", { environmentPublicId });
};
