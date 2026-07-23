import express from "express";
import * as DriverRoutesControllers from "../controllers/driverRoutes.controllers";

const getDriverRoutesRoutes = (router: express.Router) => {   
    // Driver Routes
    router.post("/driver/route", DriverRoutesControllers.saveDriverRoute);
    router.get("/order/:order_id/routes", DriverRoutesControllers.getDriverRoutesByOrder);
}

export default getDriverRoutesRoutes;