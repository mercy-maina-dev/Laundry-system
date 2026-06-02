export interface OrderStatusHistory {
  history_id?: number;
  order_id: number;
  status: string;
  changed_at?: Date;
  notes?: string;
  changed_by?: number;
  previous_status?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UpdateOrderStatusHistory {
  notes?: string;
}