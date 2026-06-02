import * as FeedbackRepository from "../repositories/feedback.repositories";
import { CustomerFeedback } from "../Types/Feedback.type";

export const addFeedback = async (feedback: CustomerFeedback) => {
    return await FeedbackRepository.addFeedback(feedback);
}

export const getDriverRatings = async (driver_id: number) => {
    return await FeedbackRepository.getDriverRatings(driver_id);
}

export const getOrderFeedback = async (order_id: number) => {
    return await FeedbackRepository.getOrderFeedback(order_id);
}

export const hasCustomerSubmittedFeedback = async (order_id: number, customer_id: number) => {
    return await FeedbackRepository.hasCustomerSubmittedFeedback(order_id, customer_id);
}