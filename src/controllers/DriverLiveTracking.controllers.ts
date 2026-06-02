import { Request, Response } from "express";
import * as DriverLiveTrackingService from "../Services/DriverLiveTracking.services";
import { getSocketIO } from "../socket/socket.server";

export const updateDriverLocation = async (req: Request, res: Response) => {
    try {
        const { driver_id, order_id, latitude, longitude, speed, heading, accuracy, battery_level, is_moving } = req.body;
        
        if (!driver_id || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "driver_id, latitude and longitude are required"
            });
        }
        
        const result = await DriverLiveTrackingService.updateDriverLocation({
            driver_id,
            order_id,
            latitude,
            longitude,
            speed,
            heading,
            accuracy,
            battery_level,
            is_moving
        });
        
        const io = getSocketIO();
        
        if (order_id) {
            io.to(`order-${order_id}`).emit('driver-location-update', {
                driver_id,
                latitude,
                longitude,
                speed,
                timestamp: new Date()
            });
        }
        
        io.to('admin-room').emit('driver-location-update', {
            driver_id,
            latitude,
            longitude,
            timestamp: new Date()
        });
        
        return res.status(200).json({
            success: true,
            data: result,
            message: "Driver location updated successfully"
        });
    } catch (error: any) {
        console.error("Error updating driver location:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update driver location",
            error: error.message
        });
    }
}

export const getDriverCurrentLocation = async (req: Request, res: Response) => {
    try {
        const { driver_id } = req.params;
        
        if (!driver_id) {
            return res.status(400).json({
                success: false,
                message: "driver_id is required"
            });
        }
        
        const driverId = parseInt(driver_id as string);
        if (isNaN(driverId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid driver_id"
            });
        }
        
        const location = await DriverLiveTrackingService.getDriverCurrentLocation(driverId);
        
        return res.status(200).json({
            success: true,
            data: location,
            message: "Driver location retrieved successfully"
        });
    } catch (error: any) {
        console.error("Error getting driver location:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get driver location",
            error: error.message
        });
    }
}

export const getDriverLocationHistory = async (req: Request, res: Response) => {
    try {
        const { driver_id } = req.params;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
        
        if (!driver_id) {
            return res.status(400).json({
                success: false,
                message: "driver_id is required"
            });
        }
        
        const driverId = parseInt(driver_id as string);
        if (isNaN(driverId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid driver_id"
            });
        }
        
        const history = await DriverLiveTrackingService.getDriverLocationHistory(driverId, limit);
        
        return res.status(200).json({
            success: true,
            data: history,
            message: "Driver location history retrieved successfully"
        });
    } catch (error: any) {
        console.error("Error getting driver location history:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get driver location history",
            error: error.message
        });
    }
}

export const getAllActiveDrivers = async (req: Request, res: Response) => {
    try {
        const drivers = await DriverLiveTrackingService.getAllActiveDrivers();
        
        return res.status(200).json({
            success: true,
            data: drivers,
            message: "Active drivers retrieved successfully"
        });
    } catch (error: any) {
        console.error("Error getting active drivers:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get active drivers",
            error: error.message
        });
    }
}