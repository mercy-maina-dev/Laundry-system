import getpool from "../db/config";

//getting all orders
export const getAllOrders = async () => {
    const pool = await getpool();
    const results = await pool.request().query('SELECT * FROM Orders');
    return results.recordset;
}

//adding orders
export const createOrder = async (Orders: any) => {
    const pool = await getpool();

    await pool
        .request()
        .input('user_id', Orders.user_id)
        .input('pickup_address', Orders.pickup_address)
        .input('delivery_address', Orders.delivery_address)
        .input('pickup_date', Orders.pickup_date)
        .input('delivery_date', Orders.delivery_date)
        .input('total_weight', Orders.total_weight)
        .input('total_price', Orders.total_price)
        .input('status', Orders.status)
        .input('pickup_latitude', Orders.pickup_latitude)
        .input('pickup_longitude', Orders.pickup_longitude)
        .input('delivery_latitude', Orders.delivery_latitude)
        .input('delivery_longitude', Orders.delivery_longitude)
        .input('pickup_distance_km', Orders.pickup_distance_km)
        .input('delivery_distance_km', Orders.delivery_distance_km)
        .input('estimated_pickup_time', Orders.estimated_pickup_time)
        .query(`
            INSERT INTO Orders 
            (user_id, pickup_address, delivery_address, pickup_date, delivery_date, total_weight, total_price, status, pickup_latitude, pickup_longitude, delivery_latitude, delivery_longitude, pickup_distance_km, delivery_distance_km, estimated_pickup_time)
            VALUES 
            (@user_id, @pickup_address, @delivery_address, @pickup_date, @delivery_date, @total_weight, @total_price, @status)
        `);

    return { message: 'Order added successfully' };
};

//get order by id
export const getOrderById = async (id: number) => {
    const pool = await getpool();
    const result = await pool
        .request()
        .input('id', id)
        .query('SELECT * FROM Orders WHERE order_id = @id');
    return result.recordset[0] || null;
};

//deleting order by id
export const deleteOrderById = async (id: number) => {
    const pool = await getpool();
    const result = await pool
        .request()
        .input('id', id)
        .query('DELETE FROM Orders WHERE order_id = @id');
    return result;
};

//update order by id        
export const updateOrderById = async (id: number, Orders: any) => {
    const pool = await getpool();
    const result = await pool
        .request()
        .input('id', id)
        .input('user_id', Orders.user_id)
        .input('pickup_address', Orders.pickup_address)
        .input('delivery_address', Orders.delivery_address)
        .input('pickup_date', Orders.pickup_date)
        .input('delivery_date', Orders.delivery_date)
        .input('total_weight', Orders.total_weight)
        .input('total_price', Orders.total_price)
        .input('status', Orders.status)
        .query('UPDATE Orders SET user_id = @user_id, pickup_address = @pickup_address, delivery_address = @delivery_address, pickup_date = @pickup_date, delivery_date = @delivery_date, total_weight = @total_weight, total_price = @total_price, status = @status WHERE order_id = @id');
    
    if (result.rowsAffected[0] === 0) {
        return null;
    }
    return { message: 'Order updated successfully' };
};

// ==========================
// UPDATE ORDER STATUS (ADD THIS NEW FUNCTION)
// ==========================
export const updateOrderStatus = async (order_id: number, status: string) => {
    const pool = await getpool();
    
    try {
        const result = await pool
            .request()
            .input('order_id', order_id)
            .input('status', status)
            .input('updated_at', new Date())
            .query(`
                UPDATE Orders 
                SET 
                    status = @status,
                    updated_at = @updated_at
                WHERE order_id = @order_id
            `);
        
        if (result.rowsAffected[0] === 0) {
            console.log(`⚠️ Order with ID ${order_id} not found`);
            return { 
                success: false, 
                message: `Order with ID ${order_id} not found` 
            };
        }
        
        console.log(`✅ Order ${order_id} status updated to ${status}`);
        return { 
            success: true, 
            message: `Order ${order_id} status updated to ${status}` 
        };
        
    } catch (error) {
        console.error(`❌ Error updating order ${order_id} status:`, error);
        throw error;
    }
};