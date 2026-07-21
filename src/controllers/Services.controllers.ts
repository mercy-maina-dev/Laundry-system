
import { Request,Response } from "express";
import getpool from "../db/config";//establish a connection pool to the database
import * as getAllServicesServices from '../Services/Services.Services';// Import all functions from the UsersService module to handle business logic related to users


export const getAllServices=async(req:Request,res:Response)=>{ 
    console.log('Fetching all services...');
    try {
        const Services =await getAllServicesServices.getAllServices();
            
        res.status(200).json({Services});
    } catch (error: any) {
        console.error('Error retrieving services:', error);
        res.status(500).json({error:'Internal server error'});
    };  
} 


export const createService=async(req:Request,res:Response)=>{
    const services=req.body;
    try {
        const result=await getAllServicesServices.createService(services);
        res.status(201).json({message:'Service created successfully'});
    } catch (error: any) {
        console.error('Error creating service:', error);
        res.status(500).json({error:'Internal server error'});
    }

}

//get a service by id
export const getServiceById=async(req:Request,res:Response)=>{
    const id=parseInt(req.params.id.toString());
    if(isNaN(id)){
        return res.status(400).json({error:'Invalid service id'});
    }   
    try {
        const service=await getAllServicesServices.getServiceById(id);
        if(!service){
            return res.status(404).json({error:'Service not found'});
        }
        res.status(200).json({service});
    } catch (error: any) {
        console.error('Error retrieving service:', error);
        res.status(500).json({error:'Internal server error'});
    }
}



//update a servicE
export const updateServices=async(req:Request,res:Response)=>{
    const id=parseInt(req.params.id.toString());
    if(isNaN(id)){
        return res.status(400).json({error:'Invalid service id'});
    }
    try {
        const serviceData=req.body;
        const result=await getAllServicesServices.updateServices(id,serviceData);

        if(!result){
            return res.status(404).json({message:'Service not found'});
        }
        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error updating service:', error);
        res.status(500).json({error:'Internal server error'});
    }   
}

//delete a service
export const deleteService=async(req:Request,res:Response)=>{
    const id=parseInt(req.params.id.toString());
    if(isNaN(id)){
        return res.status(400).json({error:'Invalid service id'});
    }
    try {
        const result=await getAllServicesServices.deleteService(id);
        if(!result){
            return res.status(404).json({message:'Service not found'});
        }
        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error deleting service:', error);
        res.status(500).json({error:'Internal server error'});
    }
}