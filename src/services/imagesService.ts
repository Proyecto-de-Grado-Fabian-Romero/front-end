import { UploadImageResult } from "@/types/UploadImageResult";
import { authFetch } from "./authFetch";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_MEDIA_URL ?? "";

export async function uploadImages(
  files: File[],
  folder: string,
  bucket: string = "spacio",
): Promise<UploadImageResult[]> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file, file.name);
  });

  const url = `${API_BASE}/api/image/upload-multiple?bucket=${bucket}&folder=${folder}`;
  const response = await authFetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al subir imágenes");
  }

  const json = await response.json();
  return json as UploadImageResult[];
}
