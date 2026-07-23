import express from "express";
import * as DriverLiveTrackingControllers from "../controllers/DriverLiveTracking.controllers";

const getDriverLiveTrackingRoutes = (router: express.Router) => {
    router.post('/driver/location', DriverLiveTrackingControllers.updateDriverLocation);
    router.get('/driver/:id/location', DriverLiveTrackingControllers.getDriverCurrentLocation);
    router.get('/driver/:id/location-history', DriverLiveTrackingControllers.getDriverLocationHistory);
    router.get('/drivers/active', DriverLiveTrackingControllers.getAllActiveDrivers);
}

export default getDriverLiveTrackingRoutes;