import express from "express";
import * as PaymentsControllers from '../controllers/payments.controllers';

const PaymentsRoutes = (router: express.Router) => {   
    router.get('/payments', PaymentsControllers.getAllPayments);
    router.post('/payment', PaymentsControllers.createPayment);
    router.get('/payments/:id', PaymentsControllers.getPaymentById);
    router.put('/payments/:id', PaymentsControllers.updatePayment);
    router.delete('/payments/:id', PaymentsControllers.deletePayment);
}

export default PaymentsRoutes;