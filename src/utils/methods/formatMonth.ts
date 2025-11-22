export const monthKey = (y: number, m: number) =>
  `${y}-${String(m).padStart(2, "0")}`;

export const monthLabel = (y: number, m: number) =>
  new Date(Date.UTC(y, m - 1, 1)).toLocaleString("es-BO", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
