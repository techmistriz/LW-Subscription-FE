import type { Subscription } from "./models";

export const mapSubscription = (
  sub: Subscription | null | undefined,
): Subscription | null => {
  if (!sub) return null;

  return {
    id: sub.id,
    plan_id: sub.plan_id ?? sub.membership_plan_id,
    name: sub.plan?.name,
    amount: Number(sub.plan?.price ?? 0),
    status: sub.status,
    start_date: sub.start_date,
    end_date: sub.end_date,
    duration_value: sub.plan?.duration_value,
    duration_unit: sub.plan?.duration_unit,
    purchase_type: sub.purchase_type,
    features: sub.plan?.feature,
    is_trial: String(sub.plan?.is_trial ?? ""),
    tag: sub.plan?.tag,
    plan: sub.plan,
  };
};
