import getpool from "../db/config";

//getting all deliveries    

export const getAllDeliveries=async()=>{
    const pool= await getpool();
    const results=await pool.request().query('SELECT * FROM Deliveries');
    return results.recordset;
}   
//adding deliveries
export const createDelivery=async(delivery: any)=>{
    const pool= await getpool();    
    await pool.request()
    .input('order_id', delivery.order_id)   
    .input('driver_id', delivery.driver_id)
    .input('pickup_time', delivery.pickup_time)
    .input('delivery_time', delivery.delivery_time)
    .input('delivery_status', delivery.delivery_status)
    .query('INSERT INTO Deliveries (order_id, driver_id, pickup_time, delivery_time, delivery_status) VALUES (@order_id, @driver_id, @pickup_time, @delivery_time, @delivery_status)');
    return {message: 'Delivery added successfully'};
}


//get delivery by id
export const getDeliveryById=async(id:number)=>{
    const pool= await getpool();
    const result=await pool
    .request()
    .input('id', id)
    .query('SELECT * FROM Deliveries WHERE delivery_id = @id');
    return result.recordset[0] || null;
};
//deleting delivery by id
export const deleteDeliveryById=async(id:number)=>{ 
    const pool= await getpool();
    const result=await pool
    .request()
    .input('id', id)    
    .query('DELETE FROM Deliveries WHERE delivery_id = @id');
    return result;
};

//updating delivery by id
export const updateDeliveryById=async(id:number, delivery: any)=>{
    const pool= await getpool();
    const result=await pool
    .request()
    .input('id', id)
    .input('order_id', delivery.order_id)
    .input('driver_id', delivery.driver_id)
    .input('pickup_time', delivery.pick_up_time)
    .input('delivery_time', delivery.delivery_time)
    .input('delivery_status', delivery.delivery_status)
    .query('UPDATE Deliveries SET order_id = @order_id, driver_id = @driver_id, pickup_time = @pickup_time, delivery_time = @delivery_time, delivery_status = @delivery_status WHERE delivery_id = @id');
    return result;
}



