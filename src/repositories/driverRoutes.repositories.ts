import getpool from "../db/config";

export interface DriverRoute {
    route_id?: number;
    driver_id: number;
    order_id: number;
    route_type: 'TO_PICKUP' | 'TO_DELIVERY';
    start_latitude: number;
    start_longitude: number;
    end_latitude: number;
    end_longitude: number;
    total_distance_km?: number;
    total_duration_minutes?: number;
    route_data?: string;
}

export const saveDriverRoute = async (data: DriverRoute) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('driver_id', data.driver_id)
        .input('order_id', data.order_id)
        .input('route_type', data.route_type)
        .input('start_latitude', data.start_latitude)
        .input('start_longitude', data.start_longitude)
        .input('end_latitude', data.end_latitude)
        .input('end_longitude', data.end_longitude)
        .input('total_distance_km', data.total_distance_km || null)
        .input('total_duration_minutes', data.total_duration_minutes || null)
        .input('route_data', data.route_data || null)
        .query(`INSERT INTO DriverRoutes (driver_id, order_id, route_type, start_latitude, start_longitude, end_latitude, end_longitude, total_distance_km, total_duration_minutes, route_data, started_at) 
                VALUES (@driver_id, @order_id, @route_type, @start_latitude, @start_longitude, @end_latitude, @end_longitude, @total_distance_km, @total_duration_minutes, @route_data, GETDATE())`);
    return { message: 'Driver route saved successfully' };
}

export const completeDriverRoute = async (route_id: number, total_distance_km: number, total_duration_minutes: number) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('route_id', route_id)
        .input('total_distance_km', total_distance_km)
        .input('total_duration_minutes', total_duration_minutes)
        .input('completed_at', new Date())
        .query(`UPDATE DriverRoutes 
                SET total_distance_km = @total_distance_km, 
                    total_duration_minutes = @total_duration_minutes, 
                    completed_at = @completed_at 
                WHERE route_id = @route_id`);
    return { message: 'Driver route completed successfully' };
}

export const getDriverRoutesByOrder = async (order_id: number) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('order_id', order_id)
        .query(`SELECT * FROM DriverRoutes WHERE order_id = @order_id ORDER BY started_at DESC`);
    return result.recordset;
}