import { Request,Response } from "express";
import getpool from "../db/config";
import * as getAllOrdersServices from '../Services/Orders.Services';

//get all orders

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const Orders = await getAllOrdersServices.getAllOrders();
        res.status(200).json({ Orders });
    } catch (error: any) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            details: error.message,
            stack: error.stack 
        });
    }
};


//create a new order
export const createOrder=async(req:Request,res:Response)=>{
    const order=req.body;   
    try {
        const result=await getAllOrdersServices.createOrder(order);
        res.status(201).json(result);
    } catch (error: any) {
        console.error('Error creating order:', error);
        res.status(500).json({error:'Internal server error'});
    }   
}

//get an order by id
export const getOrderById=async(req:Request,res:Response)=>{
    const id=parseInt(req.params.id.toString());
    if(isNaN(id)){
        return res.status(400).json({error:'Invalid order id'});
    }   
    try {
        const order=await getAllOrdersServices.getOrderById(id);
        if(!order){
            return res.status(404).json({error:'Order not found'});
        }   
        res.status(200).json({order});
    } catch (error: any) {
        console.error('Error retrieving order:', error);
        res.status(500).json({error:'Internal server error'});
    }
}
//update an order
export const updateOrder = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id.toString());
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid order id' });
    }
    
    try {
        const orderData = req.body;
        
        // Get existing order first
        const existingOrder = await getAllOrdersServices.getOrderById(id);
        if (!existingOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Merge only the fields that are provided
        const updatedOrder = {
            ...existingOrder,
            ...orderData
        };

        const result = await getAllOrdersServices.updateOrder(id, updatedOrder);
        if (!result) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.status(200).json({ 
            message: 'Order updated successfully',
            order: updatedOrder 
        });
    } catch (error: any) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//delete an order   
export const deleteOrder=async(req:Request,res:Response)=>{
    const id=parseInt(req.params.id.toString());        
    if(isNaN(id)){
        return res.status(400).json({error:'Invalid order id'});
    }
    try {
        const result=await getAllOrdersServices.deleteOrder(id);
        if(!result){
            return res.status(404).json({error:'Order not found'});
        }   
        res.status(200).json({message:'Order deleted successfully'});
    } catch (error: any) {
        console.error('Error deleting order:', error);
         if (error.message && error.message.includes('FOREIGN KEY')) {
        return res.status(400).json({ 
            error: 'Cannot delete order because it has related records (payments, items, etc.)' 
        });
    }
        res.status(500).json({error:'Internal server error'});
    }   
};

