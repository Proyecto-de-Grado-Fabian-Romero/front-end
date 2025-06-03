export const loadUnavailableRanges = async (
  publicId: string,
  startMs: number,
  endMs: number
): Promise<{ start: number; end: number }[]> => {
  const start = Math.floor(startMs / 1000);
  const end = Math.floor(endMs / 1000);

  const res = await fetch(
    `http://localhost:5150/api/availability/unavailable?envId=${publicId}&start=${start}&end=${end}`
  );
  if (!res.ok) throw new Error("Error loading unavailable ranges");
  return await res.json();
};

export const getBlockedEnvironmentsByDay = async (
  timestamp: number
): Promise<
  {
    environmentTitle: string;
    environmentPhotoUrl?: string;
    startDate: number;
    endDate: number;
  }[]
> => {
  const res = await fetch(
    `http://localhost:5150/api/Availability/blocked?timestamp=${timestamp}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Error al obtener ambientes bloqueados");
  }

  return await res.json();
};
