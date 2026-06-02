import { Request, Response } from "express";
import * as FeedbackService from "../Services/feedback.services";
import getpool from "../db/config";

export const addFeedback = async (req: Request, res: Response) => {
    try {
        const { order_id, customer_id, driver_id, rating, comment, delivery_rating, punctuality_rating, professionalism_rating, feedback_type } = req.body;
        
        if (!order_id || !customer_id || !driver_id || !rating || !feedback_type) {
            return res.status(400).json({
                success: false,
                message: "order_id, customer_id, driver_id, rating and feedback_type are required"
            });
        }
        
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }
        
        const result = await FeedbackService.addFeedback({
            order_id,
            customer_id,
            driver_id,
            rating,
            comment,
            delivery_rating,
            punctuality_rating,
            professionalism_rating,
            feedback_type
        });
        
        return res.status(201).json({
            success: true,
            data: result,
            message: "Feedback submitted successfully"
        });
    } catch (error: any) {
        console.error("Error submitting feedback:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to submit feedback",
            error: error.message
        });
    }
}

export const getDriverRatings = async (req: Request, res: Response) => {
    try {
        const { driver_id } = req.params;
        
        if (!driver_id) {
            return res.status(400).json({
                success: false,
                message: "driver_id is required"
            });
        }
        
        const ratings = await FeedbackService.getDriverRatings(parseInt(driver_id as string));
        
        return res.status(200).json({
            success: true,
            data: ratings,
            message: "Driver ratings retrieved successfully"
        });
    } catch (error: any) {
        console.error("Error getting driver ratings:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get driver ratings",
            error: error.message
        });
    }
}

export const getOrderFeedback = async (req: Request, res: Response) => {
    try {
        const { order_id } = req.params;
        
        if (!order_id) {
            return res.status(400).json({
                success: false,
                message: "order_id is required"
            });
        }
        
        const feedback = await FeedbackService.getOrderFeedback(parseInt(order_id as string));
        
        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "No feedback found for this order"
            });
        }
        
        return res.status(200).json({
            success: true,
            data: feedback,
            message: "Order feedback retrieved successfully"
        });
    } catch (error: any) {
        console.error("Error getting order feedback:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get order feedback",
            error: error.message
        });
    }
}

export const getDriverFeedbackSummary = async (req: Request, res: Response) => {
    try {
        const { driver_id } = req.params;
        
        if (!driver_id) {
            return res.status(400).json({
                success: false,
                message: "driver_id is required"
            });
        }
        
        const ratings = await FeedbackService.getDriverRatings(parseInt(driver_id as string));
        const recentFeedback = await getRecentDriverFeedback(parseInt(driver_id as string));
        
        return res.status(200).json({
            success: true,
            data: {
                summary: ratings,
                recent_comments: recentFeedback
            },
            message: "Driver feedback summary retrieved successfully"
        });
    } catch (error: any) {
        console.error("Error getting driver feedback summary:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get driver feedback summary",
            error: error.message
        });
    }
};

export const getFeedbackAnalytics = async (req: Request, res: Response) => {
    try {
        const pool = await getpool();
        
        const overallStats = await pool.request()
            .query(`SELECT 
                        AVG(CAST(rating AS FLOAT)) as average_rating,
                        COUNT(*) as total_feedbacks,
                        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star_count,
                        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star_count,
                        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star_count,
                        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star_count,
                        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star_count
                    FROM CustomerFeedback`);
        
        const feedbackByType = await pool.request()
            .query(`SELECT 
                        feedback_type,
                        COUNT(*) as count,
                        AVG(CAST(rating AS FLOAT)) as average_rating
                    FROM CustomerFeedback
                    GROUP BY feedback_type`);
        
        const monthlyTrends = await pool.request()
            .query(`SELECT 
                        YEAR(created_at) as year,
                        MONTH(created_at) as month,
                        COUNT(*) as feedback_count,
                        AVG(CAST(rating AS FLOAT)) as avg_rating
                    FROM CustomerFeedback
                    GROUP BY YEAR(created_at), MONTH(created_at)
                    ORDER BY year DESC, month DESC`);
        
        const topDrivers = await pool.request()
            .query(`SELECT TOP 5 
                        d.user_id as driver_id,
                        u.username as driver_name,
                        AVG(CAST(f.rating AS FLOAT)) as average_rating,
                        COUNT(f.feedback_id) as total_feedbacks
                    FROM CustomerFeedback f
                    INNER JOIN Users u ON f.driver_id = u.user_id
                    INNER JOIN Users d ON d.user_id = u.user_id
                    GROUP BY d.user_id, u.username
                    ORDER BY average_rating DESC`);
        
        return res.status(200).json({
            success: true,
            data: {
                overall: overallStats.recordset[0],
                by_type: feedbackByType.recordset,
                monthly_trends: monthlyTrends.recordset,
                top_drivers: topDrivers.recordset
            },
            message: "Feedback analytics retrieved successfully"
        });
    } catch (error: any) {
        console.error("Error getting feedback analytics:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get feedback analytics",
            error: error.message
        });
    }
};

export const hasCustomerSubmittedFeedback = async (req: Request, res: Response) => {
    try {
        const { order_id, customer_id } = req.params;
        
        if (!order_id || !customer_id) {
            return res.status(400).json({
                success: false,
                message: "order_id and customer_id are required"
            });
        }
        
        const hasSubmitted = await FeedbackService.hasCustomerSubmittedFeedback(
            parseInt(order_id as string), 
            parseInt(customer_id as string)
        );
        
        return res.status(200).json({
            success: true,
            data: { hasSubmitted },
            message: "Feedback check completed"
        });
    } catch (error: any) {
        console.error("Error checking feedback:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to check feedback status",
            error: error.message
        });
    }
};

const getRecentDriverFeedback = async (driver_id: number) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('driver_id', driver_id)
        .query(`SELECT TOP 5 
                    f.*, 
                    u.username as customer_name,
                    FORMAT(f.created_at, 'dd-MM-yyyy HH:mm') as formatted_date
                FROM CustomerFeedback f
                INNER JOIN Users u ON f.customer_id = u.user_id
                WHERE f.driver_id = @driver_id AND f.comment IS NOT NULL
                ORDER BY f.created_at DESC`);
    return result.recordset;
};