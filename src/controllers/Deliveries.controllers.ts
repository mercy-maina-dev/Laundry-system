import {Request, Response} from 'express';
import * as getAllDeliveriesServices from '../Services/Deliveries.Services';
import getpool from '../db/config';

//get all deliveries
export const getAllDeliveries=async(req:Request,res:Response)=>{
    try {   
        const deliveries=await getAllDeliveriesServices.getAllDeliveries();
        res.status(200).json({deliveries});
    }   
        catch (error: any) {    
        console.error('Error retrieving deliveries:', error);
        res.status(500).json({error:'Internal server error'});
    }   
}

//create a new delivery
export const createDelivery=async(req:Request,res:Response)=>{
    const delivery=req.body;    
    try {
        const result=await getAllDeliveriesServices.createDelivery(delivery);
        res.status(201).json({message: 'Delivery created successfully'});
    }   
        catch (error: any) {    
        console.error('Error creating delivery:', error);
        res.status(500).json({error:'Internal server error'});
    }
}

//get a delivery by id      
export const getDeliveryById=async(req:Request,res:Response)=>{
    const id=parseInt(req.params.id.toString());
    if(isNaN(id)){  
        return res.status(400).json({error:'Invalid delivery id'});
    }
    try {
        const delivery=await getAllDeliveriesServices.getDeliveryById(id);
        if(!delivery){
            return res.status(404).json({error:'Delivery not found'});
        }   
        res.status(200).json({delivery});
    }
        catch (error: any) {    
        console.error('Error retrieving delivery:', error);
        res.status(500).json({error:'Internal server error'});
    }   
}

//delete a delivery by id   
export const deleteDeliveryById=async(req:Request,res:Response)=>{
    const id=parseInt(req.params.id.toString());
    if(isNaN(id)){
        return res.status(400).json({error:'Invalid delivery id'});
    }   
    try {
        const result=await getAllDeliveriesServices.deleteDeliveryById(id);
        if(result.rowsAffected[0]===0){ 
            return res.status(404).json({error:'Delivery not found'});
        }
        res.status(200).json({message:'Delivery deleted successfully'});
    }   catch (error: any) {    
        console.error('Error deleting delivery:', error);
        res.status(500).json({error:'Internal server error'});
    }   
}

//update a delivery by id    
export const updateDeliveryById=async(req:Request,res:Response)=>{
    const id=parseInt(req.params.id.toString());    
    if(isNaN(id)){
        return res.status(400).json({error:'Invalid delivery id'});
    }   
    const delivery=req.body;
    try {
        const result=await getAllDeliveriesServices.updateDeliveryById(id, delivery);   
        if(result.rowsAffected[0]===0){ 
            return res.status(404).json({error:'Delivery not found'});
        }
        res.status(200).json({message:'Delivery updated successfully'});
    }   catch (error: any) {    
        console.error('Error updating delivery:', error);
        res.status(500).json({error:'Internal server error'});
    }
}

//get a delivery by order id
export const getDeliveryByOrderId=async(req:Request,res:Response)=>{
    const orderId=parseInt(req.params.orderId.toString());  
    if(isNaN(orderId)){ 
        return res.status(400).json({error:'Invalid order id'});
    }
    try {
        const pool= await getpool();
        const result=await pool
        .request()  
        .input('orderId', orderId)
        .query('SELECT * FROM Deliveries WHERE order_id = @orderId');
        const delivery=result.recordset[0] || null;
        if(!delivery){
            return res.status(404).json({error:'Delivery not found for the given order id'});
        }
        res.status(200).json({delivery});   
    }   catch (error: any) {    
        console.error('Error retrieving delivery by order id:', error);
        res.status(500).json({error:'Internal server error'});
    }
}


//get a delivery by driver id