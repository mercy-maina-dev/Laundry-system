import getpool from "../db/config";


export const getAllOrders = async () => {
    const pool = await getpool();
    const results = await pool.request().query(`
        SELECT 
            o.order_id,
            o.user_id,
            u.full_name AS customer_name,
            u.email AS customer_email,
            u.phone AS customer_phone,
            o.total_price,
            o.status,
            o.created_at,
            o.pickup_address,
            o.delivery_address,
            o.total_weight,
            o.assigned_driver_id,
            ISNULL(
                STUFF((
                    SELECT ', ' + s.name
                    FROM OrderItems oi
                    INNER JOIN Services s ON oi.service_id = s.service_id
                    WHERE oi.order_id = o.order_id
                    FOR XML PATH('')
                ), 1, 2, ''),
                ''
            ) AS service_name,
            ISNULL(
                STUFF((
                    SELECT ', ' + oi.description
                    FROM OrderItems oi
                    WHERE oi.order_id = o.order_id
                    FOR XML PATH('')
                ), 1, 2, ''),
                ''
            ) AS items
        FROM Orders o
        LEFT JOIN Users u ON o.user_id = u.user_id
        ORDER BY o.created_at DESC
    `);
    return results.recordset;
};


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
            INSERT INTO Orders (
                user_id, pickup_address, delivery_address, pickup_date, delivery_date, 
                total_weight, total_price, status, 
                pickup_latitude, pickup_longitude, delivery_latitude, delivery_longitude,
                pickup_distance_km, delivery_distance_km, estimated_pickup_time
            ) VALUES (
                @user_id, @pickup_address, @delivery_address, @pickup_date, @delivery_date,
                @total_weight, @total_price, @status,
                @pickup_latitude, @pickup_longitude, @delivery_latitude, @delivery_longitude,
                @pickup_distance_km, @delivery_distance_km, @estimated_pickup_time
            )
        `);

    return { message: 'Order added successfully' };
};


export const getOrderById = async (id: number) => {
    const pool = await getpool();
    const result = await pool
        .request()
        .input('id', id)
        .query(`
            SELECT 
                o.order_id,
                o.user_id,
                u.full_name AS customer_name,
                u.email AS customer_email,
                u.phone AS customer_phone,
                o.total_price,
                o.status,
                o.created_at,
                o.pickup_address,
                o.delivery_address,
                o.total_weight,
                o.assigned_driver_id,
                ISNULL(
                    STUFF((
                        SELECT ', ' + s.name
                        FROM OrderItems oi
                        INNER JOIN Services s ON oi.service_id = s.service_id
                        WHERE oi.order_id = o.order_id
                        FOR XML PATH('')
                    ), 1, 2, ''),
                    ''
                ) AS service_name,
                ISNULL(
                    STUFF((
                        SELECT ', ' + oi.description
                        FROM OrderItems oi
                        WHERE oi.order_id = o.order_id
                        FOR XML PATH('')
                    ), 1, 2, ''),
                    ''
                ) AS items
            FROM Orders o
            LEFT JOIN Users u ON o.user_id = u.user_id
            WHERE o.order_id = @id
        `);
    return result.recordset[0] || null;
};


export const deleteOrderById = async (id: number) => {
    const pool = await getpool();

    await pool.request()
        .input('id', id)
        .query('DELETE FROM Deliveries WHERE order_id = @id');

    await pool.request()
        .input('id', id)
        .query('DELETE FROM OrderItems WHERE order_id = @id');
    
    await pool.request()
        .input('id', id)
        .query('DELETE FROM Payments WHERE order_id = @id');
    
    await pool.request()
        .input('id', id)
        .query('DELETE FROM PickupDelivery WHERE order_id = @id');
    
    await pool.request()
        .input('id', id)
        .query('DELETE FROM OrderStatusHistory WHERE order_id = @id');
    
    await pool.request()
        .input('id', id)
        .query('DELETE FROM CustomerFeedback WHERE order_id = @id');
    
    // Finally delete the order
    const result = await pool
        .request()
        .input('id', id)
        .query('DELETE FROM Orders WHERE order_id = @id');
    
    return result;
};


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
        .query(`
            UPDATE Orders 
            SET 
                user_id = @user_id, 
                pickup_address = @pickup_address, 
                delivery_address = @delivery_address, 
                pickup_date = @pickup_date, 
                delivery_date = @delivery_date, 
                total_weight = @total_weight, 
                total_price = @total_price, 
                status = @status 
            WHERE order_id = @id
        `);
    
    if (result.rowsAffected[0] === 0) {
        return null;
    }
    return { message: 'Order updated successfully' };
};


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
        
        console.log(` Order ${order_id} status updated to ${status}`);
        return { 
            success: true, 
            message: `Order ${order_id} status updated to ${status}` 
        };
        
    } catch (error) {
        console.error(` Error updating order ${order_id} status:`, error);
        throw error;
    }
};