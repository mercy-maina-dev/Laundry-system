import express from "express";
import * as DeliveriesControllers from '../controllers/Deliveries.controllers';

const DeliveriesRoutes = (router: express.Router) => {
    router.get('/deliveries', DeliveriesControllers.getAllDeliveries);
    router.post('/adddeliveries', DeliveriesControllers.createDelivery);
    router.get('/deliveries/:id', DeliveriesControllers.getDeliveryById);
    router.put('/deliveries/:id', DeliveriesControllers.updateDeliveryById);
    router.delete('/deliveries/:id', DeliveriesControllers.deleteDeliveryById);
}

export default DeliveriesRoutes;