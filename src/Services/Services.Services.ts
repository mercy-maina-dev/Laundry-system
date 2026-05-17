//import { updateService } from './../repositories/Services.repositories';
import * as ServicesRepository from '../repositories/Services.repositories';
import dotenv from 'dotenv';
import { NewServices, Services, UpdateServices, } from '../Types/Services.type';
dotenv.config();
//get all services
export const getAllServices=async()=> await ServicesRepository.getAllServices()

//create a new service
export const createService=async(service: NewServices)=> await ServicesRepository.createService(service)

//get a service by id
export const getServiceById=async(id:number):Promise<Services | null>=> await ServicesRepository.getServiceById(id)

//update a service
export const updateServices=async(id:number,service: UpdateServices)=>{
    return await ServicesRepository.updateService(id,service);
};


//delete a service
export const deleteService=async(id:number)=>{
    return await ServicesRepository.deleteService(id);
};