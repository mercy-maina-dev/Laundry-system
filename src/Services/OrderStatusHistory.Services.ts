import * as OrderStatusHistoryRepository from "../repositories/OrderStatusHistory.repositories";
import { OrderStatusHistory, UpdateOrderStatusHistory } from "../Types/OrderStatusHistory.type";

export const getAllOrderStatusHistory = async (): Promise<OrderStatusHistory[]> => {
  return await OrderStatusHistoryRepository.getAllOrderStatusHistory();
}

export const createOrderStatusHistory = async (history: OrderStatusHistory) => {
  return await OrderStatusHistoryRepository.createOrderStatusHistory(history);
}

export const getOrderStatusHistoryById = async (id: number): Promise<OrderStatusHistory | null> => {
  return await OrderStatusHistoryRepository.getOrderStatusHistoryById(id);
}

export const getOrderStatusHistoryByOrderId = async (order_id: number): Promise<OrderStatusHistory[]> => {
  return await OrderStatusHistoryRepository.getOrderStatusHistoryByOrderId(order_id);
}

export const updateOrderStatusHistoryById = async (id: number, history: UpdateOrderStatusHistory) => {
  return await OrderStatusHistoryRepository.updateOrderStatusHistoryById(id, history);
}

export const deleteOrderStatusHistoryById = async (id: number) => {
  return await OrderStatusHistoryRepository.deleteOrderStatusHistoryById(id);
}

export const getLatestStatusByOrderId = async (order_id: number): Promise<OrderStatusHistory | null> => {
  return await OrderStatusHistoryRepository.getLatestStatusByOrderId(order_id);
}