import { Express } from "express";
import * as OrderStatusHistoryControllers from '../controllers/OrderStatusHistory.controllers';

const OrderStatusHistoryRoutes = (app: Express) => {   
    app.get('/order-status-history', OrderStatusHistoryControllers.getAllOrderStatusHistory);
    app.post('/order-status-history', OrderStatusHistoryControllers.createOrderStatusHistory);
    app.get('/order-status-history/:id', OrderStatusHistoryControllers.getOrderStatusHistoryById);
    app.get('/order-status-history/order/:order_id', OrderStatusHistoryControllers.getOrderStatusHistoryByOrderId);
    app.get('/order-status-history/latest/:order_id', OrderStatusHistoryControllers.getLatestStatusByOrderId);
    app.put('/order-status-history/:id', OrderStatusHistoryControllers.updateOrderStatusHistoryById);
    app.delete('/order-status-history/:id', OrderStatusHistoryControllers.deleteOrderStatusHistoryById);
}

export default OrderStatusHistoryRoutes;