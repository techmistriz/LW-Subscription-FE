import { Year } from "@/types/models";
import { request } from "../network/request";
import { logger } from "@/lib/logger";

export const getYears = async (): Promise<Year[]> => {
  const response = await request<{ data: Year[] }>("GET", "/years");

  if (response.status) {
    return response.data.data ?? [];
  }

  logger.error("Error fetching years:", response.message);
  return [];
};
