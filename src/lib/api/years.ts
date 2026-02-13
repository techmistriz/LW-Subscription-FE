import api from "./axios";

export async function getYears() {
  try {
    const response = await api.get("/years");

    return response.data;
  } catch (error) {
    console.error("Error fetching years:", error);
    return { data: [] };
  }
}
