import api from "@/lib/api/axios";
import type { Editorial } from "@/types/editorial";

interface EditorialResponse {
  data: Editorial;
}

export async function getEditorial(): Promise<Editorial> {
  const response = await api.get<EditorialResponse>("/editorial-settings");
  return response.data.data;
}
