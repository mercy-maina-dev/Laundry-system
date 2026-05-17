//import { updateServices } from './../Types/Services.type';
import getpool from "../db/config";
import { Services, UpdateServices } from "../Types/Services.type";

//get all services
export const getAllServices=async():Promise<any[]>=>{
    const pool= await getpool();
    const results=await pool.request().query('SELECT * FROM Services');
    return results.recordset;
}

//adding a service
export const createService=async(service: Services) =>{
    const pool= await getpool();
    const result=await pool.request()
    .input('service_name',service.service_name)
    .input('price_per_kg',service.price_per_kg)
    .input('description',service.description)
    .query('INSERT INTO Services (service_name, price_per_kg, description) VALUES (@service_name, @price_per_kg, @description)');
    return result.rowsAffected[0];
}

//getting a service by id
export const getServiceById=async(id:number):Promise<Services | null>=>{
    const pool= await getpool();
    const result=await pool.request()
    .input('id',id)
    .query('SELECT * FROM Services WHERE service_id=@id');
    return result.recordset[0] || null;
}
//updating a service
export const updateService=async(id:number, service: UpdateServices)=>{
    const pool= await getpool();
    const result=await pool
    .request()
    .input('id',id)
    .input('service_name',service.service_name)
    .input('price_per_kg',service.price_per_kg)
    .input('description',service.description)
    .query('UPDATE Services SET service_name=@service_name, price_per_kg=@price_per_kg, description=@description WHERE service_id=@id');
    if(result.rowsAffected[0]===0){
       return null; // No service found with the given id
    }   
    return {message: 'Service updated successfully'};
}

//deleting a service
export const deleteService=async(id:number)=>{
    const pool= await getpool();
    const result=await pool
    .request()
    .input('id',id)
    .query('DELETE FROM Services WHERE service_id=@id');
    if(result.rowsAffected[0]===0){
        return null; // No service found with the given id
    }
    return {message: 'Service deleted successfully'};
};
