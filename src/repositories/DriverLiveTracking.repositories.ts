import getpool from "../db/config";

export interface DriverLiveTracking {
    tracking_id?: number;
    driver_id: number;
    order_id?: number;
    latitude: number;
    longitude: number;
    speed?: number;
    heading?: number;
    accuracy?: number;
    battery_level?: number;
    is_moving?: boolean;
    last_update?: Date;
}

export const updateDriverLocation = async (data: DriverLiveTracking) => {
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

export const getDriverCurrentLocation = async (driver_id: number) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('driver_id', driver_id)
        .query(`SELECT TOP 1 * FROM DriverLiveTracking 
                WHERE driver_id = @driver_id 
                ORDER BY last_update DESC`);
    return result.recordset[0] || null;
}

export const getDriverLocationHistory = async (driver_id: number, limit: number = 50) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('driver_id', driver_id)
        .input('limit', limit)
        .query(`SELECT TOP (@limit) * FROM DriverLiveTracking 
                WHERE driver_id = @driver_id 
                ORDER BY last_update DESC`);
    return result.recordset;
}

export const getAllActiveDrivers = async () => {
    const pool = await getpool();
    const result = await pool.request()
        .query(`SELECT DISTINCT d.driver_id, u.username, u.phone, 
                (SELECT TOP 1 latitude FROM DriverLiveTracking WHERE driver_id = d.driver_id ORDER BY last_update DESC) as latitude,
                (SELECT TOP 1 longitude FROM DriverLiveTracking WHERE driver_id = d.driver_id ORDER BY last_update DESC) as longitude,
                (SELECT TOP 1 last_update FROM DriverLiveTracking WHERE driver_id = d.driver_id ORDER BY last_update DESC) as last_active
                FROM DriverLiveTracking d
                INNER JOIN Users u ON d.driver_id = u.user_id
                WHERE d.last_update > DATEADD(MINUTE, -5, GETDATE())
                GROUP BY d.driver_id, u.username, u.phone`);
    return result.recordset;
}