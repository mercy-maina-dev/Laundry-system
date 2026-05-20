import { Express } from "express";
import * as OrderItemsControllers from '../controllers/OrderItems.controllers';

const OrderItemsRoutes=(app:Express)=>{ 
    app.get('/orderitems', OrderItemsControllers.getAllOrderItems);
    app.post('/addorderitems', OrderItemsControllers.createOrderItem);
    app.get('/orderitems/:id', OrderItemsControllers.getOrderItemById); 
    app.put('/orderitems/:id', OrderItemsControllers.updateOrderItemById);
    app.delete('/orderitems/:id', OrderItemsControllers.deleteOrderItemById);
}
export default OrderItemsRoutes;