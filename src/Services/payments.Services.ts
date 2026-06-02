import * as PaymentsRepository from "../repositories/payments.repositories";
import {  NewPayments, Payments, UpdatePayments } from "../Types/payments.type";

export const getAllPayments = async () =>
  await PaymentsRepository.getAllPayments();

export const createPayment = async (payment: NewPayments) =>
  await PaymentsRepository.createPayment(payment);

export const getPaymentById = async (id: number): Promise<Payments | null> =>
  await PaymentsRepository.getPaymentById(id);

export const updatePayment = async (id: number, payment: UpdatePayments) =>
  await PaymentsRepository.updatePayment(id, payment);

export const deletePayment = async (id: number) =>
  await PaymentsRepository.deletePayment(id);