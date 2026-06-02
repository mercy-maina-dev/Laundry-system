import { Express } from "express";
import * as DriverRoutesControllers from "../controllers/driverRoutes.controllers";

const getDriverRoutesRoutes = (app: Express) => {   
     // Driver Routes
    app.post("/driver/route", DriverRoutesControllers.saveDriverRoute);
    app.get("/order/:order_id/routes", DriverRoutesControllers.getDriverRoutesByOrder);
}

export default getDriverRoutesRoutes;