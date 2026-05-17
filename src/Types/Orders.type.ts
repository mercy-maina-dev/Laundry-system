export interface Orders {
    order_id: number;
    user_id: number;
    pickup_adress: string;
    delivery_address: string;
    pickup_date: Date;
    delivery_date: Date;
    total_weight: number;
    total_price: number;
    status: string;
}

export interface NewOrders {
    user_id: number;
    pickup_adress: string;
    delivery_address: string;
    pickup_date: Date;
    delivery_date: Date;
    total_weight: number;
    total_price: number;
    status: string;
}

export interface UpdateOrders {
    user_id: number;
    pickup_adress: string;
    delivery_address: string;
    pickup_date: Date;
    delivery_date: Date;
    total_weight: number;
    total_price: number;
    status: string;
}