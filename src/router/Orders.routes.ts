import e, { Express } from "express";
import * as OrdersControllers from '../controllers/Orders.controllers';

const OrdersRoutes=(app:Express)=>{
    app.get('/orders', OrdersControllers.getAllOrders);
    app.post('/addorders', OrdersControllers.createOrder);
    app.get('/orders/:id', OrdersControllers.getOrderById);
    app.put('/orders/:id', OrdersControllers.updateOrder);
    app.delete('/orders/:id', OrdersControllers.deleteOrder);


}
export default OrdersRoutes;