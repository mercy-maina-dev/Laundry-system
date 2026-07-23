import { Request,Response } from "express";
import getpool from "../db/config";//establish a connection pool to the database
import * as getAllOrderItemsServices from '../Services/OrderItems.Services';// Import all functions from the UsersService module to handle business logic related to users

//get all order items
export const getAllOrderItems=async(req:Request,res:Response)=>{ 
    try {   
        const orderItems =await getAllOrderItemsServices.getAllOrderItems();
        res.status(200).json({orderItems});
    }
        catch (error: any) {    
        console.error('Error retrieving order items:', error);
        res.status(500).json({error:'Internal server error'});
    }
}

//create a new order item   
export const createOrderItem=async(req:Request,res:Response)=>{
    const orderItem=req.body;
    try {
        const result=await getAllOrderItemsServices.createOrderItem(orderItem);
        res.status(201).json(result);
    }
        catch (error: any) {    
        console.error('Error creating order item:', error);
        res.status(500).json({error:'Internal server error'});
    }   
}

//get an order item by id   
export const getOrderItemById=async(req:Request,res:Response)=>{
    const id=parseInt(req.params.id.toString());    
    if(isNaN(id)){
        return res.status(400).json({error:'Invalid order item id'});
    }
    try {
        const orderItem=await getAllOrderItemsServices.getOrderItemById(id);    
        if(!orderItem){
            return res.status(404).json({error:'Order item not found'});
        }
        res.status(200).json({orderItem});
    }
        catch (error: any) {    
        console.error('Error retrieving order item:', error);
        res.status(500).json({error:'Internal server error'});
    }
}

//delete an order item by id    
export const deleteOrderItemById=async(req:Request,res:Response)=>{
    const id=parseInt(req.params.id.toString());
    if(isNaN(id)){
        return res.status(400).json({error:'Invalid order item id'});
    }
    try {
        const result=await getAllOrderItemsServices.deleteOrderItemById(id);
        if(result.rowsAffected[0]===0){
            return res.status(404).json({error:'Order item not found'});
        }   
        res.status(200).json({message:'Order item deleted successfully'});
    }   catch (error: any) {    
        console.error('Error deleting order item:', error);
        res.status(500).json({error:'Internal server error'});
    }
}

//update an order item by id    
export const updateOrderItemById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id.toString());
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid order item id' });
    }
    try {
        const orderItemData = req.body;
        const result: any = await getAllOrderItemsServices.updateOrderItemById(id, orderItemData);

        // Check if result has a message (error response)
        if (result && result.message) {
            return res.status(400).json({ error: result.message });
        }

        // Check if result has rowsAffected
        if (result && result.rowsAffected && result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Order item not found' });
        }

        res.status(200).json({ message: 'Order item updated successfully' });
    } catch (error: any) {
        console.error('Error updating order item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}