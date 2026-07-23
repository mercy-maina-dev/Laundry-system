import express from "express";
import * as StoreSettingsControllers from "../controllers/StoreSettings.controllers";

const getStoreSettingsRoutes = (router: express.Router) => {   
    // Store Settings
    router.get("/store/settings", StoreSettingsControllers.getStoreSettings);
    router.put("/store/settings", StoreSettingsControllers.updateStoreSettings);
}

export default getStoreSettingsRoutes;