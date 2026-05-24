export interface Deliveries {
    delivery_id: number;
    order_id: number;
    driver_id: number;
    pickup_time: Date;
    delivery_time: Date;
    delivery_status: string;
}

export interface NewDeliveries {
    order_id: number;
    driver_id: number;
    pickup_time: Date;
    delivery_time: Date;
    delivery_status: string;
}

export interface UpdateDeliveries {
    order_id: number;
    driver_id: number;
    pickup_time: Date;
    delivery_time: Date;
    delivery_status: string;
}