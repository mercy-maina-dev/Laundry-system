import {Express} from "express";
import * as GeofenceZonesControllers from "../controllers/GeofenceZones.controllers";

const getGeofenceZonesRoutes=(app:Express)=>{
    // Geofence Zones
    app.post("/geofence", GeofenceZonesControllers.createGeofenceZone);
    app.post("/geofence/check", GeofenceZonesControllers.checkDriverInGeofence);
}
export default getGeofenceZonesRoutes;