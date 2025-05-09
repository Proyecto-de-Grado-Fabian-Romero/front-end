import { UploadImageResult } from "@/types/UploadImageResult";
import { authFetch } from "./authFetch";

export async function uploadImages(
  files: File[],
  folder: string,
  bucket: string = "spacio"
): Promise<UploadImageResult[]> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file, file.name);
  });

  const url = `http://localhost:5116/api/image/upload-multiple?bucket=${bucket}&folder=${folder}`;
  const response = await authFetch(url, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error al subir imágenes");
  }

  const json = await response.json();
  return json as UploadImageResult[];
}
