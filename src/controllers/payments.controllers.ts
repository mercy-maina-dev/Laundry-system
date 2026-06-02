import { Request, Response } from "express";
import * as PaymentsService from "../Services/payments.Services";

// GET ALL
export const getAllPayments = async (req: Request, res: Response) => {
  const payments = await PaymentsService.getAllPayments();
  res.json(payments);
};

// CREATE
export const createPayment = async (req: Request, res: Response) => {
  const payment = await PaymentsService.createPayment(req.body);
  res.json(payment);
};

// GET BY ID
export const getPaymentById = async (req: Request, res: Response) => {
  const payment = await PaymentsService.getPaymentById(Number(req.params.id));

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  res.json(payment);
};

// UPDATE
export const updatePayment = async (req: Request, res: Response) => {
  const payment = await PaymentsService.updatePayment(
    Number(req.params.id),
    req.body
  );

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  res.json(payment);
};

// DELETE
export const deletePayment = async (req: Request, res: Response) => {
  const payment = await PaymentsService.deletePayment(Number(req.params.id));

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  res.json(payment);
};