import api from "../axios";
import { extractFieldError } from "../errorMessage";

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
