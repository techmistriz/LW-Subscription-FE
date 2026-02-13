import { request } from "@/lib/api/request";
import { Year } from "@/types";

export const getYears = async (): Promise<Year[]> => {
  const response = await request<Year[]>("GET", "/years");

  if (!response.status) return [];

  return response.data;
};
