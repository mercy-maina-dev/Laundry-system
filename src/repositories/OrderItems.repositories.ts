import getpool from "../db/config";

//getting all order items
export const getAllOrderItems=async()=>{
    const pool= await getpool();
    const results=await pool.request().query('SELECT * FROM OrderItems');
    return results.recordset;
}   
//adding order items
export const createOrderItem=async(orderItem: any)=>{
    const pool= await getpool();    
    await pool.request()    
    .input('order_id', orderItem.order_id)
    .input('service_id', orderItem.service_id)
    .input('quantity', orderItem.quantity)
    .input('price', orderItem.price)
    .query('INSERT INTO OrderItems (order_id, service_id, quantity, price) VALUES (@order_id, @service_id, @quantity, @price)');
    return {message: 'Order item added successfully'};
}

//get order item by id
export const getOrderItemById=async(id:number)=>{
    const pool= await getpool();
    const result=await pool
    .request()
    .input('id', id)
    .query('SELECT * FROM OrderItems WHERE item_id = @id');
    return result.recordset[0] || null;
};
//deleting order item by id
export const deleteOrderItemById=async(id:number)=>{
    const pool= await getpool();
    const result=await pool
    .request()
    .input('id', id)
    .query('DELETE FROM OrderItems WHERE item_id = @id');
    return result;
};
//update order item by id
export const updateOrderItemById = async (id: number, item: any) => {
    const pool = await getpool();
    
    const result = await pool
        .request()
        .input('id', id)
        .input('quantity', item.quantity)
        .input('price', item.price)
        .query(`
            UPDATE OrderItems 
            SET 
                quantity = @quantity,
                price = @price
            WHERE item_id = @id
        `);
    
    return result;
};