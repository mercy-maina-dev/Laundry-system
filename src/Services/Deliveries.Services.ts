import * as Deliveriesrepositories from "../repositories/Deliveries.repositories";
import dotenv from 'dotenv';
import { Deliveries, NewDeliveries, UpdateDeliveries } from "../Types/Deliveries.type";
dotenv.config();

export const getAllDeliveries=async(): Promise<Deliveries[]>=>{
    return await Deliveriesrepositories.getAllDeliveries();
}
//create a new delivery
export const createDelivery=async(delivery: NewDeliveries)=>{
    return await Deliveriesrepositories.createDelivery(delivery);
}   

//get a delivery by id
export const getDeliveryById=async(id:number): Promise<Deliveries | null>=>{
    return await Deliveriesrepositories.getDeliveryById(id);
}
//delete a delivery by id
export const deleteDeliveryById=async(id:number)=>{
    return await Deliveriesrepositories.deleteDeliveryById(id);
}
//update a delivery by id
export const updateDeliveryById=async(id:number, delivery: UpdateDeliveries)=>{
    return await Deliveriesrepositories.updateDeliveryById(id, delivery);
}
