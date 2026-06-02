export interface PickupDelivery {
    record_id?: number;
    order_id: number;
    driver_id: number;
    type: 'PICKUP' | 'DELIVERY';
    status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    latitude?: number;
    longitude?: number;
    location_address: string;
    customer_photo_url?: string;
    cloths_photo_url?: string;
    signature_url?: string;
    notes?: string;
    assigned_at?: Date;
    started_at?: Date;
    completed_at?: Date;
    customer_confirmed?: boolean;
    confirmed_at?: Date;
}

export interface DriverLocation {
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
}

export interface GeofenceZone {
    zone_id?: number;
    order_id: number;
    type: 'PICKUP' | 'DELIVERY';
    center_latitude: number;
    center_longitude: number;
    radius_meters: number;
}

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