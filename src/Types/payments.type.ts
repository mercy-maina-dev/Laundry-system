// Types/payments.type.ts

export interface Payments {
  payment_id: number;
  order_id: number;
  amount: number;
  payment_method: string;
  payment_status: string;
  transaction_ref: string | null;
  paid_at: Date | null;
  checkout_request_id: string | null;
  merchant_request_id: string | null;
  phone_number: string | null;
  result_code: number | null;
  result_desc: string | null;
  created_at: Date;
  updated_at: Date | null;
}

export interface NewPayments {
  order_id: number;
  amount: number;
  payment_method: string;
  payment_status: string;
  transaction_ref?: string | null;
  paid_at?: Date | null;
  checkout_request_id?: string | null;
  merchant_request_id?: string | null;
  phone_number?: string | null;
  result_code?: number | null;
  result_desc?: string | null;
}

export interface UpdatePayments {
  amount?: number;
  payment_method?: string;
  payment_status?: string;
  transaction_ref?: string | null;
  paid_at?: Date | null;
  checkout_request_id?: string | null;
  merchant_request_id?: string | null;
  phone_number?: string | null;
  result_code?: number | null;
  result_desc?: string | null;
}