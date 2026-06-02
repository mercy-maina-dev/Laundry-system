import {Express} from "express";
import * as StoreSettingsControllers from "../controllers/StoreSettings.controllers";

const getStoreSettingsRoutes=(app:Express)=>{   
    // Store Settings
    app.get("/store/settings", StoreSettingsControllers.getStoreSettings);
    app.put("/store/settings", StoreSettingsControllers.updateStoreSettings);
}
export default getStoreSettingsRoutes;