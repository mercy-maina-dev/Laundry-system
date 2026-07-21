import { Express } from "express";
import * as SettingsControllers from '../controllers/Settings.controllers';
const SettingsRoutes = (app: Express) => {
    app.get('/settings', SettingsControllers.getSettings);
    app.put('/settings', SettingsControllers.updateSettings);
}

export default SettingsRoutes;