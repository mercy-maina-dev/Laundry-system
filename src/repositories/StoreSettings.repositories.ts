import getpool from "../db/config";

export interface StoreSettings {
    setting_id?: number;
    store_name: string;
    store_latitude: number;
    store_longitude: number;
    store_address: string;
    contact_phone: string;
    operating_hours?: string;
}

export const getStoreSettings = async () => {
    const pool = await getpool();
    const result = await pool.request()
        .query(`SELECT TOP 1 * FROM StoreSettings`);
    return result.recordset[0] || null;
}

export const updateStoreSettings = async (data: StoreSettings) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('store_name', data.store_name)
        .input('store_latitude', data.store_latitude)
        .input('store_longitude', data.store_longitude)
        .input('store_address', data.store_address)
        .input('contact_phone', data.contact_phone)
        .input('operating_hours', data.operating_hours || null)
        .input('updated_at', new Date())
        .query(`UPDATE StoreSettings 
                SET store_name = @store_name, 
                    store_latitude = @store_latitude, 
                    store_longitude = @store_longitude, 
                    store_address = @store_address, 
                    contact_phone = @contact_phone, 
                    operating_hours = @operating_hours,
                    updated_at = @updated_at 
                WHERE setting_id = 1`);
    return { message: 'Store settings updated successfully' };
}