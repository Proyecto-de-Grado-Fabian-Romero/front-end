export const loadUnavailableRanges = async (
  publicId: string,
  startMs: number,
  endMs: number,
): Promise<{ start: number; end: number }[]> => {
  const start = Math.floor(startMs / 1000); // 👈 convierte a segundos
  const end = Math.floor(endMs / 1000);

  const res = await fetch(
    `http://localhost:5150/api/availability/unavailable?envId=${publicId}&start=${start}&end=${end}`,
  );
  if (!res.ok) throw new Error("Error loading unavailable ranges");
  return await res.json();
};
