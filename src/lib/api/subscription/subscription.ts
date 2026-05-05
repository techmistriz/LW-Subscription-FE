import axiosInstance from "../axios";

/* -------- UPGRADE PLAN -------- */
export async function upgradePlan(plan_id: number) {
  try {
    const res = await axiosInstance.post("/subscription/upgrade-plan", {
      plan_id,
    });

    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Upgrade failed" };
  }
}

/* -------- RENEW PLAN -------- */
export async function renewPlan() {
  try {
    const res = await axiosInstance.post("/subscription/renew-plan");

    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: "Renew failed" };
  }
}