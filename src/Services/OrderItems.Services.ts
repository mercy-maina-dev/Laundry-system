//import { OrderItems } from './../Types/OrderItems.type';
import * as OrderItemsRepository from '../repositories/OrderItems.repositories';
import dotenv from 'dotenv';
import { NewOrderItems, UpdateOrderItems } from '../Types/OrderItems.type';
dotenv.config();    

//get all order items
export const getAllOrderItems=async()=> await OrderItemsRepository.getAllOrderItems()   
//adding order items
export const createOrderItem=async(orderItem: NewOrderItems)=> await OrderItemsRepository.createOrderItem(orderItem)    
//get order item by id
export const getOrderItemById=async(id:number) => await OrderItemsRepository.getOrderItemById(id)
//deleting order item by id
export const deleteOrderItemById=async(id:number) => await OrderItemsRepository.deleteOrderItemById(id)
//update order item by id
export const updateOrderItemById=async(id:number, orderItem: UpdateOrderItems) => await OrderItemsRepository.updateOrderItemById(id, orderItem)
