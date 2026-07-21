import { Request, Response } from "express";
import * as SettingsServices from '../Services/Settings.services';

export const getSettings = async (req: Request, res: Response) => {
    try {
        const settings = await SettingsServices.getSettings();
        if (!settings) {
            return res.status(404).json({ error: "Settings not found" });
        }
        res.status(200).json(settings);
    } catch (error: any) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ error: "Failed to get settings" });
    }
};

export const updateSettings = async (req: Request, res: Response) => {
    try {
        const settings = req.body;
        const updated = await SettingsServices.updateSettings(settings);
        res.status(200).json({ 
            success: true, 
            message: "Settings updated successfully",
            data: updated 
        });
    } catch (error: any) {
        console.error("Error updating settings:", error);
        res.status(500).json({ error: "Failed to update settings" });
    }
};