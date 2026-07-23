import express from "express";
import * as GeofenceZonesControllers from "../controllers/GeofenceZones.controllers";

const getGeofenceZonesRoutes = (router: express.Router) => {
    // Geofence Zones
    router.post("/geofence", GeofenceZonesControllers.createGeofenceZone);
    router.post("/geofence/check", GeofenceZonesControllers.checkDriverInGeofence);
}

export default getGeofenceZonesRoutes;