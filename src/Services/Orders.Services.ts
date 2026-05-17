//import { Orders } from './../Types/Orders.type';
import * as OrdersRepository from '../repositories/Orders.repositories';
import dotenv from 'dotenv';
import { NewOrders, Orders, UpdateOrders } from '../Types/Orders.type';
dotenv.config();
//get all orders
export const getAllOrders=async()=> await OrdersRepository.getAllOrders()

//create a new order
export const createOrder=async(order: NewOrders)=> await OrdersRepository.createOrder(order)    
//get an order by id
export const getOrderById=async(id:number):Promise<Orders | null>=> await OrdersRepository.getOrderById(id) 
//update an order
export const updateOrder=async(id:number,order: UpdateOrders)=>{
    return await OrdersRepository.updateOrderById(id,order);
};
//delete an order
export const deleteOrder=async(id:number)=>{
    return await OrdersRepository.deleteOrderById(id);
};  