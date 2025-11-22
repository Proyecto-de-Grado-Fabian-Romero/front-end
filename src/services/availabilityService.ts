const API_BASE = process.env.NEXT_PUBLIC_API_BASE_ENVIRONMENTS_URL ?? "";

export const loadUnavailableRanges = async (
  publicId: string,
  startMs: number,
  endMs: number,
): Promise<{ start: number; end: number }[]> => {
  const start = Math.floor(startMs / 1000);
  const end = Math.floor(endMs / 1000);

  const res = await fetch(
    `${API_BASE}/api/Availability/unavailable?envId=${publicId}&start=${start}&end=${end}`,
  );
  if (!res.ok) throw new Error("Error loading unavailable ranges");
  return await res.json();
};

export const getBlockedEnvironmentsByDay = async (
  timestamp: number,
): Promise<
  {
    environmentId: string;
    environmentTitle: string;
    environmentPhotoUrl?: string;
    startDate: number;
    endDate: number;
  }[]
> => {
  const res = await fetch(
    `${API_BASE}/api/Availability/blocked?timestamp=${timestamp}`,
    {
      credentials: "include",
    },
  );

  if (!res.ok) {
    throw new Error("Error al obtener ambientes bloqueados");
  }

  return await res.json();
};

export const blockEnvironment = async ({
  environmentId,
  startDate,
  endDate,
}: {
  environmentId: string;
  startDate: number;
  endDate: number;
}) => {
  const res = await fetch(`${API_BASE}/api/Availability/block`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      environmentId,
      startDate,
      endDate,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.mensaje || "Error al bloquear el ambiente");
  }

  return await res.json();
};
