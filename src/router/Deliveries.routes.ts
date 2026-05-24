import {Express } from "express";
import * as DeliveriesControllers from '../controllers/Deliveries.controllers';

const DeliveriesRoutes=(app:Express)=>{
    app.get('/deliveries', DeliveriesControllers.getAllDeliveries);
    app.post('/adddeliveries', DeliveriesControllers.createDelivery);
    app.get('/deliveries/:id', DeliveriesControllers.getDeliveryById);
    app.put('/deliveries/:id', DeliveriesControllers.updateDeliveryById);
    app.delete('/deliveries/:id', DeliveriesControllers.deleteDeliveryById);
}

export default DeliveriesRoutes;