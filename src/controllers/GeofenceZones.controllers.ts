import { Request, Response } from "express";
import * as GeofenceZonesService from "../Services/GeofenceZones.services";
import { getSocketIO } from "../socket/socket.server";

export const createGeofenceZone = async (req: Request, res: Response) => {
    try {
        const { order_id, type, center_latitude, center_longitude, radius_meters } = req.body;
        
        if (!order_id || !type || !center_latitude || !center_longitude || !radius_meters) {
            return res.status(400).json({
                success: false,
                message: "order_id, type, center_latitude, center_longitude, and radius_meters are required"
            });
        }
        
        const result = await GeofenceZonesService.createGeofenceZone({
            order_id,
            type,
            center_latitude,
            center_longitude,
            radius_meters
        });
        
        return res.status(201).json({
            success: true,
            data: result,
            message: "Geofence zone created successfully"
        });
    } catch (error: any) {
        console.error("Error creating geofence zone:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create geofence zone",
            error: error.message
        });
    }
}

export const checkDriverInGeofence = async (req: Request, res: Response) => {
    try {
        const { order_id, type, driver_latitude, driver_longitude } = req.body;
        
        if (!order_id || !type || !driver_latitude || !driver_longitude) {
            return res.status(400).json({
                success: false,
                message: "order_id, type, driver_latitude, and driver_longitude are required"
            });
        }
        
        const result = await GeofenceZonesService.checkIfDriverInGeofence(
            parseInt(order_id), 
            type, 
            driver_latitude, 
            driver_longitude
        );
        
        const io = getSocketIO();
        
        if (result) {
            io.to(`order-${order_id}`).emit('driver-entered-geofence', {
                type,
                message: `Driver has entered the ${type} zone`,
                timestamp: new Date()
            });
        }
        
        return res.status(200).json({
            success: true,
            data: {
                isWithinGeofence: !!result,
                zone: result
            },
            message: result ? "Driver is within geofence" : "Driver is not within geofence"
        });
    } catch (error: any) {
        console.error("Error checking geofence:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to check geofence",
            error: error.message
        });
    }
}