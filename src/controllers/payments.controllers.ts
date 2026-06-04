import { Request, Response } from "express";
import * as PaymentsService from "../Services/payments.Services";

// GET ALL
export const getAllPayments = async (req: Request, res: Response) => {
  const payments = await PaymentsService.getAllPayments();
  res.json(payments);
};

// CREATE
export const createPayment = async (req: Request, res: Response) => {
  try {
    const paymentData = {
      ...req.body,
      result_code: 0,
      result_desc: "Success"
    };
    
    const payment = await PaymentsService.createPayment(paymentData);
    res.status(201).json({
      success: true,
      data: payment,
      message: "Payment created successfully"
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message
    });
  }
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