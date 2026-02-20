import { Year } from "@/types";
import api from "../axios";

export const getYears = async (): Promise<Year[]> => {
  try {
    const response = await api.get("/years");

    const result = response.data;
console.log(result.data)
    return result?.data ?? result ?? [];
  } catch (error) {
    console.error("Error fetching years:", error);
    return [];
  }
};

