export interface Payments {
    payment_id: number; 
    order_id: number;
    amount: number;
    payment_method: string;
    payment_status: string;
    transaction_ref: string;
    paid_at: string;
    
}

export interface CreatePayments {
    order_id: number;
    amount: number;
    payment_method: string;
    payment_status: string;
    transaction_ref: string;
    paid_at: string;
}

export interface UpdatePayments {
    payment_id: number;
    order_id: number;
    amount: number;
    payment_method: string;
    payment_status: string;
    transaction_ref: string;
    paid_at: string;
}