import getpool from "../db/config";

export interface Settings {
    setting_id?: number;
    store_name: string;
    store_address: string;
    contact_phone: string;
    operating_hours: string;
    pickup_fee: number;
    delivery_fee: number;
    theme: string;
    currency: string;
    maintenance_mode: boolean;
    business_email: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    pickup_slots: string;
    delivery_slots: string;
    service_radius: number;
    min_order: number;
    tax_rate: number;
    notification_email: boolean;
    notification_sms: boolean;
    notification_push: boolean;
    enable_pickup_fee: boolean;
    enable_delivery_fee: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export const getSettings = async (): Promise<Settings | null> => {
    const pool = await getpool();
    const result = await pool.request().query("SELECT TOP 1 * FROM Settings ORDER BY setting_id");
    return result.recordset[0] || null;
}

export const updateSettings = async (settings: Settings): Promise<Settings> => {
    const pool = await getpool();
    
    // Check if settings exist
    const existing = await getSettings();
    
    if (existing) {
        // Update existing
        await pool.request()
            .input('store_name', settings.store_name)
            .input('store_address', settings.store_address)
            .input('contact_phone', settings.contact_phone)
            .input('operating_hours', settings.operating_hours)
            .input('pickup_fee', settings.pickup_fee)
            .input('delivery_fee', settings.delivery_fee)
            .input('theme', settings.theme)
            .input('currency', settings.currency)
            .input('maintenance_mode', settings.maintenance_mode ? 1 : 0)
            .input('business_email', settings.business_email)
            .input('facebook', settings.facebook || null)
            .input('instagram', settings.instagram || null)
            .input('twitter', settings.twitter || null)
            .input('pickup_slots', settings.pickup_slots)
            .input('delivery_slots', settings.delivery_slots)
            .input('service_radius', settings.service_radius)
            .input('min_order', settings.min_order)
            .input('tax_rate', settings.tax_rate)
            .input('notification_email', settings.notification_email ? 1 : 0)
            .input('notification_sms', settings.notification_sms ? 1 : 0)
            .input('notification_push', settings.notification_push ? 1 : 0)
            .input('enable_pickup_fee', settings.enable_pickup_fee ? 1 : 0)
            .input('enable_delivery_fee', settings.enable_delivery_fee ? 1 : 0)
            .input('updated_at', new Date())
            .query(`
                UPDATE Settings SET 
                    store_name = @store_name,
                    store_address = @store_address,
                    contact_phone = @contact_phone,
                    operating_hours = @operating_hours,
                    pickup_fee = @pickup_fee,
                    delivery_fee = @delivery_fee,
                    theme = @theme,
                    currency = @currency,
                    maintenance_mode = @maintenance_mode,
                    business_email = @business_email,
                    facebook = @facebook,
                    instagram = @instagram,
                    twitter = @twitter,
                    pickup_slots = @pickup_slots,
                    delivery_slots = @delivery_slots,
                    service_radius = @service_radius,
                    min_order = @min_order,
                    tax_rate = @tax_rate,
                    notification_email = @notification_email,
                    notification_sms = @notification_sms,
                    notification_push = @notification_push,
                    enable_pickup_fee = @enable_pickup_fee,
                    enable_delivery_fee = @enable_delivery_fee,
                    updated_at = @updated_at
                WHERE setting_id = 1
            `);
    } else {
        // Insert new
        await pool.request()
            .input('store_name', settings.store_name)
            .input('store_address', settings.store_address)
            .input('contact_phone', settings.contact_phone)
            .input('operating_hours', settings.operating_hours)
            .input('pickup_fee', settings.pickup_fee)
            .input('delivery_fee', settings.delivery_fee)
            .input('theme', settings.theme)
            .input('currency', settings.currency)
            .input('maintenance_mode', settings.maintenance_mode ? 1 : 0)
            .input('business_email', settings.business_email)
            .input('facebook', settings.facebook || null)
            .input('instagram', settings.instagram || null)
            .input('twitter', settings.twitter || null)
            .input('pickup_slots', settings.pickup_slots)
            .input('delivery_slots', settings.delivery_slots)
            .input('service_radius', settings.service_radius)
            .input('min_order', settings.min_order)
            .input('tax_rate', settings.tax_rate)
            .input('notification_email', settings.notification_email ? 1 : 0)
            .input('notification_sms', settings.notification_sms ? 1 : 0)
            .input('notification_push', settings.notification_push ? 1 : 0)
            .input('enable_pickup_fee', settings.enable_pickup_fee ? 1 : 0)
            .input('enable_delivery_fee', settings.enable_delivery_fee ? 1 : 0)
            .query(`
                INSERT INTO Settings (
                    store_name, store_address, contact_phone, operating_hours,
                    pickup_fee, delivery_fee, theme, currency,
                    maintenance_mode, business_email,
                    facebook, instagram, twitter,
                    pickup_slots, delivery_slots, service_radius, min_order, tax_rate,
                    notification_email, notification_sms, notification_push,
                    enable_pickup_fee, enable_delivery_fee,
                    created_at
                ) VALUES (
                    @store_name, @store_address, @contact_phone, @operating_hours,
                    @pickup_fee, @delivery_fee, @theme, @currency,
                    @maintenance_mode, @business_email,
                    @facebook, @instagram, @twitter,
                    @pickup_slots, @delivery_slots, @service_radius, @min_order, @tax_rate,
                    @notification_email, @notification_sms, @notification_push,
                    @enable_pickup_fee, @enable_delivery_fee,
                    GETDATE()
                )
            `);
    }
    
    return settings;
}