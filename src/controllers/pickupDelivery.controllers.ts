import { Request, Response } from "express";
import * as PickupDeliveryService from "../Services/pickupDelivery.Services";
import { calculateDistance, calculateETA, isWithinGeofence } from "../Services/location.Services";
import { getSocketIO, notifyDriverAssignment, emitOrderUpdate } from "../socket/socket.server";
import getpool from "../db/config";


export const assignPickup = async (req: Request, res: Response) => {
    try {
        const { order_id, driver_id, location_address, notes } = req.body;
        
        console.log('📦 assignPickup called with:', { order_id, driver_id, location_address });

        if (!order_id || !driver_id || !location_address) {
            return res.status(400).json({
                success: false,
                message: "order_id, driver_id and location_address are required"
            });
        }

        // 1. Create the pickup assignment record
        const result = await PickupDeliveryService.assignPickup({
            order_id,
            driver_id,
            location_address,
            notes,
            type: 'PICKUP',
            status: 'ASSIGNED'
        });
        console.log('✅ Pickup record created:', result);

        // 2. Update Orders table with assigned driver
        const pool = await getpool();
        const updateResult = await pool.request()
            .input('order_id', order_id)
            .input('driver_id', driver_id)
            .query(`
                UPDATE Orders 
                SET assigned_driver_id = @driver_id 
                WHERE order_id = @order_id
            `);

        if (updateResult.rowsAffected && updateResult.rowsAffected[0] === 0) {
            console.warn('⚠️ No rows updated – order_id may not exist');
        } else {
            console.log('✅ Orders table updated, driver_id set to', driver_id);
        }

        // Socket notifications
        notifyDriverAssignment(driver_id, order_id, location_address);
        emitOrderUpdate(order_id, 'driver-assigned', {
            driver_id,
            type: 'PICKUP',
            message: 'A driver has been assigned for pickup',
            timestamp: new Date()
        });

        return res.status(200).json({
            success: true,
            data: result,
            message: "Driver assigned for pickup successfully"
        });
    } catch (error: any) {
        console.error("❌ Error assigning pickup:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to assign driver for pickup",
            error: error.message,
            stack: error.stack
        });
    }
};

export const assignDelivery = async (req: Request, res: Response) => {
    try {
        const { order_id, driver_id, location_address, notes } = req.body;

        if (!order_id || !driver_id || !location_address) {
            return res.status(400).json({
                success: false,
                message: "order_id, driver_id and location_address are required"
            });
        }

        // 1. Create delivery record
        const result = await PickupDeliveryService.assignDelivery({
            order_id,
            driver_id,
            location_address,
            notes,
            type: 'DELIVERY',
            status: 'ASSIGNED'
        });

        // 2. Update Orders table
        const pool = await getpool();
        await pool.request()
            .input('order_id', order_id)
            .input('driver_id', driver_id)
            .query(`
                UPDATE Orders 
                SET assigned_driver_id = @driver_id 
                WHERE order_id = @order_id
            `);

        // Socket notifications
        notifyDriverAssignment(driver_id, order_id, location_address);
        emitOrderUpdate(order_id, 'driver-assigned', {
            driver_id,
            type: 'DELIVERY',
            message: 'A driver has been assigned for delivery',
            timestamp: new Date()
        });

        return res.status(200).json({
            success: true,
            data: result,
            message: "Driver assigned for delivery successfully"
        });
    } catch (error: any) {
        console.error("Error assigning delivery:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to assign driver for delivery",
            error: error.message
        });
    }
};

export const startPickup = async (req: Request, res: Response) => {
    try {
        const { record_id } = req.params;
        const { latitude, longitude } = req.body;

        if (!record_id || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "record_id, latitude and longitude are required"
            });
        }

        const result = await PickupDeliveryService.startPickup(parseInt(record_id as string), latitude, longitude);
        const orderData = await PickupDeliveryService.getOrderPickupDelivery(parseInt(record_id as string));
        const io = getSocketIO();

        if (orderData && orderData.length > 0 && orderData[0].order_id) {
            io.to(`order-${orderData[0].order_id}`).emit('pickup-started', {
                status: 'STARTED',
                message: 'Driver has started the pickup',
                timestamp: new Date()
            });
        }

        return res.status(200).json({
            success: true,
            data: result,
            message: "Pickup started successfully"
        });
    } catch (error: any) {
        console.error("Error starting pickup:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to start pickup",
            error: error.message
        });
    }
};


export const completePickup = async (req: Request, res: Response) => {
    try {
        const { record_id } = req.params;
        const { customer_photo_url, cloths_photo_url, signature_url } = req.body;

        if (!record_id) {
            return res.status(400).json({
                success: false,
                message: "record_id is required"
            });
        }

        const orderData = await PickupDeliveryService.getOrderPickupDelivery(parseInt(record_id as string));
        const result = await PickupDeliveryService.completePickup(parseInt(record_id as string), customer_photo_url, cloths_photo_url, signature_url);
        const io = getSocketIO();

        if (orderData && orderData.length > 0 && orderData[0].order_id) {
            io.to(`order-${orderData[0].order_id}`).emit('pickup-completed', {
                message: 'Items have been picked up successfully',
                timestamp: new Date()
            });
        }

        return res.status(200).json({
            success: true,
            data: result,
            message: "Pickup completed successfully"
        });
    } catch (error: any) {
        console.error("Error completing pickup:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to complete pickup",
            error: error.message
        });
    }
};


