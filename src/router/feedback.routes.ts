import { Express } from "express";
import * as FeedbackControllers from "../controllers/feedback.controllers";

const FeedbackRoutes = (app: Express) => {
    app.post("/feedback", FeedbackControllers.addFeedback);
    app.get("/driver/:driver_id/ratings", FeedbackControllers.getDriverRatings);
    app.get("/order/:order_id/feedback", FeedbackControllers.getOrderFeedback);
    app.get("/driver/:driver_id/feedback-summary", FeedbackControllers.getDriverFeedbackSummary);
    app.get("/feedback/analytics", FeedbackControllers.getFeedbackAnalytics);
    app.get("/feedback/check/:order_id/:customer_id", FeedbackControllers.hasCustomerSubmittedFeedback);
}

export default FeedbackRoutes;