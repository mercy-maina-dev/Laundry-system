import { Router } from "express";
import { testMpesaToken } from "../controllers/Mpesa.controllers";

const router = Router();

router.get("/token", testMpesaToken);

export default router;