import api from "@/network/axios";
import type { Editorial } from "@/types/editorial";
import { logger } from "@/lib/logger";

interface EditorialResponse {
  data: Editorial;
}

export async function getEditorial(): Promise<Editorial> {
  const response = await api.get<EditorialResponse>("/editorial-settings");
  logger.log(response.data.data);
  return response.data.data;
}
