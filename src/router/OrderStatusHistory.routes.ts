import express from "express";
import * as OrderStatusHistoryControllers from '../controllers/OrderStatusHistory.controllers';

const OrderStatusHistoryRoutes = (router: express.Router) => {   
    router.get('/order-status-history', OrderStatusHistoryControllers.getAllOrderStatusHistory);
    router.post('/order-status-history', OrderStatusHistoryControllers.createOrderStatusHistory);
    router.get('/order-status-history/:id', OrderStatusHistoryControllers.getOrderStatusHistoryById);
    router.get('/order-status-history/order/:order_id', OrderStatusHistoryControllers.getOrderStatusHistoryByOrderId);
    router.get('/order-status-history/latest/:order_id', OrderStatusHistoryControllers.getLatestStatusByOrderId);
    router.put('/order-status-history/:id', OrderStatusHistoryControllers.updateOrderStatusHistoryById);
    router.delete('/order-status-history/:id', OrderStatusHistoryControllers.deleteOrderStatusHistoryById);
}

export default OrderStatusHistoryRoutes;