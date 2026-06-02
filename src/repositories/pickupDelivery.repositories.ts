import getpool from "../db/config";
import { PickupDelivery, DriverLocation, GeofenceZone, DriverRoute } from "../Types/PickupDelivery.type";


export const assignPickup = async (data: PickupDelivery) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('order_id', data.order_id)
        .input('driver_id', data.driver_id)
        .input('type', 'PICKUP')
        .input('status', 'ASSIGNED')
        .input('location_address', data.location_address)
        .input('notes', data.notes || null)
        .query(`INSERT INTO PickupDelivery (order_id, driver_id, type, status, location_address, notes, assigned_at) 
                VALUES (@order_id, @driver_id, @type, @status, @location_address, @notes, GETDATE())`);
    return { message: 'Driver assigned for pickup successfully', record_id: result.recordset?.[0]?.record_id };
}

export const assignDelivery = async (data: PickupDelivery) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('order_id', data.order_id)
        .input('driver_id', data.driver_id)
        .input('type', 'DELIVERY')
        .input('status', 'ASSIGNED')
        .input('location_address', data.location_address)
        .input('notes', data.notes || null)
        .query(`INSERT INTO PickupDelivery (order_id, driver_id, type, status, location_address, notes, assigned_at) 
                VALUES (@order_id, @driver_id, @type, @status, @location_address, @notes, GETDATE())`);
    return { message: 'Driver assigned for delivery successfully', record_id: result.recordset?.[0]?.record_id };
}

export const startPickup = async (record_id: number, latitude: number, longitude: number) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('record_id', record_id)
        .input('latitude', latitude)
        .input('longitude', longitude)
        .input('started_at', new Date())
        .query(`UPDATE PickupDelivery 
                SET status = 'IN_PROGRESS', started_at = @started_at, latitude = @latitude, longitude = @longitude 
                WHERE record_id = @record_id`);
    return { message: 'Pickup started successfully' };
}

export const completePickup = async (record_id: number, customer_photo_url?: string, cloths_photo_url?: string, signature_url?: string) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('record_id', record_id)
        .input('customer_photo_url', customer_photo_url || null)
        .input('cloths_photo_url', cloths_photo_url || null)
        .input('signature_url', signature_url || null)
        .input('completed_at', new Date())
        .query(`UPDATE PickupDelivery 
                SET status = 'COMPLETED', completed_at = @completed_at, 
                    customer_photo_url = @customer_photo_url, 
                    cloths_photo_url = @cloths_photo_url, 
                    signature_url = @signature_url 
                WHERE record_id = @record_id`);
    
    await pool.request()
        .input('order_id', record_id)
        .query(`UPDATE Orders SET actual_pickup_time = GETDATE(), status = 'PICKED_UP' WHERE order_id = (SELECT order_id FROM PickupDelivery WHERE record_id = @record_id)`);
    
    return { message: 'Pickup completed successfully' };
}

export const startDelivery = async (record_id: number, latitude: number, longitude: number) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('record_id', record_id)
        .input('latitude', latitude)
        .input('longitude', longitude)
        .input('started_at', new Date())
        .query(`UPDATE PickupDelivery 
                SET status = 'IN_PROGRESS', started_at = @started_at, latitude = @latitude, longitude = @longitude 
                WHERE record_id = @record_id`);
    return { message: 'Delivery started successfully' };
}

export const completeDelivery = async (record_id: number, customer_confirmed: boolean = true) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('record_id', record_id)
        .input('customer_confirmed', customer_confirmed ? 1 : 0)
        .input('confirmed_at', new Date())
        .input('completed_at', new Date())
        .query(`UPDATE PickupDelivery 
                SET status = 'COMPLETED', completed_at = @completed_at, 
                    customer_confirmed = @customer_confirmed, confirmed_at = @confirmed_at 
                WHERE record_id = @record_id`);
    
    await pool.request()
        .input('record_id', record_id)
        .query(`UPDATE Orders SET actual_delivery_time = GETDATE(), status = 'DELIVERED' WHERE order_id = (SELECT order_id FROM PickupDelivery WHERE record_id = @record_id)`);
    
    return { message: 'Delivery completed successfully' };
}

