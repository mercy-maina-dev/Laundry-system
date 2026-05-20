export interface OrderItems {
    item_id: number;
    order_id: number;
    service_id: number;
    quantity: number;
    price: number;
}

export interface NewOrderItems {
    order_id: number;
    service_id: number;
    quantity: number;
    price: number;
}

export interface UpdateOrderItems {
    order_id: number;
    service_id: number;
    quantity: number;
    price: number;
}