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
