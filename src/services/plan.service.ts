import api from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/api/errorMessage";
import type { SubscriptionPlan } from "@/types/models";

export async function getMembershipPlans(
  is_trial?: number,
): Promise<SubscriptionPlan[]> {
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
