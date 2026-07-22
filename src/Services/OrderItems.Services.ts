import * as OrderItemsRepository from '../repositories/Orders.repositories';
import dotenv from 'dotenv';
import { NewOrderItems, UpdateOrderItems } from '../Types/OrderItems.type';
dotenv.config();    

// NOTE: These are actually order methods, not order items.
// Rename your service file to Orders.Services.ts if you want.

export const getAllOrderItems = async () => await OrderItemsRepository.getAllOrders();
export const createOrderItem = async (orderItem: NewOrderItems) => await OrderItemsRepository.createOrder(orderItem);
export const getOrderItemById = async (id: number) => await OrderItemsRepository.getOrderById(id);
export const deleteOrderItemById = async (id: number) => await OrderItemsRepository.deleteOrderById(id);
export const updateOrderItemById = async (id: number, orderItem: UpdateOrderItems) => await OrderItemsRepository.updateOrderById(id, orderItem);