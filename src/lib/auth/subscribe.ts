import api from "../api/axios";

export interface SubscribePayload {
  name: string;
  email: string;
  contact: string;
}

export const subscribeUser = async (payload: SubscribePayload) => {
  try {
    const response = await api.post("/subscribe", payload);
    return response.data;
  } catch (error: any) {
    const backendData = error.response?.data;

    if (backendData?.errors) {
      const firstErrorArray = Object.values(backendData.errors)[0];

      if (Array.isArray(firstErrorArray) && firstErrorArray.length > 0) {
        throw new Error(firstErrorArray[0]);
      }
    }
    if (backendData?.message) {
      throw new Error(backendData.message);
    }

    throw new Error("Something went wrong");
  }
};
