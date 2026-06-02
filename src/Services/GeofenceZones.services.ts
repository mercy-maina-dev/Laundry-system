import * as GeofenceZonesRepository from "../repositories/GeofenceZones.repositories";

export const createGeofenceZone = async (data: any) => {
    return await GeofenceZonesRepository.createGeofenceZone(data);
}

export const getGeofenceZoneByOrder = async (order_id: number, type: string) => {
    return await GeofenceZonesRepository.getGeofenceZoneByOrder(order_id, type);
}

export const checkIfDriverInGeofence = async (order_id: number, type: string, driver_latitude: number, driver_longitude: number) => {
    return await GeofenceZonesRepository.checkIfDriverInGeofence(order_id, type, driver_latitude, driver_longitude);
}