import { Request, Response } from "express";
import * as StoreSettingsService from "../Services/StoreSettings.services";

export const getStoreSettings = async (req: Request, res: Response) => {
    try {
        const settings = await StoreSettingsService.getStoreSettings();
        
        return res.status(200).json({
            success: true,
            data: settings,
            message: "Store settings retrieved successfully"
        });
    } catch (error: any) {
        console.error("Error getting store settings:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get store settings",
            error: error.message
        });
    }
}

export const updateStoreSettings = async (req: Request, res: Response) => {
    try {
        const { store_name, store_latitude, store_longitude, store_address, contact_phone, operating_hours } = req.body;
        
        if (!store_name || !store_latitude || !store_longitude || !store_address || !contact_phone) {
            return res.status(400).json({
                success: false,
                message: "All store settings fields are required"
            });
        }
        
        const result = await StoreSettingsService.updateStoreSettings({
            store_name,
            store_latitude,
            store_longitude,
            store_address,
            contact_phone,
            operating_hours
        });
        
        return res.status(200).json({
            success: true,
            data: result,
            message: "Store settings updated successfully"
        });
    } catch (error: any) {
        console.error("Error updating store settings:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update store settings",
            error: error.message
        });
    }
}