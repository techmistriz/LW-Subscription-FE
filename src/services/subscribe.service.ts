import api from "@/network/axios";
import { extractFieldError } from "@/network/errorMessage";

export interface SubscribePayload {
  name: string;
  email: string;
  contact: string;
}

export const subscribeUser = async (payload: SubscribePayload) => {
  try {
    const response = await api.post("/subscribe", payload);
    return response.data;
  } catch (error) {
    throw new Error(extractFieldError(error, "Something went wrong"));
  }
};
