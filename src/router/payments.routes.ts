import { Express } from "express";
import * as PaymentsControllers from '../controllers/payments.controllers';

const PaymentsRoutes=(app:Express)=>{   
    app.get('/payments', PaymentsControllers.getAllPayments);
    app.post('/payment', PaymentsControllers.createPayment);
    app.get('/payments/:id', PaymentsControllers.getPaymentById);
    app.put('/payments/:id', PaymentsControllers.updatePayment);
    app.delete('/payments/:id', PaymentsControllers.deletePayment);
}
export default PaymentsRoutes;