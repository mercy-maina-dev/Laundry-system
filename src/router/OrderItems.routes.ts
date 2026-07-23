import express from "express";
import * as OrderItemsControllers from '../controllers/OrderItems.controllers';

const OrderItemsRoutes = (router: express.Router) => { 
    router.get('/orderitems', OrderItemsControllers.getAllOrderItems);
    router.post('/addorderitems', OrderItemsControllers.createOrderItem);
    router.get('/orderitems/:id', OrderItemsControllers.getOrderItemById); 
    router.put('/orderitems/:id', OrderItemsControllers.updateOrderItemById);
    router.delete('/orderitems/:id', OrderItemsControllers.deleteOrderItemById);
}

export default OrderItemsRoutes;