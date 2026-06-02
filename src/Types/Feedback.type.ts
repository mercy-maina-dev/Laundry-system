export interface CustomerFeedback {
    feedback_id?: number;
    order_id: number;
    customer_id: number;
    driver_id: number;
    rating: number;
    comment?: string;
    delivery_rating?: number;
    punctuality_rating?: number;
    professionalism_rating?: number;
    feedback_type: 'PICKUP' | 'DELIVERY' | 'BOTH';
}