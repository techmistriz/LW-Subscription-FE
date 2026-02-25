
import { Year } from "@/types";
import { request } from "../request";

export const getYears = async (): Promise<Year[]> => {
  const response = await request<{ data: Year[] }>("GET", "/years");

  if (response.status) {
    return response.data.data ?? [];
  }

  console.error("Error fetching years:", response.message);
  return [];
};