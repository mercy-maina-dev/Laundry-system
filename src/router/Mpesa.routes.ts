import { Router } from "express";
import {
  testMpesaToken,
  initiateSTKPush,
  mpesaCallback,
  checkTransactionStatus,
  checkOrderStatus,
} from "../controllers/Mpesa.controllers";

const router = Router();

// TOKEN TEST
router.get("/token", testMpesaToken);

// STK PUSH
router.post("/stkpush", initiateSTKPush);
router.post("/callback", mpesaCallback);
// STATUS CHECKS
router.get("/status/:checkoutRequestID", checkTransactionStatus);
router.get("/orderstatus/:orderId", checkOrderStatus);

export default router;