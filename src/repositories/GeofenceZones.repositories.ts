import getpool from "../db/config";

export interface GeofenceZone {
    zone_id?: number;
    order_id: number;
    type: 'PICKUP' | 'DELIVERY';
    center_latitude: number;
    center_longitude: number;
    radius_meters: number;
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
    return { message: 'Geofence zone created successfully' };
}

export const getGeofenceZoneByOrder = async (order_id: number, type: string) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('order_id', order_id)
        .input('type', type)
        .query(`SELECT TOP 1 * FROM GeofenceZones WHERE order_id = @order_id AND type = @type`);
    return result.recordset[0] || null;
}

export const checkIfDriverInGeofence = async (order_id: number, type: string, driver_latitude: number, driver_longitude: number) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('order_id', order_id)
        .input('type', type)
        .input('driver_latitude', driver_latitude)
        .input('driver_longitude', driver_longitude)
        .query(`SELECT *, 
                    (6371 * ACOS(COS(RADIANS(@driver_latitude)) * COS(RADIANS(center_latitude)) * 
                    COS(RADIANS(center_longitude) - RADIANS(@driver_longitude)) + 
                    SIN(RADIANS(@driver_latitude)) * SIN(RADIANS(center_latitude)))) * 1000 as distance_meters
                FROM GeofenceZones 
                WHERE order_id = @order_id AND type = @type
                HAVING (6371 * ACOS(COS(RADIANS(@driver_latitude)) * COS(RADIANS(center_latitude)) * 
                        COS(RADIANS(center_longitude) - RADIANS(@driver_longitude)) + 
                        SIN(RADIANS(@driver_latitude)) * SIN(RADIANS(center_latitude)))) * 1000 <= radius_meters`);
    return result.recordset[0] || null;
}