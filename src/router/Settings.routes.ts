import express from "express";
import * as SettingsControllers from '../controllers/Settings.controllers';

const SettingsRoutes = (router: express.Router) => {
    router.get('/settings', SettingsControllers.getSettings);
    router.put('/settings', SettingsControllers.updateSettings);
}

export default SettingsRoutes;