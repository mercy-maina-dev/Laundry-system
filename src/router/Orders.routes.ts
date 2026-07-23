import express from "express";
import * as OrdersControllers from '../controllers/Orders.controllers';

const OrdersRoutes = (router: express.Router) => {
    router.get('/orders', OrdersControllers.getAllOrders);
    router.post('/addorders', OrdersControllers.createOrder);
    router.get('/orders/:id', OrdersControllers.getOrderById);
    router.put('/orders/:id', OrdersControllers.updateOrder);
    router.delete('/orders/:id', OrdersControllers.deleteOrder);
}

export default OrdersRoutes;