export const startDelivery = async (req: Request, res: Response) => {
    try {
        const { record_id } = req.params;
        const { latitude, longitude } = req.body;

        if (!record_id || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "record_id, latitude and longitude are required"
            });
        }

        const result = await PickupDeliveryService.startDelivery(parseInt(record_id as string), latitude, longitude);

        return res.status(200).json({
            success: true,
            data: result,
            message: "Delivery started successfully"
        });
    } catch (error: any) {
        console.error("Error starting delivery:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to start delivery",
            error: error.message
        });
    }
};


export const completeDelivery = async (req: Request, res: Response) => {
    try {
        const { record_id } = req.params;
        const { customer_confirmed } = req.body;

        if (!record_id) {
            return res.status(400).json({
                success: false,
                message: "record_id is required"
            });
        }

        const result = await PickupDeliveryService.completeDelivery(parseInt(record_id as string), customer_confirmed !== undefined ? customer_confirmed : true);

        return res.status(200).json({
            success: true,
            data: result,
            message: "Delivery completed successfully"
        });
    } catch (error: any) {
        console.error("Error completing delivery:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to complete delivery",
            error: error.message
        });
    }
};


export const updateDriverLocation = async (req: Request, res: Response) => {
    try {
        const { driver_id, order_id, latitude, longitude, speed, heading, accuracy, battery_level, is_moving } = req.body;

        if (!driver_id || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "driver_id, latitude and longitude are required"
            });
        }

        const result = await PickupDeliveryService.updateDriverLiveLocation({
            driver_id,
            order_id: order_id || null,
            latitude,
            longitude,
            speed,
            heading,
            accuracy,
            battery_level,
            is_moving
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
};

export const getDriverLocation = async (req: Request, res: Response) => {
    try {
        const { driver_id } = req.params;

        if (!driver_id) {
            return res.status(400).json({
                success: false,
                message: "driver_id is required"
            });
        }

        const location = await PickupDeliveryService.getDriverLiveLocation(parseInt(driver_id as string));

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
};

export const getDriverActiveTasks = async (req: Request, res: Response) => {
    try {
        const { driver_id } = req.params;

        if (!driver_id) {
            return res.status(400).json({
                success: false,
                message: "driver_id is required"
            });
        }

        const tasks = await PickupDeliveryService.getDriverActiveTasks(parseInt(driver_id as string));

        return res.status(200).json({
            success: true,
            data: tasks,
            message: "Driver active tasks retrieved successfully"
        });
    } catch (error: any) {
        console.error("Error getting driver tasks:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get driver tasks",
            error: error.message
        });
    }
};


export const getOrderPickupDeliveryHistory = async (req: Request, res: Response) => {
    try {
        const { order_id } = req.params;

        if (!order_id) {
            return res.status(400).json({
                success: false,
                message: "order_id is required"
            });
        }

        const history = await PickupDeliveryService.getOrderPickupDelivery(parseInt(order_id as string));

        return res.status(200).json({
            success: true,
            data: history,
            message: "Order pickup/delivery history retrieved successfully"
        });
    } catch (error: any) {
        console.error("Error getting order history:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get order history",
            error: error.message
        });
    }
};


export const getNearestDrivers = async (req: Request, res: Response) => {
    try {
        const { latitude, longitude, radius } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "latitude and longitude are required"
            });
        }

        const drivers = await PickupDeliveryService.getNearestDrivers(
            parseFloat(latitude as string),
            parseFloat(longitude as string),
            radius ? parseFloat(radius as string) : 5
        );

        return res.status(200).json({
            success: true,
            data: drivers,
            message: "Nearest drivers retrieved successfully"
        });
    } catch (error: any) {
        console.error("Error getting nearest drivers:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get nearest drivers",
            error: error.message
        });
    }
};

export const checkGeofence = async (req: Request, res: Response) => {
    try {
        const { order_id, driver_latitude, driver_longitude } = req.body;

        if (!order_id || !driver_latitude || !driver_longitude) {
            return res.status(400).json({
                success: false,
                message: "order_id, driver_latitude and driver_longitude are required"
            });
        }

        const order = await PickupDeliveryService.getOrderPickupDelivery(parseInt(order_id as string));

        if (!order || order.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const isWithinPickupGeofence = isWithinGeofence(
            driver_latitude, driver_longitude,
            order[0].pickup_latitude, order[0].pickup_longitude
        );

        const isWithinDeliveryGeofence = isWithinGeofence(
            driver_latitude, driver_longitude,
            order[0].delivery_latitude, order[0].delivery_longitude
        );

        return res.status(200).json({
            success: true,
            data: {
                isWithinPickupGeofence,
                isWithinDeliveryGeofence,
                message: isWithinPickupGeofence ? "Driver is at pickup location" :
                        isWithinDeliveryGeofence ? "Driver is at delivery location" :
                        "Driver is not at location"
            }
        });
    } catch (error: any) {
        console.error("Error checking geofence:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to check geofence",
            error: error.message
        });
    }
};