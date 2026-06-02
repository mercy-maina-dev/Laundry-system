import { Request, Response } from "express";
import * as DriverRouteService from "../Services/driverRoutes.services";

export const saveDriverRoute = async (req: Request, res: Response) => {
    try {
        const { driver_id, order_id, route_type, start_latitude, start_longitude, end_latitude, end_longitude, total_distance_km, total_duration_minutes, route_data } = req.body;
        
        if (!driver_id || !order_id || !route_type || !start_latitude || !start_longitude || !end_latitude || !end_longitude) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }
        
        const result = await DriverRouteService.saveDriverRoute({
            driver_id,
            order_id,
            route_type,
            start_latitude,
            start_longitude,
            end_latitude,
            end_longitude,
            total_distance_km,
            total_duration_minutes,
            route_data
        });
        
        return res.status(201).json({
            success: true,
            data: result,
            message: "Driver route saved successfully"
        });
    } catch (error: any) {
        console.error("Error saving driver route:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save driver route",
            error: error.message
        });
    }
}

export const getDriverRoutesByOrder = async (req: Request, res: Response) => {
    try {
        const { order_id } = req.params;
        
        if (!order_id) {
            return res.status(400).json({
                success: false,
                message: "order_id is required"
            });
        }
        
        const orderId = parseInt(order_id as string);
        if (isNaN(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order_id"
            });
        }
        
        const routes = await DriverRouteService.getDriverRoutesByOrder(orderId);
        
        return res.status(200).json({
            success: true,
            data: routes,
            message: "Driver routes retrieved successfully"
        });
    } catch (error: any) {
        console.error("Error getting driver routes:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get driver routes",
            error: error.message
        });
    }
}