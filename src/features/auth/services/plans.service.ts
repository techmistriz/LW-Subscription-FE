import api from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/api/errorMessage";

export interface Plan {
  id: number;
  name: string;
  price: string | number;
  actual_price?: string | number;
  duration_unit: string;
  duration_value: number;
  feature?: string; // HTML string, parsed client-side
  tag?: string; // "Most Popular" / "Best Value" badge
  is_trial?: boolean | number;
}

export async function getMembershipPlans(is_trial?: number): Promise<Plan[]> {
  try {
    const res = await api.get("/membership-plan", {
      params: is_trial !== undefined ? { is_trial } : undefined,
    });

    if (res.data?.status === false) {
      throw new Error(res.data?.message || "Failed to fetch plans");
    }

    return res.data?.data ?? [];
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch plans"));
  }
}
