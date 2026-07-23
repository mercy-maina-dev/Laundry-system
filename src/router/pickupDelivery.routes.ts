import express from "express";
import * as PickupDeliveryControllers from "../controllers/pickupDelivery.controllers";

const PickupDeliveryRoutes = (router: express.Router) => {
    // Driver Assignment
    router.post("/assign-pickup", PickupDeliveryControllers.assignPickup);
    router.post("/assign-delivery", PickupDeliveryControllers.assignDelivery);
    
    // Pickup Operations
    router.put("/start-pickup/:record_id", PickupDeliveryControllers.startPickup);
    router.put("/complete-pickup/:record_id", PickupDeliveryControllers.completePickup);
    
    // Delivery Operations
    router.put("/start-delivery/:record_id", PickupDeliveryControllers.startDelivery);
    router.put("/complete-delivery/:record_id", PickupDeliveryControllers.completeDelivery);
    
    // Location Tracking
    router.post("/driver-location", PickupDeliveryControllers.updateDriverLocation);
    router.get("/driver-location/:driver_id", PickupDeliveryControllers.getDriverLocation);
    
    // Driver Tasks
    router.get("/driver/:driver_id/active-tasks", PickupDeliveryControllers.getDriverActiveTasks);
    
    // Order History
    router.get("/order/:order_id/pickup-delivery-history", PickupDeliveryControllers.getOrderPickupDeliveryHistory);
    
    // Nearest Drivers
    router.get("/nearest-drivers", PickupDeliveryControllers.getNearestDrivers);
    
    // Geofence Check
    router.post("/check-geofence", PickupDeliveryControllers.checkGeofence);
}

export default PickupDeliveryRoutes;