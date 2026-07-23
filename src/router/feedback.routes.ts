import express from "express";
import * as FeedbackControllers from "../controllers/feedback.controllers";

const FeedbackRoutes = (router: express.Router) => {
    router.post("/feedback", FeedbackControllers.addFeedback);
    router.get("/driver/:driver_id/ratings", FeedbackControllers.getDriverRatings);
    router.get("/order/:order_id/feedback", FeedbackControllers.getOrderFeedback);
    router.get("/driver/:driver_id/feedback-summary", FeedbackControllers.getDriverFeedbackSummary);
    router.get("/feedback/analytics", FeedbackControllers.getFeedbackAnalytics);
    router.get("/feedback/check/:order_id/:customer_id", FeedbackControllers.hasCustomerSubmittedFeedback);
}

export default FeedbackRoutes;