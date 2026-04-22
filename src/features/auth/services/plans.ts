// import axiosInstance from "../api/axios";

import api from "@/lib/api/axios";

export async function getPlans() {
  try {
    console.log("Fetching membership plans...");

    const res = await api.get("/membership-plan");

    console.log("Plans API FULL RESPONSE:", res.data);

    if (!res.data?.status) {
      throw new Error(res.data?.message || "Failed to fetch plans");
    }

    return res.data.data;
  } catch (err: any) {
    console.error("Plans API ERROR:", err);
    throw new Error(err.message || "Plans fetch failed");
  }
}

export async function getMembershipPlan(is_trial = 1) {
  try {
    const response = await api.get(
      `/membership-plan?is_trial=${is_trial}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch plan"
    );
  }
}


export const getMembershipPlans = async () => {
  try {
    const res = await api.get("/membership-plan", {
      params: {
        is_trial: 0,
      },
    });
console.log("membership", res.data)
    return res.data;
  } catch (error) {
    console.error("Failed to fetch membership plans:", error);
    throw error;
  }
};
//is_trial=1