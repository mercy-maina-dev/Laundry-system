import { Express } from "express";
import * as PickupDeliveryControllers from "../controllers/pickupDelivery.controllers";

const PickupDeliveryRoutes = (app: Express) => {
    // Driver Assignment
    app.post("/assign-pickup", PickupDeliveryControllers.assignPickup);
    app.post("/assign-delivery", PickupDeliveryControllers.assignDelivery);
    
    // Pickup Operations
    app.put("/start-pickup/:record_id", PickupDeliveryControllers.startPickup);
   app.put("/complete-pickup/:record_id", PickupDeliveryControllers.completePickup);
    
    // Delivery Operations
    app.put("/start-delivery/:record_id", PickupDeliveryControllers.startDelivery);
    app.put("/complete-delivery/:record_id", PickupDeliveryControllers.completeDelivery);
    
    // Location Tracking
    app.post("/driver-location", PickupDeliveryControllers.updateDriverLocation);
    app.get("/driver-location/:driver_id", PickupDeliveryControllers.getDriverLocation);
    
    // Driver Tasks
    app.get("/driver/:driver_id/active-tasks", PickupDeliveryControllers.getDriverActiveTasks);
    
    // Order History
    app.get("/order/:order_id/pickup-delivery-history", PickupDeliveryControllers.getOrderPickupDeliveryHistory);
    
    // Nearest Drivers
    app.get("/nearest-drivers", PickupDeliveryControllers.getNearestDrivers);
    
    // Geofence Check
    app.post("/check-geofence", PickupDeliveryControllers.checkGeofence);
}

export default PickupDeliveryRoutes;