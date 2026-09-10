export interface InvoicePlan {
  id: number;
  name: string;
  price: string;
  duration_unit: string;
  duration_value: number;
  print_editions: number;
}

export interface InvoiceTransaction {
  id: number;
  subscription_id: number;
  order_number: string;
  transaction_id: string;
  payment_amount: string;
  payment_status: string;
  transaction_date: string;
}

export interface Invoice {
  id: number;
  user_id: number;
  membership_plan_id: number;
  start_date: string;
  end_date: string;
  total_amount: string;
  subtotal_amount: string;
  tax_amount: string;
  tax_percent: number;
  status: string;
  purchase_type: string;
  previous_subscription_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  plan: InvoicePlan;
  transaction: InvoiceTransaction | null;
}
