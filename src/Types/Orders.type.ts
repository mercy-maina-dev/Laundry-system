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
    pickup_latitude?: number;
    pickup_longitude?: number;
    delivery_latitude?: number;
    delivery_longitude?: number;
    pickup_distance_km?: number;
    delivery_distance_km?: number;
    estimated_pickup_time?: Date;
    created_at: Date;
    updated_at: Date | null;
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
    pickup_latitude?: number;
    pickup_longitude?: number;
    delivery_latitude?: number;
    delivery_longitude?: number;
    pickup_distance_km?: number;
    delivery_distance_km?: number;
    estimated_pickup_time?: Date;
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
    pickup_latitude?: number;
    pickup_longitude?: number;
    delivery_latitude?: number;
    delivery_longitude?: number;
    pickup_distance_km?: number;
    delivery_distance_km?: number;
    estimated_pickup_time?: Date;
}