export const updateDriverLiveLocation = async (data: DriverLocation) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('driver_id', data.driver_id)
        .input('order_id', data.order_id || null)
        .input('latitude', data.latitude)
        .input('longitude', data.longitude)
        .input('speed', data.speed || null)
        .input('heading', data.heading || null)
        .input('accuracy', data.accuracy || null)
        .input('battery_level', data.battery_level || null)
        .input('is_moving', data.is_moving ? 1 : 0)
        .query(`INSERT INTO DriverLiveTracking (driver_id, order_id, latitude, longitude, speed, heading, accuracy, battery_level, is_moving, last_update) 
                VALUES (@driver_id, @order_id, @latitude, @longitude, @speed, @heading, @accuracy, @battery_level, @is_moving, GETDATE())`);
    return { message: 'Driver location updated' };
}

export const getDriverLiveLocation = async (driver_id: number) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('driver_id', driver_id)
        .query(`SELECT TOP 1 * FROM DriverLiveTracking WHERE driver_id = @driver_id ORDER BY last_update DESC`);
    return result.recordset[0] || null;
}

export const getDriverActiveTasks = async (driver_id: number) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('driver_id', driver_id)
        .query(`SELECT p.*, o.pickup_latitude, o.pickup_longitude, o.delivery_latitude, o.delivery_longitude,
                       o.pickup_address, o.delivery_address, u.full_name as customer_name, u.phone as customer_phone
                FROM PickupDelivery p
                INNER JOIN Orders o ON p.order_id = o.order_id
                INNER JOIN Users u ON o.user_id = u.user_id
                WHERE p.driver_id = @driver_id AND p.status IN ('ASSIGNED', 'IN_PROGRESS')
                ORDER BY p.assigned_at ASC`);
    return result.recordset;
}

export const getOrderPickupDelivery = async (order_id: number) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('order_id', order_id)
        .query(`SELECT p.*, u.full_name as driver_name, u.phone as driver_phone
                FROM PickupDelivery p
                LEFT JOIN Users u ON p.driver_id = u.user_id
                WHERE p.order_id = @order_id
                ORDER BY p.assigned_at DESC`);
    return result.recordset;
}

export const createGeofenceZone = async (data: GeofenceZone) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('order_id', data.order_id)
        .input('type', data.type)
        .input('center_latitude', data.center_latitude)
        .input('center_longitude', data.center_longitude)
        .input('radius_meters', data.radius_meters)
        .query(`INSERT INTO GeofenceZones (order_id, type, center_latitude, center_longitude, radius_meters) 
                VALUES (@order_id, @type, @center_latitude, @center_longitude, @radius_meters)`);
    return { message: 'Geofence zone created' };
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
        .query(`INSERT INTO DriverRoutes (driver_id, order_id, route_type, start_latitude, start_longitude, end_latitude, end_longitude, total_distance_km, total_duration_minutes, route_data) 
                VALUES (@driver_id, @order_id, @route_type, @start_latitude, @start_longitude, @end_latitude, @end_longitude, @total_distance_km, @total_duration_minutes, @route_data)`);
    return { message: 'Driver route saved' };
}

export const getNearestDrivers = async (latitude: number, longitude: number, radiusKm: number = 5) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('latitude', latitude)
        .input('longitude', longitude)
        .input('radius', radiusKm)
        .query(`SELECT d.*, u.username, u.phone, 
                       (6371 * ACOS(COS(RADIANS(@latitude)) * COS(RADIANS(d.latitude)) * 
                       COS(RADIANS(d.longitude) - RADIANS(@longitude)) + 
                       SIN(RADIANS(@latitude)) * SIN(RADIANS(d.latitude)))) AS distance_km
                FROM DriverLiveTracking d
                INNER JOIN Users u ON d.driver_id = u.user_id
                WHERE d.last_update > DATEADD(MINUTE, -5, GETDATE())
                HAVING (6371 * ACOS(COS(RADIANS(@latitude)) * COS(RADIANS(d.latitude)) * 
                       COS(RADIANS(d.longitude) - RADIANS(@longitude)) + 
                       SIN(RADIANS(@latitude)) * SIN(RADIANS(d.latitude)))) < @radius
                ORDER BY distance_km`);
    return result.recordset;
}