import { Express } from "express";
import * as DriverLiveTrackingControllers from "../controllers/DriverLiveTracking.controllers";

const getDriverLiveTrackingRoutes = (app: Express) => {
    app.post('/driver/location', DriverLiveTrackingControllers.updateDriverLocation);
    app.get('/driver/:id/location', DriverLiveTrackingControllers.getDriverCurrentLocation);
    app.get('/driver/:id/location-history', DriverLiveTrackingControllers.getDriverLocationHistory);
    app.get('/drivers/active', DriverLiveTrackingControllers.getAllActiveDrivers);
}

export default getDriverLiveTrackingRoutes;
