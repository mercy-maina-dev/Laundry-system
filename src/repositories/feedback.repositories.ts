import getpool from "../db/config";
import { CustomerFeedback } from "../Types/Feedback.type";

export const addFeedback = async (feedback: CustomerFeedback) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('order_id', feedback.order_id)
        .input('customer_id', feedback.customer_id)
        .input('driver_id', feedback.driver_id)
        .input('rating', feedback.rating)
        .input('comment', feedback.comment || null)
        .input('delivery_rating', feedback.delivery_rating || null)
        .input('punctuality_rating', feedback.punctuality_rating || null)
        .input('professionalism_rating', feedback.professionalism_rating || null)
        .input('feedback_type', feedback.feedback_type)
        .query(`INSERT INTO CustomerFeedback (order_id, customer_id, driver_id, rating, comment, delivery_rating, punctuality_rating, professionalism_rating, feedback_type) 
                VALUES (@order_id, @customer_id, @driver_id, @rating, @comment, @delivery_rating, @punctuality_rating, @professionalism_rating, @feedback_type)`);
    return { message: 'Feedback submitted successfully' };
}

export const getDriverRatings = async (driver_id: number) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('driver_id', driver_id)
        .query(`SELECT 
                    AVG(CAST(rating AS FLOAT)) as average_rating,
                    COUNT(*) as total_ratings,
                    SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
                    SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
                    SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
                    SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
                    SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
                FROM CustomerFeedback 
                WHERE driver_id = @driver_id`);
    return result.recordset[0] || null;
}

export const getOrderFeedback = async (order_id: number) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('order_id', order_id)
        .query(`SELECT f.*, u.username as driver_name 
                FROM CustomerFeedback f
                INNER JOIN Users u ON f.driver_id = u.user_id
                WHERE f.order_id = @order_id`);
    return result.recordset[0] || null;
}

export const hasCustomerSubmittedFeedback = async (order_id: number, customer_id: number): Promise<boolean> => {
    const pool = await getpool();
    const result = await pool.request()
        .input('order_id', order_id)
        .input('customer_id', customer_id)
        .query(`SELECT COUNT(*) as count FROM CustomerFeedback 
                WHERE order_id = @order_id AND customer_id = @customer_id`);
    return result.recordset[0].count > 0;
}