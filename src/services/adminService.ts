export const requestTour360 = async (
  environmentId: string,
  ownerId: string,
) => {
  const response = await fetch("http://localhost:5101/api/tour360requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      environmentId,
      ownerId,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    console.log("HOLA!");
    throw new Error("Error making POST request");
  }

  return response.json();
};

export const getTour360Requests = async (
  page = 1,
  limit = 10,
  status?: string,
) => {
  try {
    const url = new URL("http://localhost:5101/api/tour360requests");
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());
    if (status) {
      url.searchParams.append("status", status);
    }

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error("No se pudieron obtener las solicitudes");
    }

    const data = await res.json();
    return data;
  } catch {
    throw new Error("Error inesperado");
  }
};
